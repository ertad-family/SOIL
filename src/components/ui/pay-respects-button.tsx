"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { Heart, Check, Loader2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface PayRespectsButtonProps {
  memorialId: string;
  isOwnCenotaph?: boolean;
  className?: string;
}

type ButtonState = "idle" | "loading" | "paid" | "own" | "error";

/**
 * Pay Respects Button - matches ShareButton styling exactly
 * Uses marble variant with md size from design system
 */
export function PayRespectsButton({
  memorialId,
  isOwnCenotaph = false,
  className,
}: PayRespectsButtonProps) {
  const [state, setState] = useState<ButtonState>(isOwnCenotaph ? "own" : "idle");

  // Check initial status on mount
  useEffect(() => {
    if (isOwnCenotaph) {
      setState("own");
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/respects/status?memorialId=${memorialId}`);
        const data = await response.json();

        if (data.isOwnCenotaph) {
          setState("own");
        } else if (data.hasPaid) {
          setState("paid");
        }
      } catch (error) {
        console.error("Failed to check respects status:", error);
      }
    };

    checkStatus();
  }, [memorialId, isOwnCenotaph]);

  const handlePayRespects = async () => {
    if (state !== "idle") return;

    setState("loading");

    try {
      const response = await fetch("/api/respects/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId }),
      });

      const data = await response.json();

      if (data.success) {
        setState("paid");
        // Track respects paid event
        trackEvent("respects_paid", {
          category: "engagement",
          properties: { memorialId },
        });
      } else if (data.isOwnCenotaph) {
        setState("own");
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 2000);
      }
    } catch (error) {
      console.error("Failed to pay respects:", error);
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const getText = () => {
    switch (state) {
      case "loading":
        return "Paying";
      case "paid":
        return "Paid";
      case "own":
        return "Your Cenotaph";
      case "error":
        return "Try Again";
      default:
        return "Pay Respects";
    }
  };

  const getIcon = () => {
    switch (state) {
      case "loading":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "paid":
        return <Check className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const isDisabled = state === "loading" || state === "paid" || state === "own";

  return (
    <button
      onClick={handlePayRespects}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant: "marble", size: "md" }),
        "transition-all duration-300",
        state === "paid" && "opacity-80",
        state === "own" && "opacity-50 cursor-not-allowed",
        isDisabled && "pointer-events-none",
        className
      )}
      title={
        state === "own"
          ? "You cannot pay respects to your own cenotaph"
          : state === "paid"
            ? "Thank you for paying respects"
            : "Show your appreciation"
      }
    >
      {/* Content - matches ShareButton typography exactly */}
      <span className="flex items-center justify-center gap-3 font-serif font-semibold tracking-[0.2em] uppercase text-xs">
        {getText()}
        {getIcon()}
      </span>
    </button>
  );
}

interface RespectsCounterProps {
  memorialId: string;
  initialCount: number;
  className?: string;
}

/**
 * Respects counter display - heart icon with count
 * Placed in metadata section alongside location, team size, etc.
 * Always shows, even when count is 0
 * Uses Supabase realtime subscriptions for live updates
 */
export function RespectsCounter({ memorialId, initialCount, className }: RespectsCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [showPulse, setShowPulse] = useState(false);
  const supabaseRef = useRef(createBrowserClient());

  // Subscribe to realtime updates on respects table
  useEffect(() => {
    const supabase = supabaseRef.current;

    // Subscribe to INSERT events on respects table for this memorial
    const channel = supabase
      .channel(`respects:${memorialId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "respects",
          filter: `memorial_id=eq.${memorialId}`,
        },
        (payload) => {
          // A new respect was added - increment count with animation
          const amount = payload.new.amount || 1;
          setCount((prev) => prev + amount);
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 1000);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [memorialId]);

  return (
    <div className={cn("flex items-center gap-3 text-slate-400", className)}>
      <Heart
        className={cn(
          "w-4 h-4 text-slate-500 transition-all duration-300",
          showPulse && "text-gold-400 scale-125"
        )}
        fill={showPulse ? "currentColor" : "none"}
      />
      <span className={cn("transition-all duration-300", showPulse && "text-gold-300 font-medium")}>
        {count.toLocaleString()}
      </span>
    </div>
  );
}
