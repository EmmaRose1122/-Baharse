"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Settings,
  Save,
  Truck,
  Store,
  Mail,
  MapPin,
  Megaphone,
  Share2,
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { settingsAdminSchema, SettingsAdminFormData } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { MOCK_SETTINGS } from "@/lib/supabase/mock-data";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsAdminFormData>({
    resolver: zodResolver(settingsAdminSchema),
    defaultValues: {
      store_name: MOCK_SETTINGS.store_name,
      contact_email: MOCK_SETTINGS.contact_email,
      address: MOCK_SETTINGS.address,
      delivery_charges: MOCK_SETTINGS.delivery_charges,
      free_delivery_above: MOCK_SETTINGS.free_delivery_above,
      announcement_text: MOCK_SETTINGS.announcement_text || "",
      jazzcash_title: MOCK_SETTINGS.jazzcash_title,
      jazzcash_number: MOCK_SETTINGS.jazzcash_number,
      easypaisa_title: MOCK_SETTINGS.easypaisa_title,
      easypaisa_number: MOCK_SETTINGS.easypaisa_number,
      bank_name: MOCK_SETTINGS.bank_name,
      bank_account_title: MOCK_SETTINGS.bank_account_title,
      bank_account_number: MOCK_SETTINGS.bank_account_number,
      bank_iban: MOCK_SETTINGS.bank_iban,
      bank_raast_id: MOCK_SETTINGS.bank_raast_id || "",
      social_facebook: MOCK_SETTINGS.social_facebook || "",
      social_instagram: MOCK_SETTINGS.social_instagram || "",
      social_tiktok: MOCK_SETTINGS.social_tiktok || "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.settings) {
          reset({
            store_name: data.settings.store_name || MOCK_SETTINGS.store_name,
            contact_email: data.settings.contact_email || MOCK_SETTINGS.contact_email,
            address: data.settings.address || MOCK_SETTINGS.address,
            delivery_charges: data.settings.delivery_charges ?? 250,
            free_delivery_above: data.settings.free_delivery_above ?? 5000,
            announcement_text: data.settings.announcement_text || "",
            jazzcash_title: data.settings.jazzcash_title || MOCK_SETTINGS.jazzcash_title,
            jazzcash_number: data.settings.jazzcash_number || MOCK_SETTINGS.jazzcash_number,
            easypaisa_title: data.settings.easypaisa_title || MOCK_SETTINGS.easypaisa_title,
            easypaisa_number: data.settings.easypaisa_number || MOCK_SETTINGS.easypaisa_number,
            bank_name: data.settings.bank_name || MOCK_SETTINGS.bank_name,
            bank_account_title: data.settings.bank_account_title || MOCK_SETTINGS.bank_account_title,
            bank_account_number: data.settings.bank_account_number || MOCK_SETTINGS.bank_account_number,
            bank_iban: data.settings.bank_iban || MOCK_SETTINGS.bank_iban,
            bank_raast_id: data.settings.bank_raast_id || "",
            social_facebook: data.settings.social_facebook || "",
            social_instagram: data.settings.social_instagram || "",
            social_tiktok: data.settings.social_tiktok || "",
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (formData: SettingsAdminFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to update settings");
        return;
      }

      toast.success("Store payment accounts & settings updated successfully!");
    } catch {
      toast.error("Error communicating with server");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-slate-400">Loading settings...</div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Store & Advance Payment Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure official JazzCash, EasyPaisa, and Bank Transfer accounts displayed on customer checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 text-xs"
      >
        {/* Section 1: Advance Payment Receiving Accounts */}
        <div className="space-y-5">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold-600" />
              Advance Payment Accounts (Customer Checkout Destination)
            </h3>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
              Live Gateway Data
            </span>
          </div>

          {/* JazzCash Configuration */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center font-mono text-[10px]">
                JC
              </span>
              JazzCash Receiving Wallet
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">JazzCash Account Title</label>
                <input
                  type="text"
                  {...register("jazzcash_title")}
                  placeholder="e.g. Muhammad Mateen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.jazzcash_title && (
                  <p className="text-red-600 text-[11px]">{errors.jazzcash_title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">JazzCash Mobile Number</label>
                <input
                  type="text"
                  {...register("jazzcash_number")}
                  placeholder="e.g. 03001234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.jazzcash_number && (
                  <p className="text-red-600 text-[11px]">{errors.jazzcash_number.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* EasyPaisa Configuration */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px]">
                EP
              </span>
              EasyPaisa Receiving Wallet
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">EasyPaisa Account Title</label>
                <input
                  type="text"
                  {...register("easypaisa_title")}
                  placeholder="e.g. Muhammad Mateen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.easypaisa_title && (
                  <p className="text-red-600 text-[11px]">{errors.easypaisa_title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">EasyPaisa Mobile Number</label>
                <input
                  type="text"
                  {...register("easypaisa_number")}
                  placeholder="e.g. 03451234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.easypaisa_number && (
                  <p className="text-red-600 text-[11px]">{errors.easypaisa_number.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Transfer / Raast Configuration */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Building2 className="w-4 h-4 text-blue-700" />
              Bank Transfer & Raast Configuration
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">Bank Name</label>
                <input
                  type="text"
                  {...register("bank_name")}
                  placeholder="e.g. Meezan Bank Limited"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.bank_name && (
                  <p className="text-red-600 text-[11px]">{errors.bank_name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">Bank Account Title</label>
                <input
                  type="text"
                  {...register("bank_account_title")}
                  placeholder="e.g. BaharSe Imports Private"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.bank_account_title && (
                  <p className="text-red-600 text-[11px]">{errors.bank_account_title.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">Bank Account Number</label>
                <input
                  type="text"
                  {...register("bank_account_number")}
                  placeholder="e.g. 02010108923412"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
                />
                {errors.bank_account_number && (
                  <p className="text-red-600 text-[11px]">{errors.bank_account_number.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-950">IBAN Number</label>
                <input
                  type="text"
                  {...register("bank_iban")}
                  placeholder="e.g. PK45MEZN0002010108923412"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white uppercase"
                />
                {errors.bank_iban && (
                  <p className="text-red-600 text-[11px]">{errors.bank_iban.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">Raast ID / Registered Mobile (Optional)</label>
              <input
                type="text"
                {...register("bank_raast_id")}
                placeholder="e.g. 03001234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: General Store Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-4 h-4 text-gold-600" />
            General Store Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">Store Name</label>
              <input
                type="text"
                {...register("store_name")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
              {errors.store_name && (
                <p className="text-red-600 text-[11px]">{errors.store_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Customer Support Email
              </label>
              <input
                type="email"
                {...register("contact_email")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
              {errors.contact_email && (
                <p className="text-red-600 text-[11px]">{errors.contact_email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-navy-950 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Physical Store Address (Shown on receipts and footer)
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
            {errors.address && (
              <p className="text-red-600 text-[11px]">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Section 3: Delivery Charges & Thresholds */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Truck className="w-4 h-4 text-gold-600" />
            Nationwide Courier Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">
                Standard Delivery Charge (PKR)
              </label>
              <input
                type="number"
                {...register("delivery_charges")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
              {errors.delivery_charges && (
                <p className="text-red-600 text-[11px]">{errors.delivery_charges.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">
                Free Delivery Above Cart Total (PKR)
              </label>
              <input
                type="number"
                {...register("free_delivery_above")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
              {errors.free_delivery_above && (
                <p className="text-red-600 text-[11px]">
                  {errors.free_delivery_above.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Announcement Bar */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Megaphone className="w-4 h-4 text-gold-600" />
            Top Announcement Bar
          </h3>

          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">Announcement Marquee Text</label>
            <input
              type="text"
              {...register("announcement_text")}
              placeholder="e.g. ✈️ 100% Brand-New Handpicked Foreign Imports • Advance Payment via JazzCash, EasyPaisa & Bank Transfer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Section 5: Social Media Profiles */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Share2 className="w-4 h-4 text-gold-600" />
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">Facebook URL</label>
              <input
                type="text"
                {...register("social_facebook")}
                placeholder="https://facebook.com/baharse.pk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">Instagram URL</label>
              <input
                type="text"
                {...register("social_instagram")}
                placeholder="https://instagram.com/baharse.pk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950">TikTok URL</label>
              <input
                type="text"
                {...register("social_tiktok")}
                placeholder="https://tiktok.com/@baharse.pk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isSubmitting}
            className="gap-2 font-bold shadow-gold-glow"
          >
            <Save className="w-4 h-4" />
            Save Store Settings & Payment Accounts
          </Button>
        </div>
      </form>
    </div>
  );
}
