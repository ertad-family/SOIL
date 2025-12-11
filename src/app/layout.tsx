import type { Metadata } from 'next'
import { Cinzel, Source_Sans_3, Outfit } from 'next/font/google'
import './globals.css'

// Roman-inspired serif for headings - used sparingly for maximum impact
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

// Modern readable sans-serif for body text
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-source-sans',
  display: 'swap',
})

// Modern geometric sans for UI elements - creates tension with classical serif
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SOIL - Social Organizational Intelligence Lab',
  description: 'Building the foundation for organizational medicine — a new scientific field that will fundamentally improve how humanity creates, maintains, and heals organizations.',
  keywords: ['organizational research', 'startup failure', 'organizational biology', 'business research'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${sourceSans.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-marble-50 text-marble-950 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
