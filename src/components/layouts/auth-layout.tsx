"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AuthLayoutProps {
  variant?: "default" | "dark";
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  showLogo?: boolean;
  backLink?: {
    href: string;
    label: string;
  };
  footer?: React.ReactNode;
  className?: string;
}

const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  (
    {
      variant = "default",
      children,
      title,
      subtitle,
      showLogo = true,
      backLink,
      footer,
      className,
    },
    ref
  ) => {
    const isDark = variant === "dark";

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen flex flex-col items-center justify-center px-4 py-12",
          isDark ? "bg-slate-gradient" : "bg-marble-gradient",
          className
        )}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            {showLogo && (
              <Link href="/" className="inline-block mb-6">
                <span className="font-serif text-3xl font-semibold tracking-wide">
                  S<span className="text-gold-500">·</span>O<span className="text-gold-500">·</span>
                  I<span className="text-gold-500">·</span>L
                </span>
              </Link>
            )}

            {title && (
              <h1
                className={cn(
                  "font-serif text-2xl font-semibold tracking-wide",
                  isDark ? "text-marble-100" : "text-marble-950"
                )}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-marble-600")}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Content (form) */}
          <div
            className={cn(
              "rounded-xl p-6",
              isDark
                ? "bg-slate-800 border border-slate-700 shadow-dark-lg"
                : "bg-white border border-marble-300 shadow-md"
            )}
          >
            {children}
          </div>

          {/* Footer */}
          {(backLink || footer) && (
            <div className="text-center space-y-4">
              {backLink && (
                <Link href={backLink.href}>
                  <Button variant="dark-ghost" size="sm">
                    ← {backLink.label}
                  </Button>
                </Link>
              )}
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);
AuthLayout.displayName = "AuthLayout";

export { AuthLayout };
