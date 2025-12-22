"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons, EmailFormToggle, saveLastAuthMethod } from "@/components/ui/oauth-buttons";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Force browser to paint loading state before starting auth
    // This prevents the button from appearing unresponsive when auth is fast
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (error) throw error;

      saveLastAuthMethod("email");
      router.push("/signup/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="dark"
      title={
        <span className="flex items-center justify-center gap-3">
          <span>Create Account</span>
          <span className="text-slate-500">or</span>
          <Link href="/login" className="text-gold-400 hover:text-gold-300 transition-colors">
            Sign In
          </Link>
        </span>
      }
      subtitle="Join the community of founders preserving organizational knowledge"
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
              <Label variant="dark" htmlFor="name">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="dark"
              />
            </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                variant="dark"
              />
              <p className="text-xs text-slate-500">Minimum 6 characters</p>
            </div>

            <Button
              type="submit"
              variant="dark-primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
