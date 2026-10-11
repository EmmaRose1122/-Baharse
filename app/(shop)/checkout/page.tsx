"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Phone,
  MapPin,
  User,
  FileText,
  Copy,
  Check,
  UploadCloud,
  CreditCard,
  Building2,
  Smartphone,
  AlertCircle,
  X,
} from "lucide-react";
import { checkoutSchema, CheckoutFormData } from "@/lib/validators";
import { useCartStore } from "@/store/cart-store";
import { formatPKR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { MOCK_SETTINGS } from "@/lib/supabase/mock-data";

const PAKISTANI_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Gujrat",
  "Jhelum",
  "Wah Cantt",
  "Sheikhupura",
  "Other City",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryCharges, getTotal, clearCart } =
    useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCitySelected, setCustomCitySelected] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "jazzcash" | "easypaisa" | "bank_transfer"
  >("jazzcash");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [settings, setSettings] = useState(MOCK_SETTINGS);

  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const subtotal = getSubtotal();
  const deliveryCharges = getDeliveryCharges();
  const total = getTotal();

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {
        // Fallback to MOCK_SETTINGS
      });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      city: "Lahore",
      address: "",
      notes: "",
      payment_method: "jazzcash",
      transaction_id: "",
      sender_account_name: "",
      sender_account_number: "",
      payment_receipt_url: "",
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        size: i.selectedSize,
      })),
    },
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreview(objectUrl);
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setValue("payment_receipt_url", "");
  };

  const handleSelectMethod = (method: "jazzcash" | "easypaisa" | "bank_transfer") => {
    setSelectedMethod(method);
    setValue("payment_method", method);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items to checkout.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedReceiptUrl = data.payment_receipt_url || "";

      // Upload receipt file if customer selected one
      if (receiptFile) {
        setIsUploadingReceipt(true);
        const uploadData = new FormData();
        uploadData.append("file", receiptFile);

        const uploadRes = await fetch("/api/upload-receipt", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.url) {
          uploadedReceiptUrl = uploadJson.url;
        } else {
          console.warn("Receipt upload notice:", uploadJson.error);
        }
        setIsUploadingReceipt(false);
      }

      // Prepare order payload
      const payload: CheckoutFormData = {
        ...data,
        payment_method: selectedMethod,
        payment_receipt_url: uploadedReceiptUrl,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          size: i.selectedSize,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.error || "Could not process order. Please verify your details.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      toast.success("Advance payment submitted & order recorded!");
      clearCart();
      router.push(`/order-success/${result.order.order_number}`);
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Network error. Please check your internet connection.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-navy-950">
          No Items in Cart
        </h2>
        <p className="text-xs text-slate-500">
          Please add imported products to your cart before proceeding to checkout.
        </p>
        <div>
          <Link href="/shop">
            <Button variant="gold" size="md">
              Browse Imported Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/cart" className="hover:text-navy-950">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950">Advance Payment Checkout</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 flex items-center gap-2">
            Advance Payment Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We operate strictly on advance payments. Transfer funds via JazzCash, EasyPaisa, or Bank Transfer below.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shrink-0">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Manual Advance Verification</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Payment Gateway */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer & Delivery Information */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-navy-900 text-gold-400 font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="text-base font-bold text-navy-950 font-serif">
                Delivery Details (Pakistan)
              </h2>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("customer_name")}
                placeholder="e.g. Tariq Mahmood"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                  errors.customer_name ? "border-red-500 bg-red-50/30" : "border-slate-300"
                }`}
              />
              {errors.customer_name && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            {/* Mobile Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Contact Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="03001234567 or +923001234567"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                  errors.phone ? "border-red-500 bg-red-50/30" : "border-slate-300"
                }`}
              />
              <p className="text-[11px] text-slate-500">
                Used for parcel dispatch SMS and tracking your order status on this website.
              </p>
              {errors.phone && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* City Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Delivery City <span className="text-red-500">*</span>
              </label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Other City") {
                    setCustomCitySelected(true);
                    setValue("city", "");
                  } else {
                    setCustomCitySelected(false);
                    setValue("city", val);
                  }
                }}
                defaultValue="Lahore"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
              >
                {PAKISTANI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {customCitySelected && (
                <div className="pt-2">
                  <input
                    type="text"
                    {...register("city")}
                    placeholder="Enter your specific town / city name"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              )}
              {errors.city && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Street / House Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Complete Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                {...register("address")}
                placeholder="House #, Street #, Sector / Block / Phase, Landmark (e.g. Near Shell Pump)"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                  errors.address ? "border-red-500 bg-red-50/30" : "border-slate-300"
                }`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Special Instructions / Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Delivery Notes (Optional)
              </label>
              <input
                type="text"
                {...register("notes")}
                placeholder="e.g. Fragile perfume packing requested, deliver afternoon"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Step 2: Advance Payment Instructions & Account Transfer */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-navy-900 text-gold-400 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-navy-950 font-serif">
                  Select Advance Payment Method & Transfer
                </h2>
                <p className="text-xs text-slate-500">
                  Transfer exact total of <strong className="text-navy-950">{formatPKR(total)}</strong> to our account below.
                </p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {/* JazzCash */}
              <button
                type="button"
                onClick={() => handleSelectMethod("jazzcash")}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedMethod === "jazzcash"
                    ? "border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                    JC
                  </span>
                  {selectedMethod === "jazzcash" && (
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">JazzCash</div>
                  <div className="text-[10px] text-slate-500">Mobile Wallet</div>
                </div>
              </button>

              {/* EasyPaisa */}
              <button
                type="button"
                onClick={() => handleSelectMethod("easypaisa")}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedMethod === "easypaisa"
                    ? "border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                    EP
                  </span>
                  {selectedMethod === "easypaisa" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">EasyPaisa</div>
                  <div className="text-[10px] text-slate-500">Mobile Wallet</div>
                </div>
              </button>

              {/* Bank Transfer / Raast */}
              <button
                type="button"
                onClick={() => handleSelectMethod("bank_transfer")}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedMethod === "bank_transfer"
                    ? "border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </span>
                  {selectedMethod === "bank_transfer" && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">Bank / Raast</div>
                  <div className="text-[10px] text-slate-500">{settings.bank_name || "Meezan Bank"}</div>
                </div>
              </button>
            </div>

            {/* Account Details Display Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-gold-600" />
                  Official Store Account Details
                </span>
                <span className="text-[11px] font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                  Amount: {formatPKR(total)}
                </span>
              </div>

              {selectedMethod === "jazzcash" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Account Title</span>
                      <strong className="text-navy-950 text-sm font-sans">{settings.jazzcash_title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.jazzcash_title, "jc_title")}
                      className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                      title="Copy Account Title"
                    >
                      {copiedKey === "jc_title" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">JazzCash Mobile Number</span>
                      <strong className="text-navy-950 text-base font-mono">{settings.jazzcash_number}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.jazzcash_number, "jc_num")}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === "jc_num" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Number
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === "easypaisa" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Account Title</span>
                      <strong className="text-navy-950 text-sm font-sans">{settings.easypaisa_title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.easypaisa_title, "ep_title")}
                      className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                      title="Copy Account Title"
                    >
                      {copiedKey === "ep_title" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">EasyPaisa Mobile Number</span>
                      <strong className="text-navy-950 text-base font-mono">{settings.easypaisa_number}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.easypaisa_number, "ep_num")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === "ep_num" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Number
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === "bank_transfer" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Bank Name</span>
                      <strong className="text-navy-950 text-sm font-sans">{settings.bank_name}</strong>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Branch Network</span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Account Title</span>
                      <strong className="text-navy-950 text-sm font-sans">{settings.bank_account_title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.bank_account_title, "bank_title")}
                      className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                    >
                      {copiedKey === "bank_title" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Account Number</span>
                      <strong className="text-navy-950 text-sm font-mono">{settings.bank_account_number}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.bank_account_number, "bank_acc")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedKey === "bank_acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} Copy Acc #
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">IBAN Number</span>
                      <strong className="text-navy-950 text-xs font-mono">{settings.bank_iban}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.bank_iban, "bank_iban")}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === "bank_iban" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy IBAN
                        </>
                      )}
                    </button>
                  </div>

                  {settings.bank_raast_id && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Raast ID (Instant Transfer)</span>
                        <strong className="text-navy-950 text-sm font-mono">{settings.bank_raast_id}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.bank_raast_id || "", "bank_raast")}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        {copiedKey === "bank_raast" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} Copy Raast
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Transaction ID & Receipt Upload Form */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Provide Your Deposit Verification Details
              </h3>

              {/* Transaction ID (TID) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                  Transaction ID / Reference Number (TID / Ref #) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("transaction_id")}
                  placeholder="e.g. 09482194820 or JC-984210"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                    errors.transaction_id ? "border-red-500 bg-red-50/30" : "border-slate-300"
                  }`}
                />
                <p className="text-[11px] text-slate-500">
                  Found in your JazzCash/EasyPaisa confirmation SMS or bank transfer receipt.
                </p>
                {errors.transaction_id && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors.transaction_id.message}
                  </p>
                )}
              </div>

              {/* Sender Name & Account Number (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-950">
                    Sender Account Title / Name (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("sender_account_name")}
                    placeholder="Name on your sending account"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-950">
                    Sender Account / Mobile # (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("sender_account_number")}
                    placeholder="e.g. 03211234567"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Screenshot Receipt Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy-950 flex items-center justify-between">
                  <span>Upload Payment Receipt Screenshot (Recommended)</span>
                  <span className="text-[11px] font-normal text-slate-400">PNG, JPG, WEBP (Max 10MB)</span>
                </label>

                {!receiptPreview ? (
                  <label className="border-2 border-dashed border-slate-300 hover:border-gold-500 bg-slate-50/50 hover:bg-gold-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-navy-900">
                      Click to choose receipt screenshot
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Speeds up order verification by our finance team
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                      <Image
                        src={receiptPreview}
                        alt="Receipt preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-navy-950 truncate">
                        {receiptFile?.name || "Payment Receipt Screenshot"}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" /> Ready to submit with order
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeReceipt}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || isUploadingReceipt}
                className="w-full text-base font-bold shadow-gold-glow flex items-center justify-center gap-2"
              >
                <span>Confirm & Submit Order ({formatPKR(total)})</span>
              </Button>
              <p className="text-[11px] text-center text-slate-500 mt-2.5">
                Your order is confirmed upon submission and tracked live on our website.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Recap */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-navy-950 font-serif">
              Order Items ({items.length})
            </h3>
            <Link href="/cart" className="text-xs text-gold-700 font-semibold hover:underline">
              Edit Cart
            </Link>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <Image
                    src={item.product.images[0] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-navy-950 line-clamp-1">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-slate-500">
                    Qty: {item.quantity}{" "}
                    {item.selectedSize ? `• ${item.selectedSize}` : ""}
                  </div>
                </div>
                <div className="text-xs font-bold text-navy-950 text-right">
                  {formatPKR(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-navy-950">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-navy-950">
                {deliveryCharges === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE Delivery</span>
                ) : (
                  formatPKR(deliveryCharges)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-navy-950 pt-2 border-t border-slate-200">
              <span>Total Advance Payable</span>
              <span className="text-xl text-gold-700">{formatPKR(total)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Verified Advance Sourcing
            </div>
            <p className="text-[11px] leading-relaxed">
              Because all stock is personally handpicked and imported from abroad in limited numbers, advance payment protects your inventory allocation and allows immediate courier dispatch.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
