import React from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/supabase/data-service";
import { ProductCard } from "@/components/shop/product-card";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "popular";
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const categories = await getCategories();

  const selectedCategorySlug = searchParams.category;
  const searchQuery = searchParams.search;
  const currentSort = searchParams.sort || "newest";
  const minPriceNum = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPriceNum = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const itemsPerPage = 12;

  const { products, total } = await getProducts({
    categorySlug: selectedCategorySlug,
    search: searchQuery,
    sortBy: currentSort,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    limit: itemsPerPage,
    page: currentPage,
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  // Helper to build URL query
  const createFilterUrl = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    if (selectedCategorySlug) params.set("category", selectedCategorySlug);
    if (searchQuery) params.set("search", searchQuery);
    if (currentSort && currentSort !== "newest") params.set("sort", currentSort);
    if (minPriceNum !== undefined) params.set("minPrice", minPriceNum.toString());
    if (maxPriceNum !== undefined) params.set("maxPrice", maxPriceNum.toString());

    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === "") {
        params.delete(k);
      } else {
        params.set(k, v.toString());
      }
    });

    const q = params.toString();
    return `/shop${q ? `?${q}` : ""}`;
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-navy-950">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-navy-950">
            {activeCategoryObj ? activeCategoryObj.name : "Shop All Imported Products"}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-navy-950">
              {activeCategoryObj ? activeCategoryObj.name : "Authentic Foreign Goods"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {products.length} of {total} authentic brand-new imported products
            </p>
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategorySlug && (
              <Link
                href={createFilterUrl({ category: undefined, page: 1 })}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gold-100 text-gold-900 border border-gold-300 font-medium"
              >
                Category: {activeCategoryObj?.name || selectedCategorySlug}
                <X className="w-3.5 h-3.5" />
              </Link>
            )}
            {searchQuery && (
              <Link
                href={createFilterUrl({ search: undefined, page: 1 })}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-200 text-slate-800 font-medium"
              >
                Keyword: "{searchQuery}"
                <X className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Filter Panel */}
        <aside className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-bold text-navy-950">
            <SlidersHorizontal className="w-4 h-4 text-gold-600" />
            <span>Filter Products</span>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Categories
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs">
              <Link
                href={createFilterUrl({ category: undefined, page: 1 })}
                className={`px-3 py-2 rounded-xl transition-colors font-medium flex justify-between items-center ${
                  !selectedCategorySlug
                    ? "bg-navy-900 text-white font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>All Categories</span>
                <span>({total})</span>
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={createFilterUrl({ category: c.slug, page: 1 })}
                  className={`px-3 py-2 rounded-xl transition-colors font-medium flex justify-between items-center ${
                    selectedCategorySlug === c.slug
                      ? "bg-navy-900 text-white font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sort By
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs">
              {[
                { label: "Newest Imports", value: "newest" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Most In Demand", value: "popular" },
              ].map((s) => (
                <Link
                  key={s.value}
                  href={createFilterUrl({ sort: s.value, page: 1 })}
                  className={`px-3 py-2 rounded-xl transition-colors font-medium ${
                    currentSort === s.value
                      ? "bg-gold-50 text-gold-900 border border-gold-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Range Presets */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Price Range (PKR)
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs">
              <Link
                href={createFilterUrl({ minPrice: undefined, maxPrice: undefined, page: 1 })}
                className={`px-3 py-2 rounded-xl transition-colors font-medium ${
                  minPriceNum === undefined && maxPriceNum === undefined
                    ? "bg-slate-100 font-bold text-navy-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Any Price
              </Link>
              <Link
                href={createFilterUrl({ minPrice: 0, maxPrice: 3000, page: 1 })}
                className={`px-3 py-2 rounded-xl transition-colors font-medium ${
                  maxPriceNum === 3000
                    ? "bg-slate-100 font-bold text-navy-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Under Rs. 3,000
              </Link>
              <Link
                href={createFilterUrl({ minPrice: 3000, maxPrice: 7000, page: 1 })}
                className={`px-3 py-2 rounded-xl transition-colors font-medium ${
                  minPriceNum === 3000 && maxPriceNum === 7000
                    ? "bg-slate-100 font-bold text-navy-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Rs. 3,000 - Rs. 7,000
              </Link>
              <Link
                href={createFilterUrl({ minPrice: 7000, maxPrice: undefined, page: 1 })}
                className={`px-3 py-2 rounded-xl transition-colors font-medium ${
                  minPriceNum === 7000
                    ? "bg-slate-100 font-bold text-navy-950"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Rs. 7,000 & Above
              </Link>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="pt-2">
            <Link href="/shop" className="block w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Clear All Filters
              </Button>
            </Link>
          </div>
        </aside>

        {/* Right Column: Products Grid */}
        <section className="lg:col-span-3 space-y-8">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 font-serif">
                No matching imported products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or searching for alternative keywords like "saffron", "parfum", or "suits".
              </p>
              <div>
                <Link href="/shop">
                  <Button variant="gold" size="sm">
                    Reset Filters
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={createFilterUrl({ page: pageNum })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-navy-950 text-gold-400 shadow-md scale-105"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
