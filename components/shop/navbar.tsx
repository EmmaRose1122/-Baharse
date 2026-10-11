"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Plane,
  Shield,
  Truck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name: "Kitchen Spices", href: "/category/kitchen-spices" },
    { name: "Perfumes", href: "/category/perfumes" },
    { name: "Medicines & Health", href: "/category/medicines" },
    { name: "Ladies Suits", href: "/category/ladies-suits" },
    { name: "Gents Pants", href: "/category/gents-pants" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-navy-950 text-slate-200 text-[11px] sm:text-xs py-2 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              ✈️ 100% Brand-New Handpicked Foreign Imports • Advance Payment (JazzCash, EasyPaisa, Bank Transfer) • Free Delivery Over Rs. 5,000
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 shrink-0">
            <Link
              href="/track-order"
              className="hover:text-gold-400 flex items-center gap-1 transition-colors font-medium"
            >
              <Truck className="w-3.5 h-3.5 text-gold-500" />
              Track Order Status
            </Link>
            <span className="text-navy-700">|</span>
            <Link
              href="/contact"
              className="hover:text-gold-400 flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              Customer Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-navy-950 border border-gold-500/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-gold-400 transform -rotate-45" />
            </div>
            <div>
              <div className="font-serif font-black text-lg sm:text-xl text-navy-950 tracking-tight flex items-center gap-1">
                BAHARSE
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              </div>
              <p className="text-[10px] tracking-widest text-gold-600 font-bold uppercase -mt-1 font-sans">
                Foreign Imports
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perfumes, saffron, suits, supplements..."
              className="w-full pl-10 pr-24 py-2 text-sm rounded-full bg-slate-100/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all text-navy-950 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Login Link */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-navy-950 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Admin Portal"
            >
              <UserCheck className="w-4 h-4 text-slate-400" />
              Admin
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative p-2.5 text-navy-950 bg-slate-100 hover:bg-gold-50 rounded-xl border border-slate-200/80 hover:border-gold-300 transition-all flex items-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-gold-700 transition-colors" />
              <span className="hidden sm:inline text-xs font-bold font-sans">
                Cart
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-2.5 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-6">
            <Link href="/shop" className="hover:text-gold-700 transition-colors flex items-center gap-1">
              All Products
            </Link>
            {navCategories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="hover:text-gold-700 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-normal">
            <Link href="/about" className="hover:text-navy-900 transition-colors font-medium">
              About Our Imports
            </Link>
            <Link href="/contact" className="hover:text-navy-900 transition-colors font-medium">
              Contact
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search imported products..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 border border-slate-200 focus:outline-none text-navy-950"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Links */}
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-800">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Shop All Products
            </Link>
            {navCategories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                {c.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-2 pt-2">
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-navy-900"
              >
                <Truck className="w-4 h-4 text-gold-600" />
                Track My Order
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 block"
              >
                About Our Importer Story
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 block"
              >
                Contact Us
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 text-gold-700 font-bold block"
              >
                Admin Panel Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
