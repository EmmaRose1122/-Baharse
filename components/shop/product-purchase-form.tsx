"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Plus, Minus, ShieldCheck, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPKR } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ProductPurchaseFormProps {
  product: Product;
}

export function ProductPurchaseForm({ product }: ProductPurchaseFormProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is sold out.");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please choose a size before adding to cart.");
      return;
    }

    addItem(product, quantity, selectedSize || undefined);
    toast.success(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("This product is sold out.");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please choose a size before proceeding.");
      return;
    }

    addItem(product, quantity, selectedSize || undefined);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200">
      {/* Price Header */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-sans">
          {formatPKR(product.price)}
        </span>
        {product.old_price && product.old_price > product.price && (
          <span className="text-base text-slate-400 line-through">
            {formatPKR(product.old_price)}
          </span>
        )}
        <span className="text-xs text-slate-500 font-medium">
          (Tax included • Advance Payment)
        </span>
      </div>

      {/* Stock Availability */}
      <div>
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            Sold Out (Next batch arriving soon)
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            ⚠️ Low Stock Alert: Only {product.stock_quantity} units available!
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
          </span>
        )}
      </div>

      {/* Size Selector (If applicable) */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-navy-950 uppercase tracking-wider block">
            Select Size / Variation:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedSize === size
                    ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & CTA Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quantity:
          </label>
          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2.5 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-bold text-navy-950">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) =>
                  Math.min(
                    q + 1,
                    product.stock_quantity > 0 ? product.stock_quantity : 99
                  )
                )
              }
              disabled={
                isOutOfStock ||
                (product.stock_quantity > 0 && quantity >= product.stock_quantity)
              }
              className="p-2.5 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 border-navy-900 text-navy-950 hover:bg-slate-100 font-bold"
          >
            <ShoppingBag className="w-5 h-5 text-gold-600" />
            Add to Cart
          </Button>

          <Button
            variant="gold"
            size="lg"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 font-bold shadow-md"
          >
            <span>Buy Now (Advance Pay)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reassurance Note */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-navy-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Authenticity & Advance Payment Promise
        </div>
        <p>
          100% genuine foreign import. Secure your item with advance payment via JazzCash, EasyPaisa, or Bank Transfer. Fast nationwide express courier dispatch upon verification.
        </p>
      </div>
    </div>
  );
}
