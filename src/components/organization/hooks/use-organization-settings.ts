"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrivacyDisplayStyle, DEFAULT_PRIVACY_STYLE } from "@/lib/privacy";
import type { SaveStatus } from "../types";

interface UseOrganizationSettingsOptions {
  organizationId: string;
  initialIsPublic: boolean;
  initialPrivacyDisplayStyle: string | null;
}

interface UseOrganizationSettingsReturn {
  // State
  isPublic: boolean;
  privacyDisplayStyle: PrivacyDisplayStyle;
  saveStatus: SaveStatus;
  saveError: string | null;
  isDeleting: boolean;

  // Actions
  handleVisibilityChange: (checked: boolean) => Promise<void>;
  handlePrivacyStyleChange: (style: PrivacyDisplayStyle) => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useOrganizationSettings({
  organizationId,
  initialIsPublic,
  initialPrivacyDisplayStyle,
}: UseOrganizationSettingsOptions): UseOrganizationSettingsReturn {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [privacyDisplayStyle, setPrivacyDisplayStyle] = useState<PrivacyDisplayStyle>(
    (initialPrivacyDisplayStyle as PrivacyDisplayStyle) || DEFAULT_PRIVACY_STYLE
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle visibility via API with status feedback
  const handleVisibilityChange = async (checked: boolean) => {
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const res = await fetch(`/api/organization/${organizationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: checked }),
      });

      if (!res.ok) {
        throw new Error("Failed to update visibility");
      }

      setIsPublic(checked);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to update visibility:", err);
      setSaveStatus("error");
      setSaveError("Failed to save visibility setting");
    }
  };

  // Update privacy display style via API with status feedback
  const handlePrivacyStyleChange = async (style: PrivacyDisplayStyle) => {
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const res = await fetch(`/api/organization/${organizationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacy_display_style: style }),
      });

      if (!res.ok) {
        throw new Error("Failed to update privacy display style");
      }

      setPrivacyDisplayStyle(style);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to update privacy display style:", err);
      setSaveStatus("error");
      setSaveError("Failed to save display style");
    }
  };

  // Delete organization via API
  const handleDelete = async () => {
    if (
      !confirm("Are you sure you want to delete this organization? This action cannot be undone.")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/organization/${organizationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete organization");
      }

      router.push("/account");
    } catch (err) {
      console.error("Failed to delete organization:", err);
      alert("Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isPublic,
    privacyDisplayStyle,
    saveStatus,
    saveError,
    isDeleting,
    handleVisibilityChange,
    handlePrivacyStyleChange,
    handleDelete,
  };
}
