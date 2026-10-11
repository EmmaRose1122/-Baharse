"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Printer,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  CreditCard,
  FileCheck,
  Send,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import {
  formatPKR,
  formatDate,
  formatPaymentMethod,
  getPaymentStatusInfo,
  getOrderStatusInfo,
} from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusUpdate: (orderId: string, updatedOrder: Partial<Order>) => void;
}

export function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onStatusUpdate,
}: OrderDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status || "pending"
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status || "pending_verification"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [clientMessageTitle, setClientMessageTitle] = useState("");
  const [clientMessageBody, setClientMessageBody] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setSelectedPaymentStatus(order.payment_status);
    }
  }, [order]);

  if (!order) return null;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedStatus(newStatus);
        onStatusUpdate(order.id, { status: newStatus });
        toast.success(`Order marked as ${newStatus}`);
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Error communicating with server");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus: PaymentStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedPaymentStatus(newPaymentStatus);
        onStatusUpdate(order.id, { payment_status: newPaymentStatus });
        toast.success(`Payment status updated to ${newPaymentStatus}`);
      } else {
        toast.error(data.error || "Failed to update payment status");
      }
    } catch {
      toast.error("Error communicating with server");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessageBody.trim()) {
      toast.error("Please enter a message for the customer.");
      return;
    }

    setIsSendingMessage(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newMessage: {
            title: clientMessageTitle.trim() || "Store Update",
            message: clientMessageBody.trim(),
            by: "BaharSe Verification Desk",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Message logged and visible on customer's tracking page!");
        setClientMessageTitle("");
        setClientMessageBody("");
        if (data.order?.client_messages) {
          onStatusUpdate(order.id, { client_messages: data.order.client_messages });
        }
      } else {
        toast.error(data.error || "Failed to post message");
      }
    } catch {
      toast.error("Error posting customer update");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order & Advance Payment Management: ${order.order_number}`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-xs print:p-0 print:border-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 print:hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Fulfillment Status */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy-950">Fulfillment:</span>
              <select
                value={selectedStatus}
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white text-navy-950 focus:ring-2 focus:ring-gold-500 text-xs"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Advance Payment Status */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy-950">Payment Status:</span>
              <select
                value={selectedPaymentStatus}
                disabled={isUpdating}
                onChange={(e) =>
                  handlePaymentStatusChange(e.target.value as PaymentStatus)
                }
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs focus:ring-2 focus:ring-gold-500 ${
                  selectedPaymentStatus === "verified"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : selectedPaymentStatus === "rejected"
                    ? "bg-rose-50 text-rose-800 border-rose-300"
                    : "bg-amber-50 text-amber-800 border-amber-300"
                }`}
              >
                <option value="pending_verification">⏳ Pending Verification</option>
                <option value="verified">✓ Verified & Approved</option>
                <option value="rejected">✗ Rejected / Invalid TID</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 ml-auto"
            >
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              Print Packing Slip
            </Button>
          </div>

          {/* Advance Payment Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Payment Channel
              </span>
              <span className="font-bold text-navy-950 capitalize">
                {formatPaymentMethod(order.payment_method)}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Transaction ID (TID)
              </span>
              <span className="font-mono font-bold text-navy-950">
                {order.transaction_id || "None"}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Sender Info
              </span>
              <span className="font-medium text-navy-950 truncate block">
                {order.sender_account_name || "N/A"}{" "}
                {order.sender_account_number ? `(${order.sender_account_number})` : ""}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Receipt Upload
                </span>
                <span className="text-xs font-semibold">
                  {order.payment_receipt_url ? "Attached" : "No file"}
                </span>
              </div>
              {order.payment_receipt_url && (
                <a
                  href={order.payment_receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-gold-50 text-gold-800 rounded-lg font-bold text-[10px] hover:bg-gold-100 flex items-center gap-1"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Post Message to Tracking Log */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-200 space-y-2">
            <span className="font-bold text-navy-950 block">
              Post Update Message to Customer's Tracking Portal:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={clientMessageTitle}
                onChange={(e) => setClientMessageTitle(e.target.value)}
                placeholder="Title: e.g. Payment Verified / TCS Tracking #"
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-navy-950"
              />
              <input
                type="text"
                value={clientMessageBody}
                onChange={(e) => setClientMessageBody(e.target.value)}
                placeholder="Message: e.g. Verified in Meezan account. Dispatched with TCS #12345"
                className="sm:col-span-2 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-navy-950"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                isLoading={isSendingMessage}
                className="text-xs font-bold gap-1"
              >
                <Send className="w-3 h-3 text-gold-600" />
                Post Update to Order
              </Button>
            </div>
          </form>
        </div>

        {/* Printable Packing Slip / Invoice */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-serif font-bold text-navy-950">
                BAHARSE FOREIGN IMPORTS
              </h2>
              <p className="text-[11px] text-slate-500">
                Liberty Market, Gulberg III, Lahore • orders@baharse.pk
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-gold-900 border border-gold-300">
                  Advance Payment Packing Slip
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  Method: {formatPaymentMethod(order.payment_method)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-mono font-bold text-navy-950">
                {order.order_number}
              </div>
              <div className="text-[11px] text-slate-500">
                {formatDate(order.created_at)}
              </div>
              <div className="text-[11px] font-mono text-slate-600 mt-1">
                TID: <strong>{order.transaction_id}</strong>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Destination */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px]">
                Deliver To:
              </h4>
              <p className="font-bold text-navy-950">{order.customer_name}</p>
              <p className="text-slate-600">{order.address}</p>
              <p className="font-semibold text-slate-800">City: {order.city}</p>
              <p className="text-slate-600">Phone: {order.phone}</p>
              {order.notes && (
                <p className="italic text-amber-900 pt-1">
                  Customer Note: "{order.notes}"
                </p>
              )}
            </div>

            <div className="space-y-1 text-right">
              <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px]">
                Payment Status:
              </h4>
              <p className="font-bold text-emerald-700 capitalize">
                {order.payment_status === "verified"
                  ? "Advance Paid & Verified"
                  : order.payment_status === "rejected"
                  ? "Payment Rejected"
                  : "Under Verification"}
              </p>
              <p className="text-slate-500 font-mono">TID: {order.transaction_id}</p>
              <p className="font-bold text-navy-950 pt-2">
                Total Order Value: {formatPKR(order.total)}
              </p>
            </div>
          </div>

          {/* Ordered Line Items Table */}
          <div>
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Size / Var</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-navy-950">
                      {item.product_name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Imported: {item.origin_country || "Overseas"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {item.size || "Standard"}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {formatPKR(item.price)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-navy-950">
                      {formatPKR(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5 border-t border-slate-200 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-navy-950">
                  {formatPKR(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges:</span>
                <span className="font-bold text-navy-950">
                  {order.delivery_charges === 0 ? "FREE" : formatPKR(order.delivery_charges)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-navy-950 pt-1.5 border-t border-slate-200">
                <span>Total Paid in Advance:</span>
                <span className="text-base text-gold-700">
                  {formatPKR(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Signoff / Quality Seal */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
            <span>Packed with tamper-evident seal by BaharSe Foreign Imports.</span>
            <span>Warehouse Dispatch Sign: __________________</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
