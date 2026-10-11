"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { Category } from "@/types";
import { categoryAdminSchema, CategoryAdminFormData } from "@/lib/validators";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: Category | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}: CategoryModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryAdminFormData>({
    resolver: zodResolver(categoryAdminSchema),
    defaultValues: {
      name: "",
      slug: "",
      image_url: "",
      description: "",
    },
  });

  const nameVal = watch("name");

  useEffect(() => {
    if (!categoryToEdit && nameVal) {
      const slugified = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slugified);
    }
  }, [nameVal, categoryToEdit, setValue]);

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        image_url: categoryToEdit.image_url || "",
        description: categoryToEdit.description || "",
      });
      setImageUrl(categoryToEdit.image_url || "");
    } else {
      reset({
        name: "",
        slug: "",
        image_url: "",
        description: "",
      });
      setImageUrl("");
    }
  }, [categoryToEdit, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setImageUrl(data.url);
        setValue("image_url", data.url);
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (formData: CategoryAdminFormData) => {
    setIsSubmitting(true);

    try {
      const url = categoryToEdit
        ? `/api/admin/categories/${categoryToEdit.id}`
        : "/api/admin/categories";
      const method = categoryToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl || formData.image_url,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to save category.");
        setIsSubmitting(false);
        return;
      }

      toast.success(
        categoryToEdit
          ? "Category updated successfully!"
          : "Category created!"
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
      title={categoryToEdit ? "Edit Category" : "Add New Category"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-navy-950">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="e.g. Perfumes & Attars"
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
            placeholder="e.g. perfumes"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-navy-950 focus:ring-2 focus:ring-gold-500"
          />
          {errors.slug && (
            <p className="text-red-600 text-[11px]">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-navy-950">Description</label>
          <textarea
            rows={3}
            {...register("description")}
            placeholder="Brief overview of imported products in this category..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-950 focus:ring-2 focus:ring-gold-500"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="font-bold text-navy-950 block">
            Category Banner Image
          </label>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-700">
              <Upload className="w-4 h-4 text-gold-600" />
              <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <span className="text-slate-400">or enter image URL below</span>
          </div>

          <input
            type="url"
            {...register("image_url")}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-navy-950"
          />

          {imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-100">
              <Image
                src={imageUrl}
                alt="Category preview"
                fill
                sizes="300px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            isLoading={isSubmitting}
            className="font-bold"
          >
            {categoryToEdit ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
