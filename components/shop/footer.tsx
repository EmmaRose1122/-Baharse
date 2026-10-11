import React from "react";
import Link from "next/link";
import { Plane, MapPin, Phone, Mail, ShieldCheck, Banknote, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-gold-400 transform -rotate-45" />
              </div>
              <div className="font-serif font-black text-xl text-white tracking-tight flex items-center gap-1">
                BAHARSE
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We specialize in brand-new, handpicked genuine goods personally procured by the owner during frequent foreign travels to Dubai, Turkey, the UK, and the USA. Secure advance payments via JazzCash, EasyPaisa & Bank Transfer with express insured delivery across Pakistan.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">
                JazzCash Advance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                EasyPaisa Advance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-700/60">
                Bank Transfer (Raast)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-gold-950/80 text-gold-400 border border-gold-700/60">
                <ShieldCheck className="w-3 h-3" /> 100% Genuine
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-serif tracking-wide uppercase">
              Import Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/kitchen-spices" className="hover:text-gold-400 transition-colors">
                  Kitchen Spices (Masalay)
                </Link>
              </li>
              <li>
                <Link href="/category/perfumes" className="hover:text-gold-400 transition-colors">
                  Perfumes & Attars
                </Link>
              </li>
              <li>
                <Link href="/category/medicines" className="hover:text-gold-400 transition-colors">
                  Medicines & Supplements
                </Link>
              </li>
              <li>
                <Link href="/category/ladies-suits" className="hover:text-gold-400 transition-colors">
                  Ladies Suits & Pret
                </Link>
              </li>
              <li>
                <Link href="/category/gents-pants" className="hover:text-gold-400 transition-colors">
                  Gents Pants & Chinos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-serif tracking-wide uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-gold-400 transition-colors font-semibold text-gold-300">
                  Track Your Order Status
                </Link>
              </li>
              <li>
                <Link href="/policies/delivery" className="hover:text-gold-400 transition-colors">
                  Advance Payment & Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-gold-400 transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About the Importer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Physical Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-serif tracking-wide uppercase">
              Physical Store
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Suite 14, Commercial Plaza, Liberty Market, Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>orders@baharse.pk</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                All order confirmations, receipts, and dispatch updates are tracked directly on this website.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BaharSe Foreign Imports. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-gold-400 transition-colors">
              Staff & Admin Portal
            </Link>
            <span>•</span>
            <span>Currency: PKR (Pakistani Rupee)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
