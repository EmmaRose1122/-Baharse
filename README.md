# BaharSe Foreign Imports (BaharSe PK) • باہر سے امپورٹس

A full-stack, production-grade luxury e-commerce platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL & Storage)**. Designed for an authentic foreign imported goods boutique business in Pakistan offering genuine brand-new items personally handpicked by the owner during foreign travels (Dubai, Turkey, UK, USA, Thailand), operating on **Strict Advance Payment** (JazzCash, EasyPaisa, Bank Transfer) with **Live On-Site Order Tracking** and an **Integrated AI Chat Bot (Powered by Google Gemini & xAI Grok)**.

---

## 🌟 Key Features

### 🛒 Customer-Facing Store
- **Hero & Brand Aesthetics:** High-aesthetic luxury styling in deep navy (`#0b1d30`) + gold (`#d49a16`) accents, highlighting 100% genuine imports personally handpicked on overseas journeys, with fast 2–4 days nationwide delivery via TCS/Leopards.
- **5 Core Foreign Product Categories:**
  1. **Kitchen Spices (*Masalay*):** Royal Super Negin Saffron, Jumbo Cardamoms, Kashmiri Shahi Zeera.
  2. **Perfumes & Attars:** 100% original factory sealed bottles from *Lattafa Khamrah, Armaf Club De Nuit, Afnan 9 PM, Royal Dehn Al Oud*.
  3. **Medicines & Health Supplements:** *Kirkland Signature Glucosamine with MSM, Nature Made Omega-3 Fish Oil, Seven Seas JointCare Max, Tiger Balm Extra Strength*. Includes mandatory medical consult disclaimer.
  4. **Ladies Suits & Luxury Pret:** Turkish embroidered silk suits, Dubai Korean Nida abayas, Kashmiri hand-woven pashminas.
  5. **Gents Pants & Trousers:** 4-way stretch chinos, European formal dress trousers, Japanese high-density cotton cargo pants.
- **Interactive Cart & Drawer:** Slide-out drawer powered by Zustand with persistent local storage and dynamic **Free Delivery Progress Meter** (*"Add Rs. 1,450 more for FREE Nationwide Delivery"*).
- **Strict Advance Payment Checkout:**
  - Copyable receiving details for **JazzCash**, **EasyPaisa**, and **Meezan Bank / Raast ID**.
  - Customer inputs **Transaction ID (TID / Ref #)** and sender account details.
  - Public payment receipt screenshot uploader saving directly to Supabase storage.
- **Instant Digital Invoice & On-Site Order Tracking (`/track-order`):**
  - Confetti celebration screen displaying the unique order reference (e.g. `IMP-54210`).
  - Real-time tracking screen displaying payment verification status (*Pending Verification / Verified / Rejected*), order fulfillment stages (*Pending -> Confirmed -> Shipped -> Delivered*), TID ledger, and direct staff message logs.
- **🤖 Built-in AI Sales & Support Concierge:**
  - Floating 24/7 AI Chat widget supporting both **Google Gemini** (`GEMINI_API_KEY`) and **xAI Grok** (`GROK_API_KEY`).
  - Bilingual support: fluent in **Roman Urdu**, **Urdu**, and **English**.
  - Answers product inquiries, explains prices in PKR, guides customers through JazzCash/EasyPaisa transfers, and assists with order tracking.
  - Intelligent offline domain knowledge fallback engine when API keys are not yet configured.

### 🛡️ Admin Portal (`/admin`)
- **Protected Access:** Supabase Auth session validation with middleware route guarding.
- **Executive Dashboard:** Total orders, today's orders, pending dispatch count, total revenue, low-stock watchlist, **7-day Recharts sales area chart**, and category order distribution charts.
- **Orders & Payment Verification:**
  - Filter orders by fulfillment status and advance payment status (*Pending Verification, Verified, Rejected*).
  - Inspect customer-submitted Transaction ID (TID), sender account name, and payment receipt screenshots.
  - One-click payment approval and rejection.
  - Post live customer status messages visible on the customer's `/track-order` portal.
  - Printable packing slips and one-click CSV export.
- **Products & Categories Management:** Full CRUD tables, stock updates, size variations, and image uploads to Supabase Storage.
- **Store Settings:** Live management of receiving accounts (JazzCash, EasyPaisa, Meezan Bank, IBAN, Raast ID) and delivery rates.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4 (Custom Navy & Gold luxury palette)
- **State Management:** Zustand (LocalStorage persistence)
- **Validation:** React Hook Form + Zod
- **AI Integration:** Google Gemini REST API & xAI Grok REST API
- **Visuals & Charts:** Lucide React, Recharts, Canvas Confetti
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Storage:** Supabase Storage (`product-images`, `payment-receipts`)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_SITE_NAME=BaharSe Foreign Imports
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI Chat Bot (Google Gemini or xAI Grok)
GEMINI_API_KEY=your-free-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# Optional: Grok
GROK_API_KEY=your-xai-grok-api-key
GROK_MODEL=grok-beta
AI_PROVIDER=gemini
```

> **How to get a Free Gemini API Key:**
> 1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
> 2. Click **Create API Key**.
> 3. Paste it into `GEMINI_API_KEY` in `.env.local`.

### 3. Setup Database & Seed Data
1. Open your Supabase project's **SQL Editor**.
2. Run `supabase/schema.sql` to initialize tables, storage buckets, and RLS policies.
3. Run `supabase/seed.sql` to load starter categories, products, and advance payment settings.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure
```
├── app/
│   ├── (shop)/                  # Customer storefront pages
│   │   ├── page.tsx             # Luxury homepage with trust badges & categories
│   │   ├── shop/                # Filterable product catalog
│   │   ├── product/[slug]/      # Product page with gallery & specs
│   │   ├── category/[slug]/     # Category product listing
│   │   ├── cart/                # Dedicated cart page
│   │   ├── checkout/            # Advance payment checkout (TID & receipt)
│   │   ├── order-success/       # Digital invoice & tracking link
│   │   └── track-order/         # Live verification & fulfillment tracker
│   ├── admin/                   # Admin portal
│   │   ├── page.tsx             # Executive dashboard & analytics
│   │   ├── orders/              # Orders ledger & verification review
│   │   ├── products/            # Product CRUD & image uploads
│   │   └── settings/            # JazzCash, EasyPaisa & Bank settings
│   └── api/
│       ├── chat/                # AI Chat Bot route (Gemini & Grok)
│       ├── orders/              # Order placement endpoint
│       ├── upload-receipt/      # Public customer receipt screenshot upload
│       └── admin/               # Protected management routes
├── components/
│   ├── shop/                    # Navbar, Footer, AiChatWidget, Tracker, CartDrawer
│   ├── admin/                   # AdminSidebar, OrderDetailModal, Charts
│   └── ui/                      # Reusable buttons, badges, modals
├── lib/
│   ├── supabase/                # Clients, data service, mock data
│   ├── utils.ts                 # PKR currency formatter, status helpers
│   └── validators.ts            # Zod validation schemas
└── types/                       # TypeScript interfaces
```

---

## 🔒 Payment & Security Notes
- **Zero Cash on Delivery:** Eliminates courier fraud, fake buyer cancellations, and uncollected parcels.
- **Encrypted Receipt Storage:** Customer payment screenshots are stored in Supabase Storage with authenticated URLs.
- **Admin Verification Gate:** No parcel is dispatched until the store owner reviews the Transaction ID in `/admin/orders` and flags the payment as verified.
