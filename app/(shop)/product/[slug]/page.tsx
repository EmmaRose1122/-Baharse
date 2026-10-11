import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/supabase/data-service";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductPurchaseForm } from "@/components/shop/product-purchase-form";
import { MedicineDisclaimer } from "@/components/shop/medicine-disclaimer";
import { ProductCard } from "@/components/shop/product-card";
import {
  ChevronRight,
  Plane,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} (Imported from ${product.origin_country}) | Buy in Pakistan`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - 100% Original Foreign Import`,
      description: product.description.slice(0, 160),
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id,
    4
  );

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: `Imported from ${product.origin_country}`,
    },
    offers: {
      "@type": "Offer",
      url: `https://importedstore.pk/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "BaharSe Foreign Imports",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-navy-950">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-navy-950"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950 line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery
            images={product.images}
            productName={product.name}
            originCountry={product.origin_country}
          />
        </div>

        {/* Right: Info & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-navy-950 text-gold-300">
                <Plane className="w-3.5 h-3.5 text-gold-400" />
                Handpicked Import: {product.origin_country}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                100% Brand-New & Authentic
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-navy-950 leading-tight">
              {product.name}
            </h1>

            {product.category && (
              <p className="text-xs text-slate-500 font-medium">
                Category:{" "}
                <Link
                  href={`/category/${product.category.slug}`}
                  className="text-gold-700 hover:underline font-bold"
                >
                  {product.category.name}
                </Link>
              </p>
            )}
          </div>

          {/* Medicine Disclaimer if is_medicine */}
          {product.is_medicine && <MedicineDisclaimer />}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Product Overview & Provenance
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Interactive Pricing, Sizes & Cart CTA */}
          <ProductPurchaseForm product={product} />

          {/* Key Trust Perks */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-center">
            <div className="p-3 rounded-2xl bg-white border border-slate-200">
              <Truck className="w-5 h-5 text-gold-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-navy-950">2-4 Days Shipping</div>
              <div className="text-[10px] text-slate-500">TCS / Leopards</div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-navy-950">Advance Pay Verified</div>
              <div className="text-[10px] text-slate-500">Fast Receipt Approval</div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200">
              <RotateCcw className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-navy-950">Checking Warranty</div>
              <div className="text-[10px] text-slate-500">7-Day Replacement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy-950">
              Related Foreign Imports
            </h3>
            <Link
              href="/shop"
              className="text-xs font-semibold text-gold-700 hover:text-navy-900"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
