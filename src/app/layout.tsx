import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6B4226" },
    { media: "(prefers-color-scheme: dark)", color: "#6B4226" },
  ],
};

export const metadata: Metadata = {
  title: "مطعم الواحة | Al Wahah Restaurant - أطباق سعودية ويمنية أصيلة",
  description: "مطعم الواحة - وجهتكم الأولى للأطباق السعودية واليمنية الأصيلة. مندي، مظبي، مضغوط، مدفون وأكثر. اطلب الآن عبر واتساب!",
  keywords: ["مطعم", "سعودي", "يمني", "مندي", "مظبي", "مضغوط", "مدفون", "واجهة", "رياض", "جدة", "الدمام", "مطاعم"],
  authors: [{ name: "Al Wahah Restaurant" }],
  icons: {
    icon: [
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "الواحة",
  },
  openGraph: {
    title: "مطعم الواحة | Al Wahah Restaurant",
    description: "أطباق سعودية ويمنية أصيلة",
    type: "website",
    locale: "ar_SA",
    siteName: "مطعم الواحة",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "الواحة",
    "application-name": "الواحة",
    "msapplication-TileColor": "#6B4226",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-icon" href="/images/icon-512.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/images/icon-192.png" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        {children}
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
