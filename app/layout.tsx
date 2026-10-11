import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BaharSe Foreign Imports | 100% Genuine Handpicked Foreign Products in Pakistan",
    template: "%s | BaharSe Foreign Imports",
  },
  description:
    "Buy 100% authentic imported perfumes, royal saffron, foreign OTC health supplements, Turkish ladies suits, and imported gents pants. Advance payment via JazzCash, EasyPaisa, and Bank Transfer with nationwide express delivery across Pakistan.",
  keywords: [
    "baharse foreign imports",
    "imported products pakistan",
    "original perfumes pakistan",
    "royal saffron lahore",
    "imported medicines karachi",
    "turkish ladies suits islamabad",
    "advance payment shopping pakistan",
    "jazzcash easypaisa online shopping",
  ],
  authors: [{ name: "BaharSe Foreign Imports" }],
  creator: "BaharSe Foreign Imports",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://baharse.pk",
    title: "BaharSe Foreign Imports - 100% Genuine Imported Products in Pakistan",
    description: "Personally sourced brand-new imports from Dubai, Turkey, UK & USA. Advance payment verified with express courier delivery.",
    siteName: "BaharSe Foreign Imports",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaharSe Foreign Imports Pakistan",
    description: "Authentic perfumes, saffron, suits, supplements with verified advance payment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans flex flex-col bg-slate-50 text-navy-950" suppressHydrationWarning>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
