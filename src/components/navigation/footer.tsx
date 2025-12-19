"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  variant?: "default" | "dark";
  columns?: FooterColumn[];
  logo?: React.ReactNode;
  tagline?: string;
  bottomLinks?: FooterLink[];
  socialLinks?: React.ReactNode;
  className?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    { variant = "default", columns = [], logo, tagline, bottomLinks = [], socialLinks, className },
    ref
  ) => {
    const currentYear = new Date().getFullYear();
    const isDark = variant === "dark";

    return (
      <footer
        ref={ref}
        className={cn(
          "w-full",
          isDark
            ? "bg-slate-900 border-t border-slate-700"
            : "bg-marble-50 border-t border-marble-300",
          className
        )}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="py-12 grid gap-8 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2">
              {logo || (
                <Link href="/" className="inline-block">
                  <span className="font-serif text-xl font-semibold tracking-wide">
                    S<span className="text-gold-500">·</span>O
                    <span className="text-gold-500">·</span>I
                    <span className="text-gold-500">·</span>L
                  </span>
                </Link>
              )}
              {tagline && (
                <p
                  className={cn(
                    "mt-4 text-sm max-w-xs",
                    isDark ? "text-slate-400" : "text-marble-600"
                  )}
                >
                  {tagline}
                </p>
              )}
              {socialLinks && <div className="mt-6">{socialLinks}</div>}
            </div>

            {/* Link columns */}
            {columns.map((column) => (
              <div key={column.title}>
                <h3
                  className={cn(
                    "text-sm font-semibold",
                    isDark ? "text-marble-100" : "text-marble-950"
                  )}
                >
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm transition-colors",
                          isDark
                            ? "text-slate-400 hover:text-marble-100"
                            : "text-marble-600 hover:text-marble-950"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className={cn(
              "py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4",
              isDark ? "border-slate-700" : "border-marble-300"
            )}
          >
            <p className={cn("text-sm", isDark ? "text-slate-500" : "text-marble-500")}>
              {currentYear} SOIL. All rights reserved.
            </p>

            {bottomLinks.length > 0 && (
              <div className="flex items-center gap-6">
                {bottomLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors",
                      isDark
                        ? "text-slate-500 hover:text-marble-100"
                        : "text-marble-500 hover:text-marble-950"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = "Footer";

export { Footer };
