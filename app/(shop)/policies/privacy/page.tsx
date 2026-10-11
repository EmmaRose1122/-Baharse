import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | BaharSe Pakistan",
  description: "Customer data protection and privacy policy for our online store.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950">Privacy Policy</span>
      </nav>

      <div className="space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          Data Protection
        </span>
        <h1 className="text-3xl font-serif font-bold text-navy-950">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-slate-700 text-sm leading-relaxed shadow-sm">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold-600" />
            1. Information We Collect
          </h2>
          <p>
            When you place an order or contact us, we collect only the necessary information required to deliver your goods: your name, contact phone number, delivery city, and street address.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            2. How Your Information is Used
          </h2>
          <p>
            Your information is strictly used for order dispatch, courier airway bills (TCS, Leopards, Trax), and customer service communication via phone or email. We do not sell, rent, or trade customer contact details to third-party telemarketers or advertisers.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-950">
            3. Advance Payment Records & Security
          </h2>
          <p>
            All advance payment transfers are made through customer-initiated mobile wallet apps (JazzCash, EasyPaisa) or bank transfers (Meezan Bank / Raast). We only record your submitted Transaction ID (TID) and payment receipt screenshot to verify legitimate fund transfers. We never request or store PINs, OTP passwords, or debit/credit card CVVs.
          </p>
        </section>
      </div>
    </div>
  );
}
