"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: Message) => {
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !msg.is_read }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
        );
        toast.success(`Message marked as ${!msg.is_read ? "read" : "unread"}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/messages/${deletingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== deletingId));
        toast.success("Message deleted");
        setDeletingId(null);
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Customer Inquiries & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Messages sent by shoppers through the website contact form.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Total Inquiries: {messages.length}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No customer inquiries received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((m) => {
            const cleanPhone = m.phone.replace(/[^0-9]/g, "");

            return (
              <div
                key={m.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
                  m.is_read
                    ? "border-slate-200 opacity-90"
                    : "border-gold-300 ring-2 ring-gold-100"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-navy-950">{m.name}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{m.phone}</span>
                        {m.email && (
                          <>
                            <span>•</span>
                            <span>{m.email}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.is_read
                          ? "bg-slate-100 text-slate-600"
                          : "bg-gold-100 text-gold-900 border border-gold-300"
                      }`}
                    >
                      {m.is_read ? "Read" : "New"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
                    "{m.message}"
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(m.created_at)}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {m.email ? (
                    <a href={`mailto:${m.email}?subject=Reply%20from%20BaharSe%20Foreign%20Imports`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-navy-800 bg-slate-50 border-slate-200"
                      >
                        <Mail className="w-3.5 h-3.5 text-gold-600" />
                        Reply via Email
                      </Button>
                    </a>
                  ) : (
                    <a href={`tel:${cleanPhone}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-navy-800 bg-slate-50 border-slate-200"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-600" />
                        Call Customer
                      </Button>
                    </a>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRead(m)}
                      className="text-xs text-slate-600"
                    >
                      {m.is_read ? "Mark Unread" : "Mark Read"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(m.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Message"
        message="Are you sure you want to delete this customer message?"
      />
    </div>
  );
}
