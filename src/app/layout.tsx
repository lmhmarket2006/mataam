import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مطعم الواحة | Al Wahah Restaurant - أطباق سعودية ويمنية أصيلة",
  description: "مطعم الواحة - وجهتكم الأولى للأطباق السعودية واليمنية الأصيلة. مندي، مظبي، مضغوط، مدفون وأكثر. اطلب الآن عبر واتساب!",
  keywords: ["مطعم", "سعودي", "يمني", "مندي", "مظبي", "مضغوط", "مدفون", "واجهة", "رياض", "جدة", "الدمام", "مطاعم"],
  authors: [{ name: "Al Wahah Restaurant" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "مطعم الواحة | Al Wahah Restaurant",
    description: "أطباق سعودية ويمنية أصيلة",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#6B4226",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
