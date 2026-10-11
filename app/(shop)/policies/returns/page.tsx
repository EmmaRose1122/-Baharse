import React from "react";
import Link from "next/link";
import { RotateCcw, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Return & Exchange Policy | BaharSe Pakistan",
  description: "7-day checking warranty and exchange guidelines for imported products.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950">Returns & Exchanges</span>
      </nav>

      <div className="space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          Customer Satisfaction
        </span>
        <h1 className="text-3xl font-serif font-bold text-navy-950">
          7-Day Return & Exchange Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          We want you to be completely delighted with your foreign purchases.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-slate-700 text-sm leading-relaxed shadow-sm">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            1. Eligibility for Return / Exchange
          </h2>
          <p>
            You may request an exchange or return within <strong>7 calendar days</strong> of receiving your parcel under the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>The item was damaged during courier transit.</li>
            <li>Incorrect size or product received compared to your order.</li>
            <li>The product remains in original, unused, unwashed condition with all original tags attached.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            2. Hygiene & Sealed Product Exceptions
          </h2>
          <p>
            Due to strict international hygiene and safety standards:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Perfumes:</strong> Bottles with broken cellophane seals or atomizers that have been sprayed cannot be refunded unless defective upon delivery.</li>
            <li><strong>Medicines & Supplements:</strong> Canisters with broken safety foil or tamper caps are non-returnable.</li>
            <li><strong>Kitchen Spices:</strong> Unopened airtight canisters are eligible; opened canisters cannot be restocked.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            3. How to Initiate a Return
          </h2>
          <p>
            Simply capture a clear photo or video of the parcel and contact our support desk at <strong>support@baharse.pk</strong> or phone <strong>+92 300 1234567</strong> with your Order Number (e.g. IMP-12345). You can also look up your order status anytime on our website tracking page. We arrange reverse courier pickups or direct replacements immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
