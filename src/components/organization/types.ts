import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
  FounderRole,
  PublicNamingPreference,
} from "@/types/interview";

export interface OrganizationData {
  id: string;
  slug: string;
  name: string;
  organization_type: OrganizationType | null;
  organization_type_other: string | null;
  business_model: string | null;
  business_model_other: string | null;
  industry: string | null;
  description: string | null;
  location_country: string | null;
  location_region: string | null;
  location_city: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_geo_id: number | null;
  founded_date: string | null;
  closed_date: string | null;
  stage_at_closure: LifecycleStage | null;
  peak_team_size: number | null;
  verification_status: VerificationStatus;
  verification_count: number;
  is_public: boolean;
  privacy_display_style: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface StoryData {
  id: string;
  user_id: string;
  status: StoryStatus;
  current_module: ModuleId;
  completed_modules: ModuleId[];
  coined_at: string | null;
  created_at: string;
  updated_at: string;
  profile: {
    display_name: string | null;
  } | null;
}

/** 3D render settings for cenotaph model */
export interface CenotaphRenderSettings {
  material?: {
    metalness?: number;
    roughness?: number;
    envMapIntensity?: number;
  };
  environment?: "sunset" | "studio" | "city" | "night" | "warehouse" | "forest";
  lighting?: {
    keyLight?: { intensity?: number; color?: string };
    fillLight?: { intensity?: number; color?: string };
    rimLight?: { intensity?: number; color?: string };
  };
  exposure?: number;
}

export interface MemorialData {
  id: string;
  slug: string;
  epitaph: string | null;
  tombstone_style: string;
  tombstone_color: string;
  views_count: number;
  respects_count: number;
  cenotaph_image_url: string | null;
  cenotaph_model_url: string | null;
  cenotaph_render_settings: CenotaphRenderSettings | null;
  design_status: string | null;
  cenotaphery_slug: string | null;
}

export type VerificationRelationship =
  | "colleague"
  | "customer"
  | "supplier"
  | "partner"
  | "investor"
  | "other";

export type VerificationRequestStatus = "pending" | "confirmed" | "declined" | "expired";

export type EmailErrorType = "resend_error" | "recipient_error";

export interface VerificationRequest {
  id: string;
  verifier_email: string;
  verifier_name: string | null;
  relationship: VerificationRelationship;
  status: VerificationRequestStatus;
  created_at: string;
  expires_at: string;
  responded_at: string | null;
  email_sent_at: string | null;
  email_error: string | null;
  email_error_type: EmailErrorType | null;
  retry_count: number;
  next_retry_at: string | null;
}

export type DocumentVerificationStatus = "pending_review" | "approved" | "rejected";

export type DocumentType = "registration" | "extract" | "charter" | "shareholder_list" | "other";

export interface VerificationDocument {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  document_type: DocumentType;
  description: string | null;
  status: DocumentVerificationStatus;
  rejection_reason: string | null;
  created_at: string;
}

export type VerificationTab = "social" | "documents";

export interface CurrentUserData {
  name: string;
  role: string | null;
}

/** Summary data extracted from story for public display */
export interface PublicSummaryData {
  text: string;
  keyFacts: string[];
  closurePattern: string | null;
}

/** Public story data from coined stories - AI refined only */
export interface PublicNarrativeData {
  storyId: string;
  authorName: string | null;
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  coinedAt: string;
  summary: PublicSummaryData | null;
}

export interface OrganizationClientProps {
  organization: OrganizationData;
  stories: StoryData[];
  memorial: MemorialData | null;
  currentUserId: string | null;
  currentUserData: CurrentUserData;
  isOwner: boolean;
  viewMode: "owner" | "visitor";
  publicNarratives: PublicNarrativeData[];
  currentUserStoryId: string | null;
  peakRevenueUSD: number | null;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";
