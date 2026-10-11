"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertCircle,
  MapPin,
  Calendar,
  XCircle,
  CreditCard,
  MessageSquare,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import {
  formatPKR,
  formatDate,
  formatPaymentMethod,
  getPaymentStatusInfo,
  getOrderStatusInfo,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      toast.error("Please enter both your Order Number and Phone Number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setOrder(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(
          data.error ||
            "No matching order found. Please re-check the order number and phone number."
        );
        setIsLoading(false);
        return;
      }

      setOrder(data.order);
    } catch {
      setErrorMsg("Failed to track order. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: "pending",
      label: "Payment Submitted",
      desc: "Advance deposit details received & under review",
    },
    {
      key: "confirmed",
      label: "Payment Verified",
      desc: "TID confirmed in ledger, items sealed",
    },
    {
      key: "shipped",
      label: "Shipped via Courier",
      desc: "Dispatched via TCS / Leopards / Trax",
    },
    {
      key: "delivered",
      label: "Delivered",
      desc: "Safely handed over at your doorstep",
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;
  const paymentStatusInfo = order ? getPaymentStatusInfo(order.payment_status) : null;
  const orderStatusInfo = order ? getOrderStatusInfo(order.status) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          Live Status & Advance Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your Order Number (e.g. <strong>IMP-82914</strong>) and the contact phone number used during checkout.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950">
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="e.g. IMP-82914"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Check Live Status & Payment
          </Button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-luxury overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Banner */}
          <div className="bg-navy-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-gold-400 uppercase">
                  BaharSe Order Tracking
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Order #{order.order_number}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Payment Status Badge */}
              {paymentStatusInfo && (
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${paymentStatusInfo.badgeClass}`}
                >
                  {paymentStatusInfo.label}
                </span>
              )}
              {/* Fulfillment Status Badge */}
              {orderStatusInfo && (
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${orderStatusInfo.badgeClass}`}
                >
                  {orderStatusInfo.label}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Advance Payment Details Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gold-600" />
                Advance Payment Ledger Record
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Payment Method</span>
                  <strong className="text-navy-950 text-sm font-sans">
                    {formatPaymentMethod(order.payment_method)}
                  </strong>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Transaction ID (TID)</span>
                  <strong className="text-navy-950 text-sm font-mono">
                    {order.transaction_id || "NOT PROVIDED"}
                  </strong>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Verification Status</span>
                  <strong
                    className={`text-sm font-sans ${
                      order.payment_status === "verified"
                        ? "text-emerald-700 font-bold"
                        : order.payment_status === "rejected"
                        ? "text-rose-700 font-bold"
                        : "text-amber-700 font-bold"
                    }`}
                  >
                    {order.payment_status === "verified"
                      ? "✓ Verified in Ledger"
                      : order.payment_status === "rejected"
                      ? "✗ Invalid / Unverified"
                      : "⏳ Under Verification"}
                  </strong>
                </div>
              </div>

              {(order.sender_account_name || order.sender_account_number || order.payment_receipt_url) && (
                <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    {order.sender_account_name && (
                      <span>Sender Title: <strong>{order.sender_account_name}</strong></span>
                    )}
                    {order.sender_account_number && (
                      <span>Sender Account: <strong>{order.sender_account_number}</strong></span>
                    )}
                  </div>
                  {order.payment_receipt_url && (
                    <a
                      href={order.payment_receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      View Uploaded Receipt
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stepper (Unless cancelled) */}
            {order.status === "cancelled" ? (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800">
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-bold">This order was cancelled.</h4>
                  <p className="mt-0.5 text-red-700">
                    If this was unexpected, please submit an inquiry on our Contact Us page.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                  Fulfillment Lifecycle
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {steps.map((st, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={st.key}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? "border-gold-500 bg-gold-50/50 shadow-sm"
                            : isCompleted
                            ? "border-emerald-200 bg-emerald-50/30"
                            : "border-slate-200 bg-slate-50 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCompleted
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-300 text-slate-700"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <h4 className="text-xs font-bold text-navy-950">{st.label}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {st.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Message Log from BaharSe Store Staff */}
            {order.client_messages && order.client_messages.length > 0 && (
              <div className="p-5 rounded-2xl bg-navy-50/60 border border-navy-100 space-y-3">
                <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-navy-800" />
                  Order Updates & Communication Log
                </h3>
                <div className="space-y-2.5">
                  {order.client_messages.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-navy-950 font-bold">
                        <span>{log.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {formatDate(log.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {log.message}
                      </p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        By: {log.by}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-navy-950 uppercase tracking-wider">
                  Shipping Destination
                </h4>
                <div className="text-slate-600 space-y-1">
                  <p className="font-semibold text-navy-950">{order.customer_name}</p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {order.address}, {order.city}
                  </p>
                  <p>Contact Phone: {order.phone}</p>
                  {order.notes && <p className="italic">Note: "{order.notes}"</p>}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-navy-950 uppercase tracking-wider">
                  Payment Summary
                </h4>
                <div className="text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-navy-950">{formatPKR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span className="font-semibold text-navy-950">
                      {order.delivery_charges === 0 ? "FREE" : formatPKR(order.delivery_charges)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-navy-950 pt-1 border-t border-slate-200">
                    <span>Total Advance Paid:</span>
                    <span className="text-gold-700">{formatPKR(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                Ordered Items ({order.items.length})
              </h4>
              <div className="divide-y divide-slate-100">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-navy-950">{it.product_name}</span>
                      {it.size && (
                        <span className="text-slate-500 ml-2">({it.size})</span>
                      )}
                      <div className="text-[11px] text-slate-500">
                        Qty: {it.quantity} x {formatPKR(it.price)}
                      </div>
                    </div>
                    <span className="font-bold text-navy-950">
                      {formatPKR(it.quantity * it.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
