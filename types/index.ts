export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  category_id: string | null;
  category?: Category;
  images: string[];
  origin_country: string;
  sizes: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  is_medicine: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  size?: string;
  origin_country?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank_transfer';
export type PaymentStatus = 'pending_verification' | 'verified' | 'rejected';

export interface OrderUpdateLog {
  id: string;
  title: string;
  message: string;
  created_at: string;
  by: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_charges: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string;
  sender_account_name?: string | null;
  sender_account_number?: string | null;
  payment_receipt_url?: string | null;
  client_messages?: OrderUpdateLog[];
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  store_name: string;
  contact_email: string;
  address: string;
  delivery_charges: number;
  free_delivery_above: number;
  announcement_text?: string | null;
  
  // Advance Payment Details (JazzCash, EasyPaisa, Bank Transfer)
  jazzcash_title: string;
  jazzcash_number: string;
  
  easypaisa_title: string;
  easypaisa_number: string;
  
  bank_name: string;
  bank_account_title: string;
  bank_account_number: string;
  bank_iban: string;
  bank_raast_id?: string;
  
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_tiktok?: string | null;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}
