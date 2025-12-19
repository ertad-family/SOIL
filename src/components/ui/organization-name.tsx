import { cn } from "@/lib/utils";
import { getPrivacyDisplayInfo, type PrivacyDisplayStyle } from "@/lib/privacy";

interface OrganizationNameProps {
  /** The actual organization name */
  name: string;
  /** Whether the organization is public */
  isPublic: boolean;
  /** Privacy display style for private organizations */
  privacyStyle?: PrivacyDisplayStyle | null;
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
}

/**
 * OrganizationName - Privacy-aware organization name display
 *
 * Displays the actual name for public organizations, or a styled
 * placeholder for private organizations based on their privacy settings.
 *
 * Private organization names are displayed with:
 * - Muted color (slate-400 instead of marble-100)
 * - Italic style for Latin phrases (incognita, sub_rosa)
 */
export function OrganizationName({
  name,
  isPublic,
  privacyStyle,
  className,
  as: Component = "span",
}: OrganizationNameProps) {
  const { displayName, isPrivate, isItalic } = getPrivacyDisplayInfo(isPublic, name, privacyStyle);

  return (
    <Component
      className={cn(className, isPrivate && "text-slate-400", isItalic && "italic")}
      title={isPrivate ? "This organization has chosen to remain private" : undefined}
    >
      {displayName}
    </Component>
  );
}

export default OrganizationName;
