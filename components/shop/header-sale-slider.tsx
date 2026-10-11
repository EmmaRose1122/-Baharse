"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowRight, Sparkles } from "lucide-react";

interface SaleCardItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  origin: string;
  discount: string;
  href: string;
  icon: string;
}

const SALE_CARDS: SaleCardItem[] = [
  {
    id: "sale-1",
    badge: "FLASH SALE",
    badgeColor: "bg-red-100 text-red-700 border-red-200/90",
    title: "Dubai Royal Oud & French Perfumes",
    origin: "✈️ UAE Direct Import",
    discount: "35% OFF",
    href: "/category/perfumes",
    icon: "💎",
  },
  {
    id: "sale-2",
    badge: "HOT DEAL",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "Pure Kashmiri Super Negin Saffron",
    origin: "🌿 European Lab Certified",
    discount: "FLAT 25% OFF",
    href: "/category/kitchen-spices",
    icon: "🔥",
  },
  {
    id: "sale-3",
    badge: "NEW DROP",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "Turkish Luxury Embroidered Silk Suits",
    origin: "🇹🇷 Istanbul Boutiques",
    discount: "SAVE RS. 2,000",
    href: "/category/ladies-suits",
    icon: "✨",
  },
  {
    id: "sale-4",
    badge: "EXPORT CLEARANCE",
    badgeColor: "bg-navy-100 text-navy-900 border-navy-200",
    title: "Original Export Selvedge Denim & Chinos",
    origin: "👖 Handpicked Batches",
    discount: "FLAT 30% OFF",
    href: "/category/gents-pants",
    icon: "⚡",
  },
  {
    id: "sale-5",
    badge: "SEALED BATCH",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
    title: "USA Biotin & Joint Health Supplements",
    origin: "🇺🇸 100% Genuine USA",
    discount: "BUY 2 SAVE 15%",
    href: "/category/medicines",
    icon: "💊",
  },
  {
    id: "sale-6",
    badge: "ZERO FREIGHT",
    badgeColor: "bg-gold-100 text-gold-950 border-gold-300",
    title: "Free TCS / Leopards Express Delivery",
    origin: "📦 Nationwide Pakistan",
    discount: "ORDERS > 5K",
    href: "/shop",
    icon: "🎁",
  },
];

export function HeaderSaleSlider() {
  return (
    <div className="relative bg-gradient-to-r from-amber-50 via-gold-50/70 to-amber-50 text-navy-950 border-y border-amber-200/80 overflow-hidden py-2 shadow-xs">
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-80" />

      {/* Left fixed live badge for desktop */}
      <div className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex items-center pl-4 pr-6 bg-gradient-to-r from-amber-50 via-amber-50/95 to-transparent">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950 text-gold-400 text-xs font-bold border border-gold-500/40 shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
          </span>
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="uppercase tracking-wider text-[10px] font-black">Live Flash Deals</span>
        </div>
      </div>

      {/* Left & Right gradient fade masks for smooth infinite scrolling */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-48 bg-gradient-to-r from-amber-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-amber-50 to-transparent z-10 pointer-events-none" />

      {/* Infinite loop marquee track */}
      <div className="flex items-center">
        <div className="animate-loop-scroll flex items-center gap-3 md:gap-3.5 pl-4 hover:cursor-pointer">
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
      className="group shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-gold-50/40 border border-amber-200/70 hover:border-gold-500/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Icon Badge */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-navy-950 to-navy-900 text-gold-400 border border-gold-500/30 flex items-center justify-center text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
        {card.icon}
      </div>

      {/* Details */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md border tracking-wider ${card.badgeColor}`}
          >
            {card.badge}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {card.origin}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-bold text-navy-950 group-hover:text-gold-700 transition-colors whitespace-nowrap">
            {card.title}
          </span>
          <span className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-gold-500 text-navy-950 px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap tracking-tight">
            {card.discount}
          </span>
        </div>
      </div>

      {/* Arrow CTA */}
      <div className="ml-0.5 text-slate-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
