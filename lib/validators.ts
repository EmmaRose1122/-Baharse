import { z } from "zod";

/**
 * Validation schema for Advance Payment checkout orders in Pakistan (JazzCash, EasyPaisa, Bank Transfer)
 */
export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(03\d{9}|\+923\d{9}|00923\d{9})$/,
      "Please enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)"
    ),
  city: z
    .string()
    .trim()
    .min(2, "Please select or enter your city")
    .max(50, "City name is too long"),
  address: z
    .string()
    .trim()
    .min(8, "Please enter your complete street and house delivery address")
    .max(300, "Address is too long"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  payment_method: z.enum(["jazzcash", "easypaisa", "bank_transfer"], {
    errorMap: () => ({ message: "Please select a payment method (JazzCash, EasyPaisa, or Bank Transfer)" }),
  }),
  transaction_id: z
    .string()
    .trim()
    .min(4, "Please enter your Transaction ID (TID / Ref #) provided by your payment app"),
  sender_account_name: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  sender_account_number: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  payment_receipt_url: z
    .string()
    .optional()
    .or(z.literal("")),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
        size: z.string().optional(),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Validation schema for Contact Us messages
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid contact phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Validation schema for Order Tracking query
 */
export const trackOrderSchema = z.object({
  order_number: z
    .string()
    .trim()
    .min(3, "Please enter your order number (e.g. IMP-12345)"),
  phone: z
    .string()
    .trim()
    .min(9, "Please enter the phone number used when placing the order"),
});

export type TrackOrderFormData = z.infer<typeof trackOrderSchema>;

/**
 * Product Schema for Admin CRUD
 */
export const productAdminSchema = z.object({
  name: z.string().trim().min(3, "Product name is required"),
  slug: z.string().trim().min(3, "Slug is required"),
  description: z.string().trim().min(10, "Detailed description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  old_price: z.coerce.number().positive().optional().nullable(),
  category_id: z.string().min(1, "Category is required"),
  images: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one image is required"),
  origin_country: z.string().trim().min(2, "Origin country is required"),
  sizes: z.array(z.string()).default([]),
  stock_quantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  is_medicine: z.boolean().default(false),
});

export type ProductAdminFormData = z.infer<typeof productAdminSchema>;

/**
 * Category Schema for Admin CRUD
 */
export const categoryAdminSchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
  slug: z.string().trim().min(2, "Category slug is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
});

export type CategoryAdminFormData = z.infer<typeof categoryAdminSchema>;

/**
 * Settings Schema for Admin (JazzCash, EasyPaisa, Bank Transfer accounts)
 */
export const settingsAdminSchema = z.object({
  store_name: z.string().trim().min(2, "Store name is required"),
  contact_email: z.string().trim().email("Valid email is required"),
  address: z.string().trim().min(5, "Physical address is required"),
  delivery_charges: z.coerce.number().min(0, "Delivery charges cannot be negative"),
  free_delivery_above: z.coerce.number().min(0, "Threshold cannot be negative"),
  announcement_text: z.string().trim().optional(),
  
  // JazzCash
  jazzcash_title: z.string().trim().min(2, "JazzCash account title is required"),
  jazzcash_number: z.string().trim().min(11, "Valid JazzCash mobile number is required"),
  
  // EasyPaisa
  easypaisa_title: z.string().trim().min(2, "EasyPaisa account title is required"),
  easypaisa_number: z.string().trim().min(11, "Valid EasyPaisa mobile number is required"),
  
  // Bank Account
  bank_name: z.string().trim().min(2, "Bank name is required"),
  bank_account_title: z.string().trim().min(2, "Bank account title is required"),
  bank_account_number: z.string().trim().min(8, "Bank account number is required"),
  bank_iban: z.string().trim().min(16, "Bank IBAN is required"),
  bank_raast_id: z.string().trim().optional().or(z.literal("")),
  
  social_facebook: z.string().url().optional().or(z.literal("")),
  social_instagram: z.string().url().optional().or(z.literal("")),
  social_tiktok: z.string().url().optional().or(z.literal("")),
});

export type SettingsAdminFormData = z.infer<typeof settingsAdminSchema>;
