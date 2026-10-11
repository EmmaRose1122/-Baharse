import React from "react";
import {
  ShoppingBag,
  Clock,
  TrendingUp,
  AlertTriangle,
  Banknote,
  Package,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface DashboardStatsProps {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  totalProducts: number;
}

export function DashboardStats({
  totalOrders,
  todayOrders,
  pendingOrders,
  totalRevenue,
  lowStockCount,
  totalProducts,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Revenue (Advance Paid)",
      value: formatPKR(totalRevenue),
      desc: "Delivered & verified advance orders",
      icon: Banknote,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      desc: `${todayOrders} orders received today`,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Pending Dispatch",
      value: pendingOrders.toString(),
      desc: "Awaiting owner verification",
      icon: Clock,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount.toString(),
      desc: "Restock on next foreign trip",
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      title: "Active Catalog",
      value: `${totalProducts} Products`,
      desc: "Across 5 import categories",
      icon: Package,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((st, idx) => {
        const Icon = st.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {st.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${st.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xl sm:text-2xl font-black text-navy-950 font-sans">
                {st.value}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
