"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  FileCheck,
  Search,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

interface OrderSuccessPageProps {
  params: {
    orderNumber: string;
  };
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = params;

  useEffect(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#e5a919", "#0b1d30", "#10b981", "#38bdf8"],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          Order & Advance Payment Submitted
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
          Shukriya! Your Order is Recorded.
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your order number is{" "}
          <strong className="text-navy-950 font-mono text-base px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
            {orderNumber}
          </strong>
          . Your payment transaction details have been registered into our system.
        </p>
      </div>

      {/* Main In-Website Status Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 text-white shadow-luxury border border-gold-500/40 text-left space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-1.5">
                Digital Order Receipt
                <Sparkles className="w-4 h-4 text-gold-400" />
              </h3>
              <p className="text-xs text-slate-300">
                BaharSe Foreign Imports • Advance Payment Verification
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5" /> Verification In Progress
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Our finance desk cross-references your submitted Transaction ID (TID) against our incoming JazzCash, EasyPaisa, or Meezan Bank ledger. Once verified, your status will update automatically and parcel packing commences.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/track-order?orderNumber=${orderNumber}`}
            className="flex-1 block"
          >
            <Button
              variant="gold"
              size="lg"
              className="w-full text-sm font-bold flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <Search className="w-4 h-4" />
              Track Order Status on Website
            </Button>
          </Link>
        </div>
      </div>

      {/* Timeline & Next Steps */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-left space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
          What Happens Next?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
              <Clock className="w-4 h-4 text-gold-600" /> 1. Ledger Verification
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our accounts team verifies your deposit against bank records.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Tamper-Proof Packing
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Genuine imported goods packed in secure bubble wrap with sealed barcode tags.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
              <Truck className="w-4 h-4 text-blue-600" /> 3. Express Dispatch
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dispatched via TCS / Leopards / Trax within 2 to 4 working days with doorstep delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link href={`/track-order?orderNumber=${orderNumber}`}>
          <Button variant="outline" size="md" className="gap-2 text-xs font-semibold">
            <Truck className="w-4 h-4" /> Go to Order Tracker
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="md" className="gap-2 text-xs font-semibold">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
