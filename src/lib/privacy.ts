/**
 * Privacy utilities for organization name display
 *
 * When an organization is private (is_public = false), we display a
 * placeholder instead of the real name. The placeholder style can be
 * configured by the organization owner.
 */

export type PrivacyDisplayStyle =
  | "veiled"
  | "unnamed"
  | "undisclosed"
  | "silent"
  | "redacted"
  | "incognita"
  | "sub_rosa";

/**
 * Display labels for each privacy style
 */
export const PRIVACY_DISPLAY_LABELS: Record<PrivacyDisplayStyle, string> = {
  veiled: "Veiled Organization",
  unnamed: "Unnamed Organization",
  undisclosed: "Undisclosed Organization",
  silent: "Silent Organization",
  redacted: "Organization [Redacted]",
  incognita: "Incognita Organization",
  sub_rosa: "Organization Sub Rosa",
};

/**
 * Styles that should be rendered in italic (Latin phrases)
 */
export const ITALIC_STYLES: PrivacyDisplayStyle[] = ["incognita", "sub_rosa"];

/**
 * Default privacy display style
 */
export const DEFAULT_PRIVACY_STYLE: PrivacyDisplayStyle = "veiled";

/**
 * Get the display name for an organization based on privacy settings
 *
 * @param isPublic - Whether the organization is public
 * @param realName - The actual organization name
 * @param privacyStyle - The privacy display style (defaults to 'veiled')
 * @returns The name to display
 */
export function getPrivacyDisplayName(
  isPublic: boolean,
  realName: string,
  privacyStyle: PrivacyDisplayStyle | null = DEFAULT_PRIVACY_STYLE
): string {
  if (isPublic) {
    return realName;
  }

  const style = privacyStyle ?? DEFAULT_PRIVACY_STYLE;
  return PRIVACY_DISPLAY_LABELS[style];
}

/**
 * Check if the privacy style should be rendered in italic
 */
export function isItalicStyle(style: PrivacyDisplayStyle | null): boolean {
  if (!style) return false;
  return ITALIC_STYLES.includes(style);
}

/**
 * Get privacy display metadata for rendering
 */
export function getPrivacyDisplayInfo(
  isPublic: boolean,
  realName: string,
  privacyStyle: PrivacyDisplayStyle | null = DEFAULT_PRIVACY_STYLE
): {
  displayName: string;
  isPrivate: boolean;
  isItalic: boolean;
} {
  const style = privacyStyle ?? DEFAULT_PRIVACY_STYLE;

  return {
    displayName: getPrivacyDisplayName(isPublic, realName, style),
    isPrivate: !isPublic,
    isItalic: !isPublic && isItalicStyle(style),
  };
}
