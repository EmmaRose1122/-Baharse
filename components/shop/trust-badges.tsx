import React from "react";
import { ShieldCheck, Banknote, Truck, Plane } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: "100% Brand-New & Original",
      desc: "Direct foreign procurement. Strictly zero replicas or copies.",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      icon: Banknote,
      title: "Advance Payment Verified",
      desc: "Fast deposit via JazzCash, EasyPaisa & Raast Bank Transfer with TID confirmation.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      icon: Truck,
      title: "Nationwide Fast Delivery",
      desc: "Dispatched via TCS, Leopards & Trax within 2 to 4 working days.",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      icon: Plane,
      title: "Handpicked Import Sourcing",
      desc: "Personally brought by the owner from Dubai, Turkey, UK & USA.",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6">
      {badges.map((b, idx) => {
        const Icon = b.icon;
        return (
          <div
            key={idx}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl border ${b.color} shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-950 font-sans">
                {b.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed font-normal">
                {b.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
