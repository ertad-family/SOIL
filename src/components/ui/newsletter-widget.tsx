"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterWidgetProps {
  /** Title text above the form */
  title?: string;
  /** Placeholder text for email input */
  placeholder?: string;
  /** Button text */
  buttonText?: string;
  /** Success message after subscription */
  successMessage?: string;
  /** Message shown when already subscribed */
  alreadySubscribedMessage?: string;
  /** Variant: 'compact' for inline, 'full' for card with more content */
  variant?: "compact" | "full";
  /** Source identifier for tracking where signup originated */
  source?: string;
  /** Optional className for the wrapper */
  className?: string;
}

export function NewsletterWidget({
  title = "Stay connected with community updates",
  placeholder = "Your email",
  buttonText = "Subscribe",
  successMessage = "Thanks for subscribing!",
  alreadySubscribedMessage = "You're already subscribed!",
  variant = "compact",
  source = "unknown",
  className = "",
}: NewsletterWidgetProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "newsletter",
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setIsSubscribed(true);
      if (data.alreadySubscribed) {
        setIsAlreadySubscribed(true);
      }
    } catch {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <Card variant="dark" padding="lg" className={className}>
        <p className="text-sm text-slate-400 mb-3">{title}</p>
        {isSubscribed ? (
          <p className="text-sm text-emerald-400">
            {isAlreadySubscribed ? alreadySubscribedMessage : successMessage}
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-800/50 border-slate-700 text-marble-100 placeholder:text-slate-500 h-10"
                required
              />
              <Button type="submit" variant="marble" size="sm" disabled={isLoading}>
                {isLoading ? "..." : buttonText}
              </Button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>
        )}
      </Card>
    );
  }

  // Full variant - for footer or standalone sections
  return (
    <Card variant="dark-elevated" padding="lg" className={`max-w-md ${className}`}>
      <h3 className="font-display text-lg font-medium text-marble-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">
        Subscribe to our newsletter for community updates, event announcements, and research
        highlights.
      </p>
      {isSubscribed ? (
        <p className="text-sm text-emerald-400">
          {isAlreadySubscribed ? alreadySubscribedMessage : successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-slate-800/50 border-slate-700 text-marble-100 placeholder:text-slate-500"
              required
            />
            <Button type="submit" variant="marble" size="md" disabled={isLoading}>
              {isLoading ? "..." : buttonText}
            </Button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      )}
    </Card>
  );
}
