import React from "react";
import Link from "next/link";
import { Truck, Banknote, ShieldCheck, Clock, MapPin, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Delivery & Shipping Policy Across Pakistan | BaharSe",
  description: "Nationwide shipping policy, advance payment verification timelines, rates, and courier dispatch guidelines.",
};

export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950">Delivery Policy</span>
      </nav>

      <div className="space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          Shipping & Timelines
        </span>
        <h1 className="text-3xl font-serif font-bold text-navy-950">
          Nationwide Delivery Policy (Pakistan)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-slate-700 text-sm leading-relaxed shadow-sm">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <Truck className="w-5 h-5 text-gold-600" />
            1. Courier Partners & Coverage
          </h2>
          <p>
            We deliver to virtually all cities, towns, and postal codes across Pakistan using trusted courier networks including <strong>TCS, Leopards Courier, Trax Logistics, and Call Courier</strong>.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            2. Estimated Delivery Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Lahore & Rawalpindi / Islamabad:</strong> 1 to 2 business days.</li>
            <li><strong>Karachi, Faisalabad, Multan, Sialkot:</strong> 2 to 3 business days.</li>
            <li><strong>Peshawar, Quetta, & Regional Towns:</strong> 3 to 4 business days.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-600" />
            3. Delivery Charges & Free Shipping
          </h2>
          <p>
            Our standard nationwide delivery charge is <strong>Rs. 250</strong> per parcel. However, any order with a subtotal of <strong>Rs. 5,000 or more automatically qualifies for 100% FREE Delivery</strong>.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            4. Advance Payment Verification & Courier Dispatch
          </h2>
          <p>
            Because we operate strictly on <strong>Verified Advance Payment</strong> (JazzCash, EasyPaisa, or Meezan Bank Transfer), our finance desk verifies your submitted Transaction ID (TID) and receipt within 2 to 4 working hours. Once verified, your parcel is packed in a tamper-evident security flyer and handed over to TCS or Leopards for swift delivery.
          </p>
          <p>
            You can monitor real-time verification status, staff review notes, and courier airway bills anytime on our website's <strong>Track Order</strong> portal.
          </p>
        </section>
      </div>
    </div>
  );
}
