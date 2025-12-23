"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { FooterLandscape } from "@/components/three/FooterLandscape";
import { openCookiePreferences } from "@/components/ui/cookie-consent-banner";
import { useIsMobile } from "@/lib/utils";

// Throttle interval for scroll updates (ms) - reduces GPU load (#200)
const SCROLL_THROTTLE_MS = 100;

// Primary navigation - main site sections
const PRIMARY_LINKS = [
  { href: "/research", label: "Research" },
  { href: "/cenotaphery", label: "Cenotaphery" },
  { href: "/community", label: "Community" },
  { href: "/education", label: "Learning Hub" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/clinic", label: "Clinic" },
];

// Secondary navigation - informational pages
const SECONDARY_LINKS = [
  { href: "/about", label: "About the Project" },
  { href: "/research", label: "For Researchers" },
  { href: "#", label: "For Investors", disabled: true },
  { href: "#", label: "For Patrons", disabled: true },
  { href: "#", label: "For Media", disabled: true },
  { href: "#", label: "Careers", disabled: true },
];

// Service navigation - utility pages
const SERVICE_LINKS = [
  { href: "/account", label: "Account" },
  { href: "#", label: "Search", disabled: true },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "#", label: "Cookie Preferences", onClick: openCookiePreferences },
];

// Connect section - contacts & social media (horizontal layout)
const CONNECT_LINKS = [
  { href: "#", label: "Contacts", disabled: true },
  { href: "#", label: "LinkedIn", disabled: true },
  { href: "#", label: "GitHub", disabled: true },
];

interface FooterLinkProps {
  href: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

function FooterLink({ href, label, disabled, onClick }: FooterLinkProps) {
  if (disabled) {
    return <span className="text-slate-500 text-sm cursor-not-allowed">{label}</span>;
  }

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="!text-marble-400 hover:!text-gold-400 text-sm transition-colors text-left"
      >
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className="!text-marble-400 hover:!text-gold-400 text-sm transition-colors">
      {label}
    </Link>
  );
}

interface FooterSectionProps {
  title: string;
  links: FooterLinkProps[];
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-marble-300">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    let lastScrollTime = 0;
    let rafId: number | null = null;

    const updateScrollProgress = () => {
      if (!footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const footerHeight = rect.height;

      // Calculate how much of footer is scrolled
      // When footer top is at viewport bottom: progress = 0
      // When footer bottom is at viewport bottom: progress = 1
      const footerVisibleTop = viewportHeight - rect.top;
      const scrollableDistance = footerHeight;

      const progress = Math.max(0, Math.min(1, footerVisibleTop / scrollableDistance));
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      const now = Date.now();
      // Throttle scroll updates to reduce GPU load (#200)
      if (now - lastScrollTime < SCROLL_THROTTLE_MS) return;
      lastScrollTime = now;

      // Use RAF to batch with next frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollProgress);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-marble-950 relative">
      {/* Wireframe landscape background - disabled on mobile for performance (#109) */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          <Suspense fallback={null}>
            <FooterLandscape className="w-full h-full" scrollProgress={scrollProgress} />
          </Suspense>
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 max-w-content mx-auto px-6 pt-16 pb-16">
        {/* Main navigation grid - two columns on mobile, four on desktop (#109) */}
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-6 lg:gap-6">
          {/* Logo & description - full width on mobile */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <Link
              href="/"
              className="font-serif text-2xl font-semibold tracking-wider !text-marble-100 hover:!text-marble-100"
            >
              S<span className="text-gold-400">&middot;</span>O
              <span className="text-gold-400">&middot;</span>I
              <span className="text-gold-400">&middot;</span>L
            </Link>
            <p className="font-ui text-xs uppercase tracking-widest text-marble-500">
              Social Organizational Intelligence Lab
            </p>
            <p className="text-sm text-marble-500 leading-relaxed mt-2">
              Autopsy of organizations. Learning from corporate death to build healthier futures.
            </p>
            <p className="text-xs text-marble-600 mt-auto pt-4">
              &copy; MMXXV SOIL. All rights reserved.
            </p>
          </div>

          {/* Primary Menu */}
          <FooterSection title="Navigate" links={PRIMARY_LINKS} />

          {/* Secondary Menu */}
          <FooterSection title="Information" links={SECONDARY_LINKS} />

          {/* Service Menu & Social */}
          <div className="flex flex-col gap-8">
            <FooterSection title="Service" links={SERVICE_LINKS} />

            {/* Connect links - horizontal */}
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-marble-300">
                Connect
              </h4>
              <div className="flex flex-wrap gap-4">
                {CONNECT_LINKS.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
