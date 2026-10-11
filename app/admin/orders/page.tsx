"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileSpreadsheet,
  CreditCard,
  FileCheck,
} from "lucide-react";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import {
  formatPKR,
  formatDate,
  formatPaymentMethod,
  getPaymentStatusInfo,
} from "@/lib/utils";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = (orderId: string, updatedFields: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updatedFields } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, ...updatedFields });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export.");
      return;
    }

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "City",
      "Address",
      "Payment Channel",
      "Payment Status",
      "Transaction ID (TID)",
      "Sender Name",
      "Items Count",
      "Subtotal",
      "Delivery Charges",
      "Total Amount (PKR)",
      "Fulfillment Status",
    ];

    const rows = orders.map((o) => [
      o.order_number,
      o.created_at,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      o.phone,
      `"${o.city.replace(/"/g, '""')}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.payment_method,
      o.payment_status,
      `"${(o.transaction_id || "").replace(/"/g, '""')}"`,
      `"${(o.sender_account_name || "").replace(/"/g, '""')}"`,
      o.items.length,
      o.subtotal,
      o.delivery_charges,
      o.total,
      o.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BaharSe-Orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Orders CSV exported successfully!");
  };

  // Filtered list
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      (o.transaction_id && o.transaction_id.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" ? true : o.status === statusFilter;

    const matchesPayment =
      paymentFilter === "all" ? true : o.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Orders & Advance Payments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verify customer Transaction IDs (TID), approve bank/wallet deposits, and generate packing slips.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleExportCSV}
          className="gap-2 text-xs font-semibold"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Export Orders to CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, TID, customer, phone..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* Fulfillment Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">
              Fulfillment:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "confirmed", label: "Confirmed" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  statusFilter === st.id
                    ? "bg-navy-900 text-gold-400 shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Filter Sub-bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            Payment Verification:
          </span>
          {[
            { id: "all", label: "All Payments" },
            { id: "pending_verification", label: "⏳ Pending Verification" },
            { id: "verified", label: "✓ Verified" },
            { id: "rejected", label: "✗ Rejected" },
          ].map((pf) => (
            <button
              key={pf.id}
              onClick={() => setPaymentFilter(pf.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                paymentFilter === pf.id
                  ? "bg-gold-500 text-navy-950 font-bold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {pf.label}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Advance Payment</th>
                <th className="py-3.5 px-4">Transaction ID (TID)</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const payInfo = getPaymentStatusInfo(o.payment_status);
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-navy-950">
                        {o.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-navy-950 block">
                          {o.customer_name}
                        </span>
                        <span className="text-[11px] text-slate-500 block font-normal">
                          {o.phone} • {o.city}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-navy-950 capitalize block">
                          {formatPaymentMethod(o.payment_method)}
                        </span>
                        {o.payment_receipt_url && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <FileCheck className="w-3 h-3" /> Screenshot Attached
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-navy-900">
                        {o.transaction_id || "—"}
                      </td>
                      <td className="py-3 px-4 font-bold text-navy-950 font-sans">
                        {formatPKR(o.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${payInfo.badgeClass}`}
                        >
                          {payInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.status === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : o.status === "confirmed"
                              ? "bg-purple-100 text-purple-800"
                              : o.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(o)}
                          className="gap-1.5 text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5 text-gold-600" /> Review
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Packing Slip Modal */}
      <OrderDetailModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
