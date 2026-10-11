"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Flame, ArrowRight, Zap, ShieldCheck, Tag } from "lucide-react";

interface SaleCardItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  origin: string;
  discount: string;
  priceNote: string;
  href: string;
  icon: string;
}

const SALE_CARDS: SaleCardItem[] = [
  {
    id: "sale-1",
    badge: "FLASH SALE",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    title: "Dubai Royal Oud & French Perfumes",
    origin: "✈️ UAE Direct Import",
    discount: "35% OFF",
    priceNote: "From Rs. 4,999 (Was Rs. 7,500)",
    href: "/category/perfumes",
    icon: "💎",
  },
  {
    id: "sale-2",
    badge: "HOT DEAL",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    title: "Pure Kashmiri Super Negin Saffron",
    origin: "🌿 European Lab Tested",
    discount: "FLAT 25% OFF",
    priceNote: "Original Sealed 5g & 10g Tins",
    href: "/category/kitchen-spices",
    icon: "🔥",
  },
  {
    id: "sale-3",
    badge: "LIMITED DROP",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    title: "Turkish Luxury Embroidered Silk Suits",
    origin: "🇹🇷 Istanbul Boutiques",
    discount: "SAVE RS. 2,000",
    priceNote: "Premium 3-Piece Festive Edition",
    href: "/category/ladies-suits",
    icon: "✨",
  },
  {
    id: "sale-4",
    badge: "CLEARANCE",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    title: "Original Export Selvedge Denim & Chinos",
    origin: "👖 Handpicked Batches",
    discount: "FLAT 30% OFF",
    priceNote: "Rs. 2,850 Only (Standard Export Fit)",
    href: "/category/gents-pants",
    icon: "⚡",
  },
  {
    id: "sale-5",
    badge: "SEALED BATCH",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    title: "USA Biotin & Joint Health Supplements",
    origin: "🇺🇸 100% Genuine USA",
    discount: "BUY 2 SAVE 15%",
    priceNote: "Sealed Verification Batch",
    href: "/category/medicines",
    icon: "💊",
  },
  {
    id: "sale-6",
    badge: "FREE SHIPPING",
    badgeColor: "bg-gold-500/20 text-gold-300 border-gold-500/40",
    title: "Free TCS / Leopards Express Delivery",
    origin: "📦 Nationwide Pakistan",
    discount: "ZERO FREIGHT",
    priceNote: "On All Orders Above Rs. 5,000",
    href: "/shop",
    icon: "🎁",
  },
];

export function HeaderSaleSlider() {
  return (
    <div className="relative bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border-b border-gold-500/20 overflow-hidden py-2.5 shadow-md">
      {/* Left fixed label */}
      <div className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex items-center pl-4 pr-6 bg-gradient-to-r from-navy-950 via-navy-950 to-transparent">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold shadow-inner">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="uppercase tracking-wider text-[11px]">Today's Live Deals</span>
        </div>
      </div>

      {/* Left & Right gradient fade masks for smooth infinity look */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-44 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

      {/* Infinite loop marquee track */}
      <div className="flex items-center">
        <div className="animate-loop-scroll flex items-center gap-3 md:gap-4 pl-4 hover:cursor-pointer">
          {/* First set of cards */}
          {SALE_CARDS.map((card) => (
            <SaleCard key={`card-1-${card.id}`} card={card} />
          ))}

          {/* Duplicated set for seamless 100% infinite loop */}
          {SALE_CARDS.map((card) => (
            <SaleCard key={`card-2-${card.id}`} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SaleCard({ card }: { card: SaleCardItem }) {
  return (
    <Link
      href={card.href}
      className="group shrink-0 flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-gold-500/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-gold-glow"
    >
      {/* Icon Badge */}
      <div className="w-8 h-8 rounded-xl bg-navy-950/80 border border-gold-500/30 flex items-center justify-center text-base shadow-sm shrink-0 group-hover:scale-110 transition-transform">
        {card.icon}
      </div>

      {/* Details */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border tracking-wider ${card.badgeColor}`}
          >
            {card.badge}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {card.origin}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors whitespace-nowrap">
            {card.title}
          </span>
          <span className="text-[11px] font-black text-amber-400 bg-amber-400/10 px-1.5 rounded border border-amber-400/20 whitespace-nowrap">
            {card.discount}
          </span>
        </div>
      </div>

      {/* Arrow CTA */}
      <div className="ml-1 text-slate-400 group-hover:text-gold-400 group-hover:translate-x-1 transition-all">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
