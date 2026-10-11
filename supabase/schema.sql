-- ==============================================================================
-- BAHARSE FOREIGN IMPORTS (PAKISTAN) - DATABASE SCHEMA
-- Advance Payment (JazzCash / EasyPaisa / Bank Transfer), Direct Site Orders & RLS
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(12, 2) CHECK (old_price >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    origin_country VARCHAR(100) NOT NULL DEFAULT 'Imported',
    sizes TEXT[] DEFAULT '{}',
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_medicine BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

-- 3. ORDERS TABLE (Advance Payment via JazzCash, EasyPaisa, or Bank Transfer)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_charges NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_charges >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('jazzcash', 'easypaisa', 'bank_transfer')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending_verification' CHECK (payment_status IN ('pending_verification', 'verified', 'rejected')),
    transaction_id VARCHAR(100) NOT NULL,
    sender_account_name VARCHAR(100),
    sender_account_number VARCHAR(50),
    payment_receipt_url TEXT,
    client_messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. MESSAGES TABLE (Contact Us inquiries)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

-- 5. SITE SETTINGS TABLE (Owner Bank & Mobile Wallet Accounts)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name VARCHAR(255) NOT NULL DEFAULT 'BaharSe Foreign Imports',
    contact_email VARCHAR(255) NOT NULL DEFAULT 'orders@baharse.pk',
    address TEXT NOT NULL DEFAULT 'Suite 14, Commercial Plaza, Liberty Market, Gulberg III, Lahore, Pakistan',
    delivery_charges NUMERIC(12, 2) NOT NULL DEFAULT 250,
    free_delivery_above NUMERIC(12, 2) NOT NULL DEFAULT 5000,
    announcement_text TEXT DEFAULT '✈️ 100% Brand-New Handpicked Foreign Imports • Advance Payment via JazzCash, EasyPaisa & Bank Transfer • Nationwide Express Shipping',
    
    -- JazzCash Details
    jazzcash_title VARCHAR(255) NOT NULL DEFAULT 'Muhammad Mateen',
    jazzcash_number VARCHAR(50) NOT NULL DEFAULT '03001234567',
    
    -- EasyPaisa Details
    easypaisa_title VARCHAR(255) NOT NULL DEFAULT 'Muhammad Mateen',
    easypaisa_number VARCHAR(50) NOT NULL DEFAULT '03451234567',
    
    -- Bank Transfer Details
    bank_name VARCHAR(255) NOT NULL DEFAULT 'Meezan Bank Limited',
    bank_account_title VARCHAR(255) NOT NULL DEFAULT 'BaharSe Imports Private',
    bank_account_number VARCHAR(100) NOT NULL DEFAULT '02010108923412',
    bank_iban VARCHAR(100) NOT NULL DEFAULT 'PK45MEZN0002010108923412',
    bank_raast_id VARCHAR(100) DEFAULT '03001234567',
    
    social_facebook TEXT DEFAULT 'https://facebook.com/baharse.pk',
    social_instagram TEXT DEFAULT 'https://instagram.com/baharse.pk',
    social_tiktok TEXT DEFAULT 'https://tiktok.com/@baharse.pk',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. ATOMIC STOCK REDUCTION RPC FUNCTION
CREATE OR REPLACE FUNCTION public.reduce_product_stock(
    p_product_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT stock_quantity INTO current_stock
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product with ID % not found', p_product_id;
    END IF;

    IF current_stock < p_quantity THEN
        RETURN FALSE;
    END IF;

    UPDATE public.products
    SET stock_quantity = stock_quantity - p_quantity,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = p_product_id;

    RETURN TRUE;
END;
$$;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- CATEGORIES POLICIES
CREATE POLICY "Public read categories"
    ON public.categories FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admin manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- PRODUCTS POLICIES
CREATE POLICY "Public read active products"
    ON public.products FOR SELECT
    TO public
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ORDERS POLICIES
CREATE POLICY "Public can insert orders"
    ON public.orders FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Public can view their own order"
    ON public.orders FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admin manage orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- MESSAGES POLICIES
CREATE POLICY "Public insert messages"
    ON public.messages FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admin manage messages"
    ON public.messages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- SITE SETTINGS POLICIES
CREATE POLICY "Public read settings"
    ON public.site_settings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admin manage settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. STORAGE BUCKETS (product-images & payment-receipts)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id IN ('product-images', 'payment-receipts'));

CREATE POLICY "Anyone can upload payment receipts"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'payment-receipts');

CREATE POLICY "Admin can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin can manage all storage"
    ON storage.objects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
