/**
 * Token generation utilities for link tracking
 * Part of issue #168: Internal analytics dashboard
 */

import { randomBytes } from "crypto";

export type TokenType = "share" | "verify" | "invite" | "email";

const TOKEN_PREFIXES: Record<TokenType, string> = {
  share: "sh",
  verify: "vf",
  invite: "inv",
  email: "em",
};

/**
 * Generate a short, URL-safe token with type prefix
 * Format: {prefix}_{randomId}
 * Example: sh_a1b2c3d4e5
 */
export function generateToken(type: TokenType): string {
  const prefix = TOKEN_PREFIXES[type];
  // Generate 8 random bytes = 16 hex chars, take first 10 for readability
  const randomPart = randomBytes(8).toString("hex").slice(0, 10);
  return `${prefix}_${randomPart}`;
}

/**
 * Parse a token to extract its type
 * Returns null if token format is invalid
 */
export function parseTokenType(token: string): TokenType | null {
  if (!token || !token.includes("_")) {
    return null;
  }

  const prefix = token.split("_")[0];
  const entry = Object.entries(TOKEN_PREFIXES).find(([, value]) => value === prefix);

  return entry ? (entry[0] as TokenType) : null;
}

/**
 * Validate token format
 */
export function isValidToken(token: string): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split("_");
  if (parts.length !== 2) {
    return false;
  }

  const [prefix, id] = parts;
  const validPrefixes = Object.values(TOKEN_PREFIXES);

  return validPrefixes.includes(prefix) && id.length >= 8;
}
