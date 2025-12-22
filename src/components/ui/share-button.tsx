"use client";

import { useState, useCallback } from "react";
import { Linkedin, Link2, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { trackShareEvent } from "@/lib/analytics";

interface ShareButtonProps {
  /** The URL to share */
  url: string;
  /** Title for the share (used in share text) */
  title: string;
  /** Optional description for platforms that support it */
  description?: string;
  /** Optional className for the container */
  className?: string;
  /** Optional memorial ID for tracking */
  memorialId?: string;
  /** Optional organization ID for tracking */
  organizationId?: string;
}

/** Custom X (formerly Twitter) icon - Lucide doesn't include brand icons */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface SharePlatform {
  name: string;
  icon: React.ReactNode;
  getShareUrl: (url: string, title: string, description?: string) => string;
  hoverColor: string;
}

const SHARE_PLATFORMS: SharePlatform[] = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    getShareUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    hoverColor: "hover:text-[#0A66C2]",
  },
  {
    name: "X",
    icon: <XIcon className="w-4 h-4" />,
    getShareUrl: (url, title, description) => {
      const text = description ? `${title} - ${description}` : title;
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    },
    hoverColor: "hover:text-white",
  },
];

/**
 * Generate a share token and return URL with ref parameter
 */
async function generateShareUrl(
  baseUrl: string,
  platform: string,
  memorialId?: string
): Promise<string> {
  try {
    const response = await fetch("/api/share/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memorialId, platform }),
    });
    const data = await response.json();

    if (data.success && data.token) {
      // Append ref parameter to URL
      const urlObj = new URL(baseUrl);
      urlObj.searchParams.set("ref", data.token);
      return urlObj.toString();
    }
  } catch (err) {
    console.error("[Share] Failed to generate token:", err);
  }

  // Fallback to original URL if token generation fails
  return baseUrl;
}

/**
 * Animated Share Button with CSS reveal effect
 *
 * On hover, the "Share" text slides left and social icons cascade in from the right.
 * Uses dark-outline design system styling.
 */
export function ShareButton({
  url,
  title,
  description,
  className,
  memorialId,
  organizationId,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const shareUrl = await generateShareUrl(url, "copy", memorialId);
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);

        // Track the share event
        trackShareEvent("share_link_created", {
          platform: "copy",
          memorialId,
          organizationId,
        });

        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },
    [url, memorialId, organizationId]
  );

  const handlePlatformShare = useCallback(
    async (e: React.MouseEvent, platform: SharePlatform) => {
      e.stopPropagation();

      // Generate token-based URL
      const shareUrl = await generateShareUrl(url, platform.name.toLowerCase(), memorialId);
      const platformShareUrl = platform.getShareUrl(shareUrl, title, description);

      // Track the share event
      trackShareEvent("share_link_created", {
        platform: platform.name.toLowerCase(),
        memorialId,
        organizationId,
      });

      window.open(platformShareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    },
    [url, title, description, memorialId, organizationId]
  );

  return (
    <div
      className={cn(buttonVariants({ variant: "marble", size: "md" }), "group/share", className)}
    >
      {/* Share text layer - slides left on hover */}
      <span
        className={cn(
          "absolute z-10 flex items-center justify-center gap-3",
          "w-full h-full",
          // Match marble button typography exactly: font-serif font-semibold tracking-[0.2em] uppercase text-xs
          "font-serif font-semibold tracking-[0.2em] uppercase text-xs",
          // Inherit text color from parent (changes on hover)
          "bg-transparent",
          // Fast animation
          "transition-transform duration-300 ease-out",
          "group-hover/share:-translate-x-full"
        )}
      >
        Share
        <Share2 className="w-4 h-4" />
      </span>

      {/* Invisible placeholder for dimensions - matches button content */}
      <span className="invisible flex items-center gap-3 font-serif font-semibold tracking-[0.2em] uppercase text-xs">
        Share
        <Share2 className="w-4 h-4" />
      </span>

      {/* Icons container - absolute so it doesn't affect height */}
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-[3px]",
            "hover:opacity-70",
            "transition-all duration-150",
            "opacity-0 scale-75",
            "group-hover/share:opacity-100 group-hover/share:scale-100",
            "group-hover/share:delay-[150ms]"
          )}
          title="Copy link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Link2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Social platforms */}
        {SHARE_PLATFORMS.map((platform, index) => (
          <button
            key={platform.name}
            onClick={(e) => handlePlatformShare(e, platform)}
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-[3px]",
              "hover:opacity-70",
              "transition-all duration-150",
              "opacity-0 scale-75",
              "group-hover/share:opacity-100 group-hover/share:scale-100"
            )}
            style={{
              transitionDelay: `${100 - index * 50}ms`,
            }}
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact share button variant for smaller spaces
 * Shows just an icon that expands to show platforms
 */
export function ShareButtonCompact({
  url,
  title,
  description,
  className,
  memorialId,
  organizationId,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      const shareUrl = await generateShareUrl(url, "copy", memorialId);
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      // Track the share event
      trackShareEvent("share_link_created", {
        platform: "copy",
        memorialId,
        organizationId,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [url, memorialId, organizationId]);

  const handlePlatformShare = useCallback(
    async (platform: SharePlatform) => {
      // Generate token-based URL
      const shareUrl = await generateShareUrl(url, platform.name.toLowerCase(), memorialId);
      const platformShareUrl = platform.getShareUrl(shareUrl, title, description);

      // Track the share event
      trackShareEvent("share_link_created", {
        platform: platform.name.toLowerCase(),
        memorialId,
        organizationId,
      });

      window.open(platformShareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    },
    [url, title, description, memorialId, organizationId]
  );

  return (
    <div
      className={cn("relative inline-flex items-center gap-1", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main share button - dark-outline style */}
      <button
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-[3px]",
          "bg-transparent text-[#f2efe9]",
          "border-2 border-[#d4cfc5]",
          "hover:bg-[#f2efe9] hover:text-[#2d2a26] hover:border-[#f2efe9]",
          "transition-all duration-150"
        )}
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* Expandable platform buttons */}
      <div
        className={cn(
          "flex items-center gap-1 overflow-hidden transition-all duration-200",
          isOpen ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"
        )}
      >
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-[3px]",
            "bg-transparent text-[#f2efe9]",
            "border-2 border-[#d4cfc5]",
            "hover:bg-[#f2efe9] hover:text-[#2d2a26] hover:border-[#f2efe9]",
            "transition-all duration-150"
          )}
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
        </button>

        {SHARE_PLATFORMS.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handlePlatformShare(platform)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-[3px]",
              "bg-transparent text-[#f2efe9]",
              "border-2 border-[#d4cfc5]",
              "hover:bg-[#f2efe9] hover:text-[#2d2a26] hover:border-[#f2efe9]",
              "transition-all duration-150"
            )}
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
