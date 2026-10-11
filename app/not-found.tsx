import React from "react";
import Link from "next/link";
import { Plane, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-navy-950 text-gold-400 flex items-center justify-center shadow-luxury">
        <Plane className="w-10 h-10 transform -rotate-45" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
          404 - Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
          Looks Like This Flight Diverted
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The imported product or page you are looking for has either moved or is no longer available in our catalog.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="gold" size="md" className="gap-2">
            <Home className="w-4 h-4" /> Return to Homepage
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="md" className="gap-2">
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
