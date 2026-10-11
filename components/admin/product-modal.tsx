"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { Product, Category } from "@/types";
import { productAdminSchema, ProductAdminFormData } from "@/lib/validators";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
  categories: Category[];
}

export function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
  categories,
}: ProductModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSizeInput, setNewSizeInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductAdminFormData>({
    resolver: zodResolver(productAdminSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      old_price: null,
      category_id: categories[0]?.id || "",
      images: [],
      origin_country: "Dubai (UAE)",
      sizes: [],
      stock_quantity: 10,
      is_featured: false,
      is_active: true,
      is_medicine: false,
    },
  });

  const nameValue = watch("name");

  // Auto-generate slug when name changes for new products
  useEffect(() => {
    if (!productToEdit && nameValue) {
      const slugified = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slugified);
    }
  }, [nameValue, productToEdit, setValue]);

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        slug: productToEdit.slug,
        description: productToEdit.description,
        price: productToEdit.price,
        old_price: productToEdit.old_price,
        category_id: productToEdit.category_id || categories[0]?.id || "",
        images: productToEdit.images,
        origin_country: productToEdit.origin_country,
        sizes: productToEdit.sizes || [],
        stock_quantity: productToEdit.stock_quantity,
        is_featured: productToEdit.is_featured,
        is_active: productToEdit.is_active,
        is_medicine: productToEdit.is_medicine,
      });
      setImages(productToEdit.images || []);
      setSizes(productToEdit.sizes || []);
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        price: 0,
        old_price: null,
        category_id: categories[0]?.id || "",
        images: [],
        origin_country: "Dubai (UAE)",
        sizes: [],
        stock_quantity: 10,
        is_featured: false,
        is_active: true,
        is_medicine: false,
      });
      setImages([]);
      setSizes([]);
    }
  }, [productToEdit, reset, categories]);

  // Keep images & sizes synced with form
  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  useEffect(() => {
    setValue("sizes", sizes);
  }, [sizes, setValue]);

  // Handle multi-image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.url) {
          setImages((prev) => [...prev, data.url]);
        } else {
          toast.error(data.error || "Failed to upload image");
        }
      } catch (err) {
        toast.error("Upload error. Please try again.");
      }
    }

    setIsUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddSize = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim())) {
      setSizes((prev) => [...prev, newSizeInput.trim()]);
      setNewSizeInput("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const onSubmit = async (formData: ProductAdminFormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product photo.");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = productToEdit
        ? `/api/admin/products/${productToEdit.id}`
        : "/api/admin/products";
      const method = productToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          sizes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to save product.");
        setIsSubmitting(false);
        return;
      }

      toast.success(
        productToEdit
          ? "Product updated successfully!"
          : "New product added to catalog!"
      );
      onSuccess();
      onClose();
    } catch {
      toast.error("Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? "Edit Imported Product" : "Add New Foreign Import"}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-xs">
        {/* Name and Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Lattafa Khamrah 100ml"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
            {errors.name && (
              <p className="text-red-600 text-[11px]">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("slug")}
              placeholder="e.g. lattafa-khamrah-100ml"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
            {errors.slug && (
              <p className="text-red-600 text-[11px]">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Category & Origin Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category_id")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              Origin Country / Procured From <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("origin_country")}
              placeholder="e.g. Dubai (UAE), Turkey, UK, USA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              Sale Price (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="50"
              {...register("price")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 font-bold focus:ring-2 focus:ring-gold-500"
            />
            {errors.price && (
              <p className="text-red-600 text-[11px]">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              Old Price (Strikethrough)
            </label>
            <input
              type="number"
              step="50"
              {...register("old_price")}
              placeholder="Optional"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-navy-950">
              Available Stock Qty <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("stock_quantity")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 font-bold focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="font-bold text-navy-950">
            Product Description & Provenance Details <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            {...register("description")}
            placeholder="Details about the fragrance notes, fabric weave, spice harvest grade, or supplement ingredients..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
          />
          {errors.description && (
            <p className="text-red-600 text-[11px]">{errors.description.message}</p>
          )}
        </div>

        {/* Sizes Manager */}
        <div className="space-y-2">
          <label className="font-bold text-navy-950">
            Available Sizes / Variations (Optional for clothing, apparel, or jars):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSizeInput}
              onChange={(e) => setNewSizeInput(e.target.value)}
              placeholder="e.g. 32 Waist, Medium, or 5g Tin"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSize}
            >
              Add Size
            </Button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-[11px]"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Multiple Image Upload */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <label className="font-bold text-navy-950">
              Product Images (Supabase Storage: bucket product-images) <span className="text-red-500">*</span>
            </label>
            <span className="text-slate-400 text-[11px]">
              {images.length} photos selected
            </span>
          </div>

          {/* Upload Input */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-gold-50/50 hover:bg-gold-50 text-gold-900 font-semibold cursor-pointer transition-colors text-xs">
              <Upload className="w-4 h-4 text-gold-600" />
              <span>{isUploading ? "Uploading to Storage..." : "Upload Photos"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50"
                >
                  <Image
                    src={img}
                    alt={`Product preview ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-navy-950/80 text-gold-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles (Active, Featured, Medicine) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_active")}
              className="rounded text-gold-500 focus:ring-gold-400"
            />
            <span className="font-bold text-navy-950">Active on Store</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_featured")}
              className="rounded text-gold-500 focus:ring-gold-400"
            />
            <span className="font-bold text-navy-950">Featured Product</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_medicine")}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-bold text-amber-950">OTC Medicine / Supplement</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={isSubmitting}
            className="font-bold"
          >
            {productToEdit ? "Update Product" : "Save & Publish Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
