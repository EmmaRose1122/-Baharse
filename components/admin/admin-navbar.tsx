"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  adminEmail?: string;
}

export function AdminNavbar({
  onToggleSidebar,
  adminEmail = "admin@importedgoods.pk",
}: AdminNavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored
    } finally {
      toast.success("Signed out of admin portal.");
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold-100 text-gold-900 border border-gold-300">
            Owner Portal
          </span>
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">
            Direct Foreign Stock & Order Manager
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin profile pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700">
          <div className="w-6 h-6 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-[10px]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium hidden sm:inline">{adminEmail}</span>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
