"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPKR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDeliveryCharges,
    getTotal,
    getAmountForFreeDelivery,
    freeDeliveryThreshold,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const deliveryCharges = mounted ? getDeliveryCharges() : 0;
  const total = mounted ? getTotal() : 0;
  const amountForFree = mounted ? getAmountForFreeDelivery() : 0;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-600" />
                  <h3 className="text-base font-bold text-navy-900 font-serif">
                    Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-200/60 rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Meter */}
              <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-100">
                <div className="flex justify-between items-center text-xs text-amber-900 font-medium mb-1.5">
                  <span>
                    {amountForFree === 0 ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        🎉 Congratulations! You have unlocked FREE Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong>{formatPKR(amountForFree)}</strong> more for{" "}
                        <strong className="text-gold-700">FREE Nationwide Delivery</strong>
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-amber-950">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Item List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h4 className="text-base font-bold text-navy-900 mb-1">
                      Your cart is currently empty
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mb-6">
                      Explore our handpicked collection of authentic foreign perfumes, spices, suits, and wellness goods.
                    </p>
                    <Button variant="gold" onClick={closeCart}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={`${item.product.id}-${item.selectedSize || idx}`} className="py-4 flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.jpg"}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-xs font-semibold text-navy-950 hover:text-gold-700 line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedSize)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.selectedSize && (
                            <span className="inline-block mt-0.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          <div className="text-xs text-slate-400 mt-0.5">
                            From: {item.product.origin_country}
                          </div>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold text-navy-900">
                            {formatPKR(item.product.price * item.quantity)}
                          </span>

                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedSize
                                )
                              }
                              className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-slate-800">
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
                              className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-slate-200 p-6 bg-slate-50/50 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Delivery</span>
                      <span className="font-semibold text-slate-900">
                        {deliveryCharges === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          formatPKR(deliveryCharges)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-navy-950 pt-2 border-t border-slate-200">
                      <span>Total Due</span>
                      <span className="text-base text-gold-700">{formatPKR(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link href="/checkout" onClick={closeCart} className="block w-full">
                      <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2">
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/cart" onClick={closeCart} className="block w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Cart
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Advance Payment (JazzCash, EasyPaisa, Bank) • 100% Original</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
