import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getProducts } from "@/lib/supabase/data-service";
import { ProductCard } from "@/components/shop/product-card";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} | Imported Products Pakistan`,
    description: category.description || `Buy 100% authentic imported ${category.name} in Pakistan with verified advance payment and fast delivery.`,
    openGraph: {
      title: `${category.name} - BaharSe Foreign Imports`,
      description: category.description || "",
      images: category.image_url ? [category.image_url] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const { products, total } = await getProducts({
    categoryId: category.id,
    limit: 24,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-navy-950">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-navy-950">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-navy-950">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-navy-950 text-white min-h-[220px] sm:min-h-[280px] flex items-center p-8 sm:p-12 shadow-luxury border border-navy-800">
        {category.image_url && (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30 mix-blend-overlay"
          />
        )}
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-500 text-navy-950 shadow-sm">
            Imported Collection
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {category.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Showing {products.length} imported items in this category
          </p>
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-navy-900">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Products
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <h3 className="text-base font-bold text-navy-950">
              New Batch Coming Soon!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our recent stock for {category.name} has sold out. The owner is bringing the next fresh shipment shortly.
            </p>
            <div className="pt-2">
              <Link href="/shop">
                <Button variant="gold" size="sm">
                  Browse Other Categories
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
