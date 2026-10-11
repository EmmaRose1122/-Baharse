import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  PackageCheck,
  Send,
  MessageCircle,
} from "lucide-react";
import { getCategories, getProducts } from "@/lib/supabase/data-service";
import { TrustBadges } from "@/components/shop/trust-badges";
import { ProductCard } from "@/components/shop/product-card";
import { NewsletterForm } from "@/components/shop/newsletter-form";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const categories = await getCategories();
  const { products: featuredProducts } = await getProducts({
    isFeatured: true,
    limit: 8,
  });
  const { products: newArrivals } = await getProducts({
    limit: 4,
    sortBy: "newest",
  });

  const testimonials = [
    {
      name: "Chaudhry Salman",
      city: "Lahore (DHA Phase 6)",
      product: "Pure Royal Super Negin Saffron",
      comment:
        "The fragrance and coloring of this saffron is unbelievable! I used to ask relatives traveling to Dubai to bring it. Now getting genuine sealed tins with fast advance verification and courier tracking is fantastic.",
      rating: 5,
    },
    {
      name: "Mrs. Nida Kamran",
      city: "Karachi (Clifton)",
      product: "Turkish Embroidered Silk Suit",
      comment:
        "The fabric quality and embroidery cutwork exceeded my expectations. 100% original Turkish boutique import. The stitching and packaging were pristine.",
      rating: 5,
    },
    {
      name: "Farhan Qureshi",
      city: "Islamabad (Sector F-10)",
      product: "Club De Nuit Pure Parfum (Armaf)",
      comment:
        "Perfumes in Pakistan are usually full of first copies. BaharSe provided a 100% authentic sealed batch. Scanned the barcode and it matches official Armaf records. Lasts 12+ hours!",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        {/* Ambient Gold Glow & Background Pattern */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Slogan & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-gold-500/30 text-gold-400 text-xs font-semibold backdrop-blur-md shadow-inner">
                <Plane className="w-3.5 h-3.5" />
                Handpicked Foreign Imports • Brought Directly by the Owner
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                100% Authentic Imports <br />
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                  Delivered Across Pakistan.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                No replicas. No local copies. Premium kitchen spices, original Dubai & French perfumes, verified OTC supplements, and designer apparel personally brought on each foreign trip. Pay securely via <strong>Advance Payment (JazzCash, EasyPaisa, Bank Transfer)</strong> with real-time website order tracking.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto gap-2">
                    Explore Catalog <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/track-order" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-navy-900/60 border-slate-700 text-white hover:bg-navy-800 gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    Track Your Order
                  </Button>
                </Link>
              </div>

              {/* Mini Trust Stats */}
              <div className="pt-6 border-t border-navy-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-gold-400 font-sans">
                    100%
                  </div>
                  <div className="text-[11px] text-slate-400">Original Guarantee</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-sans">
                    2-4 Days
                  </div>
                  <div className="text-[11px] text-slate-400">Nationwide Shipping</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-sans">
                    Advance
                  </div>
                  <div className="text-[11px] text-slate-400">Verified Transfers</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden border-2 border-gold-500/30 shadow-2xl bg-navy-900">
                <Image
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80"
                  alt="Imported Luxury Perfumes and Authentic Spices"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-navy-900/90 backdrop-blur-md border border-gold-500/40 text-left shadow-lg">
                  <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Direct Trip Procurements
                  </div>
                  <p className="text-xs text-slate-200">
                    Sourced from official distributors and duty-free outlets in Dubai, Istanbul, London, & California.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustBadges />
      </section>

      {/* 3. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-1">
              Explore Our 5 Signature Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-700 flex items-center gap-1 group"
          >
            View All Products{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`group relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-end p-6 min-h-[260px] sm:min-h-[300px] ${
                idx === 0 ? "sm:col-span-2 lg:col-span-2 min-h-[320px]" : ""
              }`}
            >
              <Image
                src={cat.image_url || "/placeholder.jpg"}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent group-hover:from-navy-950 transition-colors" />

              <div className="relative z-10 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-gold-500 text-navy-950 shadow-sm">
                  Imported
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 max-w-md font-normal leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 text-xs font-semibold text-gold-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse Collection <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS / FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              Most Requested
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-1">
              Top Best Sellers in Pakistan
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-700 flex items-center gap-1 group"
          >
            Shop All Catalog{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. WHY SHOP WITH US (OWNER TRIP ASSURANCE) */}
      <section className="bg-navy-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
                Our Provenance & Trust
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Why Buy Foreign Products From Us Instead of Local Open Markets?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Pakistan’s local markets are often flooded with counterfeit perfumes, expired supplements, and duplicated spices. Our store is built on a simple promise: <strong>we only sell items the owner personally buys and clears through customs during foreign travel</strong>.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Original Factory Seals & Batch Numbers
                    </h4>
                    <p className="text-xs text-slate-400">
                      Every perfume decanter and supplement canister includes verifiable manufacturer lot codes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Inspected Before Dispatch
                    </h4>
                    <p className="text-xs text-slate-400">
                      Carefully cushioned with heavy bubble wraps to prevent any transit damage during Pakistan courier transit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Verified Advance Payment Protection
                    </h4>
                    <p className="text-xs text-slate-400">
                      Transparent transfers via JazzCash, EasyPaisa, or Bank with immediate digital receipt verification and live courier tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button variant="gold" size="md">
                    Read Our Full Importer Story
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-navy-700 shadow-2xl relative">
                <Image
                  src="/images/saffron-luxury.jpg"
                  alt="Authentic Saffron and Spices Procurement"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              Just In
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-1">
              Fresh Arrivals From Recent Trips
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-700 flex items-center gap-1 group"
          >
            See All New <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
            Verified Buyers
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Real Reviews From Across Pakistan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Delivering authentic imported goods with care to Lahore, Karachi, Islamabad, Peshawar, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-500 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy-950">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.city}</p>
                </div>
                <span className="text-[10px] font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER / VIP CLUB */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 text-white p-8 sm:p-12 border border-gold-500/30 shadow-luxury text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500 flex items-center justify-center mx-auto text-gold-400">
            <PackageCheck className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-3xl font-serif font-bold text-white">
              Be First to Know When a New Foreign Batch Arrives
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Limited stocks sell out quickly after each trip. Join our private broadcast for stock alerts and exclusive discount vouchers.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
