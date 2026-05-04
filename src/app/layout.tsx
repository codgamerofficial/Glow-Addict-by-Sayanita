import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/shared/Toast";

export const metadata: Metadata = {
  title: "Glow Addict by Sayanita — AI-Powered Beauty Shopping",
  description: "India's most advanced AI-powered beauty e-commerce platform. Skincare, Makeup, Hair Care — personalized for you.",
  keywords: "beauty, skincare, makeup, AI beauty, Glow Addict, Sayanita, Nykaa alternative",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Glow Addict by Sayanita",
    description: "India's smartest beauty destination. AI-powered skincare & makeup recommendations.",
    images: ["/images/logo.png"],
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
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
