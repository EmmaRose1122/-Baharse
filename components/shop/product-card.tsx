"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, AlertCircle, Plane } from "lucide-react";
import { Product } from "@/types";
import { formatPKR } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock_quantity <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    // Default to first size if sizes array exists
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    addItem(product, 1, defaultSize);
    toast.success(`Added ${product.name} to cart!`);
  };

  const discountPercent =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : 0;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const [imgSrc, setImgSrc] = React.useState(
    product.images[0] || "/placeholder.svg"
  );

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-slate-100"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={() => setImgSrc("/placeholder.svg")}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Imported from Country */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-navy-950/85 text-gold-300 backdrop-blur-md shadow-sm">
            <Plane className="w-3 h-3 text-gold-400" />
            Imported: {product.origin_country}
          </span>

          {/* Medicine notice */}
          {product.is_medicine && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-navy-950 backdrop-blur-md shadow-sm">
              <AlertCircle className="w-3 h-3 text-navy-900" />
              Doctor Advice
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            Save {discountPercent}%
          </div>
        )}

        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md tracking-wider shadow">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Stock hint */}
          <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
            <span className="text-slate-400 font-sans">{product.origin_country}</span>
            {isOutOfStock ? (
              <span className="text-red-500 font-semibold">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold animate-pulse">
                Only {product.stock_quantity} left!
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">In Stock</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-navy-950 line-clamp-2 hover:text-gold-700 transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-navy-950 font-sans">
              {formatPKR(product.price)}
            </span>
            {product.old_price && product.old_price > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPKR(product.old_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-gold-400" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
