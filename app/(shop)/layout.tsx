import React from "react";
import { Navbar } from "@/components/shop/navbar";
import { Footer } from "@/components/shop/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { FloatingOrderTracker } from "@/components/shop/floating-tracker";
import { getSiteSettings } from "@/lib/supabase/data-service";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <FloatingOrderTracker />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
