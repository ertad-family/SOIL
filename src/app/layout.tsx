import type { Metadata } from "next";
import { Cinzel, Sora, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout";
import { Providers } from "@/components/providers";
import { ConsentAwareAnalytics } from "@/components/analytics/ConsentAwareAnalytics";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";

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
  metadataBase: new URL("https://soil.rip"),
  title: "SOIL - Social Organizational Intelligence Lab",
  description:
    "Building the foundation for organizational medicine - a new scientific field that will fundamentally improve how humanity creates, maintains, and heals organizations.",
  keywords: [
    "organizational research",
    "startup failure",
    "organizational biology",
    "business research",
  ],
  openGraph: {
    type: "website",
    siteName: "SOIL - Social Organizational Intelligence Lab",
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
