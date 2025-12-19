"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeaderProps {
  variant?: "default" | "dark";
  logo?: React.ReactNode;
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ variant = "default", logo, navItems = [], rightContent, sticky = true, className }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const isDark = variant === "dark";

    return (
      <header
        ref={ref}
        className={cn(
          "w-full z-40",
          sticky && "sticky top-0",
          isDark
            ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-700"
            : "bg-white/95 backdrop-blur-md border-b border-marble-300",
          className
        )}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {logo || (
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-serif text-xl font-semibold tracking-wide">
                    S<span className="text-gold-500">·</span>O
                    <span className="text-gold-500">·</span>I
                    <span className="text-gold-500">·</span>L
                  </span>
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavItemComponent key={item.href} item={item} variant={variant} />
              ))}
            </nav>

            {/* Right content (auth buttons, etc.) */}
            <div className="hidden md:flex items-center gap-3">{rightContent}</div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant={isDark ? "dark-ghost" : "ghost"}
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className={cn(
              "md:hidden border-t",
              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-marble-300"
            )}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  variant={variant}
                  onClose={() => setMobileMenuOpen(false)}
                />
              ))}
              {rightContent && (
                <div
                  className={cn("pt-4 border-t", isDark ? "border-slate-700" : "border-marble-300")}
                >
                  {rightContent}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
);
Header.displayName = "Header";

// Desktop nav item
const NavItemComponent: React.FC<{
  item: NavItem;
  variant: "default" | "dark";
}> = ({ item, variant }) => {
  const [open, setOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isDark = variant === "dark";

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={cn(
          "px-3 py-2 rounded-sm text-sm font-medium transition-colors",
          isDark
            ? "text-marble-200 hover:text-marble-100 hover:bg-slate-800"
            : "text-marble-700 hover:text-marble-950 hover:bg-gold-50"
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-sm text-sm font-medium transition-colors",
          isDark
            ? "text-marble-200 hover:text-marble-100 hover:bg-slate-800"
            : "text-marble-700 hover:text-marble-950 hover:bg-gold-50"
        )}
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 w-48 rounded-sm shadow-lg py-1 z-50",
            isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-marble-300"
          )}
          onMouseEnter={() => setOpen(true)}
        >
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-4 py-2 text-sm transition-colors",
                isDark
                  ? "text-marble-200 hover:bg-slate-700 hover:text-marble-100"
                  : "text-marble-700 hover:bg-gold-50 hover:text-marble-950"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile nav item
const MobileNavItem: React.FC<{
  item: NavItem;
  variant: "default" | "dark";
  onClose: () => void;
}> = ({ item, variant, onClose }) => {
  const [open, setOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isDark = variant === "dark";

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "block px-3 py-2 rounded-sm text-base font-medium transition-colors",
          isDark ? "text-marble-200 hover:bg-slate-800" : "text-marble-700 hover:bg-gold-50"
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-sm text-base font-medium transition-colors",
          isDark ? "text-marble-200 hover:bg-slate-800" : "text-marble-700 hover:bg-gold-50"
        )}
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="pl-4 mt-1 space-y-1">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className={cn(
                "block px-3 py-2 rounded-sm text-sm transition-colors",
                isDark ? "text-slate-400 hover:bg-slate-800" : "text-marble-600 hover:bg-gold-50"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export { Header };
