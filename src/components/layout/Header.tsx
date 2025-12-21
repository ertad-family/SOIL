"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/research", label: "Research" },
  { href: "/cenotaphery", label: "Cenotaphery" },
  { href: "/community", label: "Community" },
];

export function Header() {
  const { openMenu } = useMenu();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
      <div className="max-w-content mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-wider !text-marble-100 hover:!text-marble-100"
          >
            S<span className="text-gold-400">&middot;</span>O
            <span className="text-gold-400">&middot;</span>I
            <span className="text-gold-400">&middot;</span>L
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive ? "!text-gold-400" : "!text-slate-400 hover:!text-marble-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  className={`p-2 rounded-sm transition-colors ${
                    pathname === "/account" ? "text-gold-400" : "text-slate-400 hover:text-gold-400"
                  }`}
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-sm text-slate-400 hover:text-gold-400 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Button variant="dark-ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
            <Button variant="dark-secondary" size="sm" onClick={openMenu}>
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
