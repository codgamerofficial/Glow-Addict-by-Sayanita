import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/shared/Toast";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { GlowAIButton } from "@/components/shared/GlowAIButton";
import { FreebiesPopup } from "@/components/shared/FreebiesPopup";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://glowaddictbysayanita.vercel.app'),
  title: "Glow Addict by Sayanita | Luxury AI Beauty Experience",
  description: "Experience the future of luxury beauty with Glow Addict. AI-powered personalized skincare, makeup, and hair care recommendations for a radiant, luxurious glow.",
  keywords: "luxury beauty, premium skincare, high-end makeup, AI beauty, personalized luxury, Glow Addict, Sayanita, luxury beauty india, bespoke beauty, elite skincare",
  authors: [{ name: "Sayanita" }],
  openGraph: {
    title: "Glow Addict by Sayanita",
    description: "Indulge in AI-powered luxury beauty. Personalized recommendations for flawless, radiant skin.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://glowaddict.com",
    siteName: "Glow Addict",
    locale: "en_IN",
    type: "website",
    images: [{
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://glowaddict.com'}/opengraph-image.png`,
      width: 1200,
      height: 630,
      alt: "Glow Addict Luxury AI Beauty"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Addict by Sayanita",
    description: "India's most luxurious AI beauty destination. Personalized skincare & makeup for elite glamour.",
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-body: "Inter";
            --font-display: "Outfit";
            --font-editorial: "Playfair Display";
            --glassmorphism-bg: rgba(255, 255, 255, 0.1);
            --glassmorphism-border: rgba(255, 255, 255, 0.2);
            --glassmorphism-blur: blur(10px);
            --luxury-gradient: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            --luxury-gradient-secondary: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%);
            --luxury-color: #ffd700;
            --luxury-color-dark: #b8860b;
            --luxury-color-light: #fff8e1;
            --luxury-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            --animation-duration: 0.5s;
            --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
            --animation-duration-slow: 0.8s;
            --transition-default: all 0.3s var(--animation-easing);
          }
        `}</style>
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <LenisProvider>{children}</LenisProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
        <GlowAIButton />
        <FreebiesPopup />
      </body>
    </html>
  );
}