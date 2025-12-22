"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons, EmailFormToggle, saveLastAuthMethod } from "@/components/ui/oauth-buttons";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Check for OAuth error from callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      saveLastAuthMethod("email");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="dark"
      title={
        <span className="flex items-center justify-center gap-3">
          <span>Sign In</span>
          <span className="text-slate-500">or</span>
          <Link href="/signup" className="text-gold-400 hover:text-gold-300 transition-colors">
            Create Account
          </Link>
        </span>
      }
      subtitle="Sign in to manage your organizations, stories and cenotaphs"
      showLogo={false}
      backLink={{ href: "/", label: "Back to Home" }}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-error-400 bg-error-500/10 rounded-md border border-error-500/20">
            {error}
          </div>
        )}

        <OAuthButtons />

        <EmailFormToggle
          isExpanded={showEmailForm}
          onToggle={() => setShowEmailForm(!showEmailForm)}
        />

        {showEmailForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="space-y-2">
              <Label variant="dark" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="founder@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="dark"
              />
            </div>

            <div className="space-y-2">
              <Label variant="dark" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="dark"
              />
            </div>

            <Button
              type="submit"
              variant="dark-primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
