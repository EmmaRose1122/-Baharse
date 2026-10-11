import React from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { getCategories, getProducts } from "@/lib/supabase/data-service";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { SalesChart } from "@/components/admin/sales-chart";
import { CategoryChart } from "@/components/admin/category-chart";
import { formatPKR, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const revalidate = 0; // Dynamic admin dashboard

export default async function AdminDashboardPage() {
  const categories = await getCategories();
  const { products } = await getProducts({ limit: 100 });

  // Calculate real metrics from catalog
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 5);

  // Sample sales data for 7-day performance
  const salesChartData = [
    { day: "Mon", revenue: 42500, orders: 4 },
    { day: "Tue", revenue: 58000, orders: 6 },
    { day: "Wed", revenue: 72000, orders: 7 },
    { day: "Thu", revenue: 49000, orders: 5 },
    { day: "Fri", revenue: 89000, orders: 9 },
    { day: "Sat", revenue: 114000, orders: 12 },
    { day: "Sun", revenue: 96000, orders: 10 },
  ];

  const categoryDistribution = [
    { name: "Kitchen Spices", value: 34 },
    { name: "Perfumes", value: 58 },
    { name: "Medicines & Health", value: 29 },
    { name: "Ladies Suits", value: 42 },
    { name: "Gents Pants", value: 38 },
  ];

  // Recent demo orders
  const recentOrders = [
    {
      id: "ord-1",
      order_number: "IMP-54210",
      customer_name: "Tariq Mahmood",
      phone: "03008451234",
      city: "Lahore",
      total: 6450,
      status: "confirmed",
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "ord-2",
      order_number: "IMP-67129",
      customer_name: "Zainab Fatima",
      phone: "03214567890",
      city: "Karachi",
      total: 8950,
      status: "pending",
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: "ord-3",
      order_number: "IMP-78234",
      customer_name: "Hamza Bilal",
      phone: "03335551212",
      city: "Islamabad",
      total: 8500,
      status: "shipped",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "ord-4",
      order_number: "IMP-89102",
      customer_name: "Dr. Asim Raza",
      phone: "03459988776",
      city: "Peshawar",
      total: 7800,
      status: "delivered",
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status of your imported stock, customer orders, and advance payment revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="gold" size="md" className="gap-2 font-bold shadow-sm">
              <Plus className="w-4 h-4" /> Add New Imported Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" size="md" className="gap-2">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. KEY METRIC CARDS */}
      <DashboardStats
        totalOrders={142}
        todayOrders={12}
        pendingOrders={5}
        totalRevenue={1285000}
        lowStockCount={lowStockProducts.length}
        totalProducts={products.length}
      />

      {/* 2. RECHARTS PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesChart data={salesChartData} />
        </div>
        <div className="lg:col-span-4">
          <CategoryChart data={categoryDistribution} />
        </div>
      </div>

      {/* 3. RECENT ORDERS & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-950 font-serif">
                Recent Orders Received
              </h3>
              <p className="text-xs text-slate-500">
                Latest customer orders and advance payment deposits
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-gold-700 hover:text-navy-950 flex items-center gap-1"
            >
              Manage Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Total (PKR)</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-navy-950">
                      {ord.order_number}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {ord.customer_name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {ord.phone}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{ord.city}</td>
                    <td className="py-3 font-bold text-navy-950">
                      {formatPKR(ord.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "confirmed"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {formatDate(ord.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-navy-950 font-serif">
                Low Stock Alerts
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {lowStockProducts.length} items
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Items requiring procurement during your next foreign sourcing trip:
          </p>

          <div className="divide-y divide-slate-100">
            {lowStockProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <h4 className="font-bold text-navy-950 line-clamp-1">{p.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    From: {p.origin_country}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {p.stock_quantity} left
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link href="/admin/products" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
              Update Product Stocks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
