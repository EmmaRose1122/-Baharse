"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plane, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  originCountry: string;
}

export function ProductGallery({
  images,
  productName,
  originCountry,
}: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const safeImages = images && images.length > 0 ? images : ["/placeholder.svg"];
  const currentImage = safeImages[selectedIdx] || safeImages[0] || "/placeholder.svg";
  const [mainImgSrc, setMainImgSrc] = useState(currentImage);

  useEffect(() => {
    setMainImgSrc(currentImage);
  }, [currentImage]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-luxury group">
        <Image
          src={mainImgSrc}
          alt={`${productName} view ${selectedIdx + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setMainImgSrc("/placeholder.svg")}
        />

        {/* Origin Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-950/80 backdrop-blur-md text-gold-300 text-xs font-semibold shadow-md">
          <Plane className="w-3.5 h-3.5 text-gold-400" />
          Authentic Import: {originCountry}
        </div>

        {/* Zoom Hint */}
        <div className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-navy-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </div>
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setMainImgSrc(img);
              }}
              className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIdx === idx
                  ? "border-gold-500 ring-2 ring-gold-200 scale-95"
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
