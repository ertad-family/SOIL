"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons, EmailFormToggle, saveLastAuthMethod } from "@/components/ui/oauth-buttons";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

        <TooltipProvider delayDuration={200}>
          <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <Checkbox
              id="terms"
              variant="dark"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm text-marble-300 leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400 hover:text-gold-300 underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  variant="dark"
                  side="bottom"
                  align="start"
                  className="max-w-md p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 text-gold-400 font-medium text-sm uppercase tracking-wide">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Terms Summary
                  </div>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Age Requirement:</strong> You must be 18
                        years or older
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Research License:</strong> Your
                        anonymized data may be used for scientific research
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">AI Processing:</strong> Google Cloud AI
                        will process your data to generate cenotaph designs
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Jurisdiction:</strong> Disputes governed
                        by Delaware law
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Service &quot;As Is&quot;:</strong> No
                        warranties on accuracy or availability
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                    Click to read the full Terms of Service
                  </p>
                </TooltipContent>
              </Tooltip>{" "}
              and{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400 hover:text-gold-300 underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  variant="dark"
                  side="bottom"
                  align="start"
                  className="max-w-md p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 text-gold-400 font-medium text-sm uppercase tracking-wide">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Privacy Summary
                  </div>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Data Collection:</strong> We collect
                        detailed organizational and personal data through interviews
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Data Usage:</strong> Your data is fully
                        anonymized — no names or information that could identify people or
                        organizations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">US Storage:</strong> Your data is stored
                        on servers in the United States
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Data Retention:</strong> Anonymized
                        patterns kept permanently, even after deletion
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Third Parties:</strong> Shared with
                        Supabase, Google Cloud, Vercel for platform operations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>
                        <strong className="text-marble-100">Your Control:</strong> You can delete
                        your data and control visibility settings
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                    Click to read the full Privacy Policy
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
          </div>
        </TooltipProvider>

        <OAuthButtons disabled={!agreedToTerms} />

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
              disabled={!agreedToTerms || isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
