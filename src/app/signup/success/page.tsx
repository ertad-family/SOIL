"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";

export default function SignupSuccessPage() {
  return (
    <AuthLayout
      variant="dark"
      title="Check Your Email"
      subtitle="We've sent you a confirmation link"
      backLink={{ href: "/", label: "Back to Home" }}
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-success-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success-400" />
        </div>

        <div className="space-y-2">
          <p className="text-slate-300">We&apos;ve sent a confirmation email to your inbox.</p>
          <p className="text-slate-400 text-sm">
            Click the link in the email to verify your account and start creating cenotaphs.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button variant="dark-secondary" size="lg" className="w-full" asChild>
            <Link href="/login">
              <Mail className="w-4 h-4 mr-2" />
              Go to Sign In
            </Link>
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
