"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, X } from "lucide-react";

export function FloatingOrderTracker() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2 print:hidden">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="relative bg-white text-navy-950 p-3 rounded-2xl shadow-luxury border border-slate-200 text-xs max-w-xs flex items-start gap-2">
          <div>
            <p className="font-bold text-navy-900 flex items-center gap-1">
              📦 Placed an advance order?
            </p>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Check live verification & dispatch updates on our tracking portal!
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-r border-b border-slate-200 transform rotate-45" />
        </div>
      )}

      {/* Button */}
      <Link
        href="/track-order"
        aria-label="Track Order Status"
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-navy-900 hover:bg-navy-800 text-gold-400 border border-gold-500/40 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs"
      >
        <Truck className="w-5 h-5 text-gold-400 animate-pulse" />
        <span className="hidden sm:inline">Track Order</span>
      </Link>
    </div>
  );
}
