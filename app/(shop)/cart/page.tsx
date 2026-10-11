"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPKR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDeliveryCharges,
    getTotal,
    getAmountForFreeDelivery,
    freeDeliveryThreshold,
  } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryCharges = getDeliveryCharges();
  const total = getTotal();
  const amountForFree = getAmountForFreeDelivery();
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950">Shopping Cart</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Review Your Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {items.length === 0
              ? "Your cart is empty."
              : `You have ${items.reduce((s, i) => s + i.quantity, 0)} items in your cart.`}
          </p>
        </div>

        <Link href="/shop">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-navy-900">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-bold text-navy-950 font-serif">
            Your shopping cart is currently empty
          </h2>
          <p className="text-xs text-slate-500">
            Browse our imported inventory of perfumes, spices, wellness items, and garments.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="gold" size="md">
                Start Shopping Now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Free Delivery Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex justify-between text-xs text-amber-950 font-semibold">
                <span>
                  {amountForFree === 0 ? (
                    <span className="text-emerald-700 font-bold">
                      🎉 You have qualified for FREE Delivery nationwide!
                    </span>
                  ) : (
                    <span>
                      Add <strong>{formatPKR(amountForFree)}</strong> more for FREE Shipping
                    </span>
                  )}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Table of items */}
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || idx}`}
                  className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm font-bold text-navy-950 hover:text-gold-700 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-slate-500">
                        Imported from: {item.product.origin_country}
                      </div>
                      {item.selectedSize && (
                        <span className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      <div className="text-xs font-semibold text-navy-950 sm:hidden pt-1">
                        {formatPKR(item.product.price)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize
                          )
                        }
                        className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-navy-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize
                          )
                        }
                        className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for line */}
                    <div className="text-sm font-extrabold text-navy-950 min-w-24 text-right">
                      {formatPKR(item.product.price * item.quantity)}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-base font-bold text-navy-950 font-serif pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-navy-950">{formatPKR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Nationwide Courier Dispatch</span>
                <span className="font-bold text-navy-950">
                  {deliveryCharges === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE Delivery</span>
                  ) : (
                    formatPKR(deliveryCharges)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-navy-950 pt-3 border-t border-slate-100">
                <span>Total Amount Due</span>
                <span className="text-xl text-gold-700">{formatPKR(total)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="block w-full">
                <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-navy-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Advance Payment Guarantee
              </div>
              <p className="text-[11px] leading-relaxed">
                Fast and secure advance deposits via JazzCash, EasyPaisa, or Bank Transfer (Meezan/Raast). Submit your Transaction ID at checkout for immediate verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
