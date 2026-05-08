import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/shared/Toast";

export const metadata: Metadata = {
  title: "Glow Addict by Sayanita | AI-Powered Beauty & Personalization",
  description: "Discover India's premier AI-powered beauty destination. Shop 10,000+ skincare, makeup, and hair care products with expert AI recommendations tailored to your unique skin profile.",
  keywords: "beauty, skincare, makeup, hair care, AI beauty assistant, personalized beauty, Glow Addict, Sayanita, premium beauty, k-beauty india",
  authors: [{ name: "Sayanita" }],
  openGraph: {
    title: "Glow Addict by Sayanita",
    description: "Your personalized AI beauty companion. Shop smart, glow brighter.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://glowaddict.com",
    siteName: "Glow Addict",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Addict by Sayanita",
    description: "India's smartest beauty destination. AI-powered skincare & makeup recommendations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
