"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function NewsletterForm() {
  const [inputVal, setInputVal] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setIsSubscribed(true);
      toast.success("Shukriya! You will receive priority notifications when new imports land.");
      setInputVal("");
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 bg-navy-800/60 p-3 rounded-xl border border-emerald-500/40 max-w-md mx-auto">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Shukriya! You are on our VIP restock alert list.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        placeholder="Enter your phone or email"
        required
        className="flex-1 px-4 py-3 rounded-xl bg-navy-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
      />
      <Button variant="gold" size="md" className="shrink-0 gap-2 font-bold">
        <Send className="w-4 h-4" /> Subscribe
      </Button>
    </form>
  );
}
