"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-serif font-bold text-navy-950">
          Something went wrong
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          We encountered an unexpected error while loading this page. Please try refreshing.
        </p>
      </div>

      <Button
        variant="gold"
        size="md"
        onClick={() => reset()}
        className="gap-2 font-bold"
      >
        <RotateCcw className="w-4 h-4" /> Try Again
      </Button>
    </div>
  );
}
