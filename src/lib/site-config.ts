/**
 * Centralized site configuration
 * All URLs and emails should be referenced from here, never hardcoded.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://soilplatform.org";
const emailDomain = process.env.NEXT_PUBLIC_EMAIL_DOMAIN || "soilplatform.org";

export const siteConfig = {
  /** Main website URL (no trailing slash) */
  url: siteUrl,

  /** Email domain for all @domain.org addresses */
  emailDomain,

  /** Email addresses for different departments */
  emails: {
    careers: `careers@${emailDomain}`,
    community: `community@${emailDomain}`,
    research: `research@${emailDomain}`,
    privacy: `privacy@${emailDomain}`,
    hello: `hello@${emailDomain}`,
    donate: `donate@${emailDomain}`,
    sponsors: `sponsors@${emailDomain}`,
    investors: `investors@${emailDomain}`,
    legal: `legal@${emailDomain}`,
    support: `support@${emailDomain}`,
    methodology: `methodology@${emailDomain}`,
    partnerships: `partnerships@${emailDomain}`,
  },

  /** User-Agent string for API requests */
  userAgent: `SOIL Research Platform (research@${emailDomain})`,
} as const;

/** Helper to generate mailto: link with optional subject */
export function mailtoLink(email: keyof typeof siteConfig.emails, subject?: string): string {
  const address = siteConfig.emails[email];
  if (subject) {
    return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
  }
  return `mailto:${address}`;
}

/** Helper to generate full URL path */
export function buildSiteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}
