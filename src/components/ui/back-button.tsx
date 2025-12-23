"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  text: string;
  className?: string;
}

/**
 * Reusable back navigation button with consistent styling.
 * Uses dark-ghost variant for subtle appearance on dark backgrounds.
 */
export function BackButton({ href, text, className }: BackButtonProps) {
  return (
    <Link href={href} className={className}>
      <Button variant="dark-ghost" size="sm">
        ← {text}
      </Button>
    </Link>
  );
}
