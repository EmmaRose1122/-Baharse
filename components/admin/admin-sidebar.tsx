"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  MessageSquare,
  Settings,
  ExternalLink,
  Plane,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-950 text-slate-200 border-r border-navy-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Close on mobile */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-navy-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500 flex items-center justify-center">
                <Plane className="w-4 h-4 text-gold-400 transform -rotate-45" />
              </div>
              <div>
                <span className="font-serif font-black text-sm text-white tracking-wider">
                  BAHARSE
                </span>
                <span className="block text-[9px] font-bold text-gold-500 uppercase tracking-widest">
                  Admin Portal
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gold-500 text-navy-950 font-bold shadow-md shadow-gold-500/20"
                      : "text-slate-300 hover:bg-navy-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Link */}
        <div className="p-4 border-t border-navy-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-navy-900/80 hover:bg-navy-900 text-xs text-slate-300 transition-colors border border-navy-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gold-400" />
              View Customer Store
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">LIVE</span>
          </Link>

          <div className="text-[10px] text-slate-500 text-center">
            BaharSe Foreign Imports • Advance Payment Portal
          </div>
        </div>
      </aside>
    </>
  );
}
