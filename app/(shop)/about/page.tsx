import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plane, ShieldCheck, CheckCircle2, Award, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Our Foreign Imports | BaharSe Pakistan",
  description: "Learn how the owner handpicks brand-new authentic products from Dubai, Turkey, UK, and USA to bring to Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          The Importer's Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy-950 leading-tight">
          Bringing 100% Original Foreign Treasures Directly to Pakistan
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded out of a deep frustration with fake copies, counterfeit fragrances, and adulterated saffron in local Pakistani bazaars.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-slate-200 relative">
            <Image
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
              alt="Procuring spices and perfumes abroad"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5 text-slate-700 text-sm leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-navy-950">
            Handpicked On Every Overseas Journey
          </h2>
          <p>
            Whenever the store owner travels abroad to hubs like <strong>Dubai, Istanbul, London, Bangkok, and the United States</strong>, every single item in our catalog is personally examined, purchased from verified retail outlets, and brought back in brand-new factory packaging.
          </p>
          <p>
            Because we do not use untraceable bulk shipping intermediaries or unverified third-party vendors, we eliminate 100% of the risk of counterfeits. When you purchase from BaharSe, you receive the exact same genuine product you would buy off the shelf at a premium mall abroad.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <Award className="w-6 h-6 text-gold-600 mb-2" />
              <h4 className="font-bold text-navy-950 text-xs">Zero Counterfeits</h4>
              <p className="text-[11px] text-slate-500 mt-1">Guaranteed authentic manufacturer batch codes.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <HeartHandshake className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-bold text-navy-950 text-xs">Verified Advance Pay</h4>
              <p className="text-[11px] text-slate-500 mt-1">Direct wallet & bank transfer with live order tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing Hubs */}
      <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Our Procurement Map
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Where Do We Bring Your Products From?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-gold-400 font-bold text-sm">Dubai & Gulf (UAE)</div>
            <p className="text-slate-300">
              Grade 1 Royal Saffron from Deira Souk, Armaf & Lattafa oriental perfumes, pure amber and Arabian ouds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-gold-400 font-bold text-sm">Istanbul (Turkey)</div>
            <p className="text-slate-300">
              Hand-embroidered boutique ladies pret suits, Misir Carsisi spice blends, and European tailored formal dress trousers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-gold-400 font-bold text-sm">London (United Kingdom)</div>
            <p className="text-slate-300">
              Seven Seas JointCare formulas, Boots OTC wellness essentials, and designer men's travel wear.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-gold-400 font-bold text-sm">California (USA)</div>
            <p className="text-slate-300">
              Costco Kirkland Signature Glucosamine & MSM, Nature Made multivitamins, and USP-verified supplements.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-serif font-bold text-navy-950">
          Ready to experience the difference of authentic foreign goods?
        </h3>
        <Link href="/shop">
          <Button variant="gold" size="lg" className="gap-2">
            Explore All Current Stock <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
