import type { Metadata } from "next";
import { Cinzel, Sora, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout";
import { Providers } from "@/components/providers";
import { ConsentAwareAnalytics } from "@/components/analytics/ConsentAwareAnalytics";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";
import { siteConfig } from "@/lib/site-config";

// Sora - geometric sans-serif for headings (clean, modern)
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

// Manrope - humanist sans-serif for body text (readable, friendly)
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

// Cinzel - Roman-inspired serif for logo and decorative elements
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "SOIL - Studies of Organizational Illness and Loss",
  description:
    "Building the foundation for organizational medicine - a new scientific field that will fundamentally improve how humanity creates, maintains, and heals organizations.",
  keywords: [
    "organizational research",
    "startup failure",
    "organizational biology",
    "business research",
  ],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: "/apple-icon.png",
    other: [{ rel: "icon", url: "/favicon.ico" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "SOIL - Studies of Organizational Illness and Loss",
    images: ["/og-default.svg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-marble-50 text-marble-950 font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <CookieConsentBanner />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
