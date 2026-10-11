"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plane, Lock, Mail, ArrowRight, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Ghalat email ya password. Access denied.");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome! Login successful.");
      router.push(redirectPath);
      router.refresh();
    } catch {
      toast.error("Authentication failed. Please check your network and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-navy-950 border border-slate-200 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-navy-950 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto shadow-md">
            <Plane className="w-7 h-7 transform -rotate-45" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-navy-950">
            BaharSe Admin Portal
          </h1>
          <p className="text-xs text-slate-500">
            Secure store administration & stock management
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Restricted Access:</span> This portal is protected. Only authorized administrators with credentials configured in the system environment can sign in.
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@baharse.pk"
              required
              autoComplete="username"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Secret Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold shadow-gold-glow flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-navy-950 hover:underline inline-flex items-center gap-1"
          >
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
