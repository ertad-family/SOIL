"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Plus,
  CheckCircle2,
  Landmark,
  Eye,
  Heart,
  ChevronRight,
  ArrowRight,
  Settings,
  Trash2,
  Pencil,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  Mail,
  Clock,
  XCircle,
  Send,
  Loader2,
  FileText,
  Upload,
  File,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
  NarrativeData,
  FounderRole,
  PublicNamingPreference,
} from "@/types/interview";
import { MODULES } from "@/types/interview";
import {
  getBusinessModelsForOrgType,
  LIFECYCLE_STAGE_LABELS as LIFECYCLE_LABELS,
  LIFECYCLE_STAGE_DESCRIPTIONS,
} from "@/data/function-matrix";
import { PublicView } from "./public-view";

interface OrganizationData {
  id: string;
  slug: string;
  name: string;
  organization_type: OrganizationType | null;
  business_model: string | null;
  industry: string | null;
  description: string | null;
  location_country: string | null;
  location_city: string | null;
  founded_date: string | null;
  closed_date: string | null;
  stage_at_closure: LifecycleStage | null;
  peak_team_size: number | null;
  verification_status: VerificationStatus;
  verification_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface StoryData {
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

interface MemorialData {
  id: string;
  slug: string;
  epitaph: string | null;
  tombstone_style: string;
  tombstone_color: string;
  views_count: number;
  respects_count: number;
  cenotaph_image_url: string | null;
  design_status: string | null;
}

type VerificationRelationship =
  | "colleague"
  | "customer"
  | "supplier"
  | "partner"
  | "investor"
  | "other";
type VerificationRequestStatus = "pending" | "confirmed" | "declined" | "expired";

interface VerificationRequest {
  id: string;
  verifier_email: string;
  verifier_name: string | null;
  relationship: VerificationRelationship;
  status: VerificationRequestStatus;
  created_at: string;
  expires_at: string;
  responded_at: string | null;
}

type DocumentVerificationStatus = "pending_review" | "approved" | "rejected";
type DocumentType = "registration" | "extract" | "charter" | "shareholder_list" | "other";

interface VerificationDocument {
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

const RELATIONSHIP_LABELS: Record<VerificationRelationship, string> = {
  colleague: "Ex-Colleague",
  customer: "Ex-Customer",
  supplier: "Ex-Supplier",
  partner: "Ex-Partner",
  investor: "Ex-Investor",
  other: "Other",
};

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  registration: "Registration Certificate",
  extract: "Registry Extract",
  charter: "Company Charter",
  shareholder_list: "Shareholder List",
  other: "Other Document",
};

type VerificationTab = "social" | "documents";

interface CurrentUserData {
  name: string;
  role: string | null;
}

/** Narrative data from a coined story for public display */
interface PublicNarrativeData {
  storyId: string;
  authorName: string | null;
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  narrative: NarrativeData;
  coinedAt: string;
}

interface OrganizationClientProps {
  organization: OrganizationData;
  stories: StoryData[];
  memorial: MemorialData | null;
  currentUserId: string | null;
  currentUserData: CurrentUserData;
  isOwner: boolean;
  viewMode: "owner" | "visitor";
  publicNarratives: PublicNarrativeData[];
  currentUserStoryId: string | null;
}

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  tech_product: "Tech Product",
  services: "Services",
  ecommerce: "E-commerce",
  manufacturing: "Manufacturing",
  ngo: "NGO",
  media: "Media",
};

const STAGE_LABELS: Record<LifecycleStage, string> = {
  formation: "Formation",
  establishment: "Establishment",
  growth: "Growth",
  maturity: "Maturity",
};

export function OrganizationClient({
  organization,
  stories,
  memorial,
  currentUserId,
  currentUserData,
  isOwner,
  viewMode,
  publicNarratives,
  currentUserStoryId,
}: OrganizationClientProps) {
  // For visitor mode, render the public view
  if (viewMode === "visitor") {
    return (
      <PublicView
        organization={organization}
        memorial={memorial}
        publicNarratives={publicNarratives}
        currentUserId={currentUserId}
        currentUserStoryId={currentUserStoryId}
      />
    );
  }

  // Owner mode - render the dashboard (existing code below)
  return (
    <OwnerView
      organization={organization}
      stories={stories}
      memorial={memorial}
      currentUserId={currentUserId!}
      currentUserData={currentUserData}
      isOwner={isOwner}
    />
  );
}

/** Owner dashboard view - the existing implementation */
function OwnerView({
  organization,
  stories,
  memorial,
  currentUserId,
  currentUserData,
  isOwner,
}: {
  organization: OrganizationData;
  stories: StoryData[];
  memorial: MemorialData | null;
  currentUserId: string;
  currentUserData: CurrentUserData;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(organization.is_public);
  const [isSaving, setIsSaving] = useState(false);

  // Edit organization modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [orgData, setOrgData] = useState(organization);

  // Verification state
  const [verificationTab, setVerificationTab] = useState<VerificationTab>("social");
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [verificationDocuments, setVerificationDocuments] = useState<VerificationDocument[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  // Fetch verification requests
  const fetchVerificationRequests = useCallback(async () => {
    if (!isOwner) return;

    setIsLoadingRequests(true);
    try {
      const res = await fetch(`/api/verification/request?organizationId=${organization.id}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch verification requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [organization.id, isOwner]);

  // Fetch verification documents
  const fetchVerificationDocuments = useCallback(async () => {
    if (!isOwner) return;

    setIsLoadingDocuments(true);
    try {
      const res = await fetch(`/api/verification/documents?organizationId=${organization.id}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch verification documents:", err);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [organization.id, isOwner]);

  useEffect(() => {
    fetchVerificationRequests();
    fetchVerificationDocuments();
  }, [fetchVerificationRequests, fetchVerificationDocuments]);

  // Calculate verification progress
  const confirmedCount = verificationRequests.filter((r) => r.status === "confirmed").length;
  const pendingCount = verificationRequests.filter((r) => r.status === "pending").length;
  const approvedDocs = verificationDocuments.filter((d) => d.status === "approved").length;
  const pendingDocs = verificationDocuments.filter((d) => d.status === "pending_review").length;
  const hasDocumentVerification = approvedDocs > 0;

  // My story (if I have one)
  const myStory = stories.find((s) => s.user_id === currentUserId);
  const otherStories = stories.filter((s) => s.user_id !== currentUserId);

  // Format dates
  const formatDate = (date: string | null) => {
    if (!date) return null;
    return date.replace("-", ".");
  };

  const lifespan =
    orgData.founded_date && orgData.closed_date
      ? `${formatDate(orgData.founded_date)} — ${formatDate(orgData.closed_date)}`
      : null;

  const location = [orgData.location_city, orgData.location_country].filter(Boolean).join(", ");

  // Toggle visibility via API
  const handleVisibilityChange = async (checked: boolean) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/organization/${organization.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: checked }),
      });

      if (!res.ok) {
        throw new Error("Failed to update visibility");
      }

      setIsPublic(checked);
    } catch (err) {
      console.error("Failed to update visibility:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete organization via API
  const handleDelete = async () => {
    if (
      !confirm("Are you sure you want to delete this organization? This action cannot be undone.")
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/organization/${organization.id}`, {
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
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      variant="dark"
      pageTitle={orgData.name}
      pageDescription="Organization profile"
      pageActions={
        <a href="/account">
          <Button variant="dark-ghost" size="sm">
            ← Back to Account
          </Button>
        </a>
      }
    >
      {/* Main Content: Info + Cenotaph Avatar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Organization Info (Left Columns) */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
          {/* General Information Card */}
          <Card variant="dark">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle variant="dark">General Information</CardTitle>
                  {isOwner && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-1 text-slate-500 hover:text-gold-400 transition-colors"
                      title="Edit organization details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isPublic && (
                    <Badge variant="dark-outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
              </div>
              {orgData.description && (
                <CardDescription variant="dark" className="mt-2">
                  {orgData.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Organization Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {orgData.organization_type && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-4 h-4" />
                    <span>{ORG_TYPE_LABELS[orgData.organization_type]}</span>
                  </div>
                )}
                {lifespan && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{lifespan}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {orgData.peak_team_size && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>Peak team: {orgData.peak_team_size}</span>
                  </div>
                )}
                {orgData.industry && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">Industry:</span>
                    <span>{orgData.industry}</span>
                  </div>
                )}
                {orgData.stage_at_closure && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">Stage at closure:</span>
                    <span>{STAGE_LABELS[orgData.stage_at_closure]}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Card */}
          <Card variant="dark">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {organization.verification_status === "verified" ? (
                    <ShieldCheck className="w-5 h-5 text-gold-400" />
                  ) : organization.verification_status === "pending" ? (
                    <ShieldQuestion className="w-5 h-5 text-gold-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-slate-500" />
                  )}
                  <CardTitle variant="dark" className="text-base">
                    Verification
                  </CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={
                        organization.verification_status === "verified"
                          ? "dark-verified"
                          : hasDocumentVerification
                            ? "dark-warning"
                            : "dark-error"
                      }
                      size="sm"
                      className="cursor-help"
                    >
                      {organization.verification_status === "verified" && (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      )}
                      {organization.verification_status === "verified"
                        ? "Verified"
                        : hasDocumentVerification
                          ? "Doc Verified"
                          : "Unverified"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent variant="dark" side="bottom" className="max-w-sm p-5">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-marble-100 mb-2">
                          {organization.verification_status === "verified"
                            ? "This organization is verified"
                            : "Why verify?"}
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {organization.verification_status === "verified"
                            ? "Your story can now be used in research, your cenotaph is public and searchable, and you can offer consulting to the founder community."
                            : "Verification unlocks publishing your cenotaph publicly, making your experience searchable, enabling research use, and opening consulting opportunities."}
                        </p>
                      </div>
                      <Button variant="dark-secondary" size="sm" fullWidth asChild>
                        <a href="/about/verification">
                          Learn more
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Verification Tabs */}
              {isOwner && organization.verification_status !== "verified" && (
                <div className="flex gap-2 border-b border-slate-700 pb-3">
                  <button
                    onClick={() => setVerificationTab("social")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      verificationTab === "social"
                        ? "bg-gold-500/20 text-gold-400"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    References
                  </button>
                  <button
                    onClick={() => setVerificationTab("documents")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      verificationTab === "documents"
                        ? "bg-gold-500/20 text-gold-400"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Documents
                  </button>
                </div>
              )}

              {/* Social Verification Tab */}
              {verificationTab === "social" && (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            confirmedCount >= 3 ? "bg-gold-500" : "bg-gold-500/60"
                          }`}
                          style={{ width: `${Math.min((confirmedCount / 3) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      {confirmedCount >= 3
                        ? "Organization verified!"
                        : `${3 - confirmedCount} more confirmation${3 - confirmedCount !== 1 ? "s" : ""} needed`}
                      {pendingCount > 0 && ` (${pendingCount} pending)`}
                    </p>
                  </div>

                  {/* Verification steps */}
                  {isOwner && organization.verification_status !== "verified" && (
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-2">
                        How it works
                      </h4>
                      <ol className="text-sm text-slate-400 space-y-1.5 list-decimal list-inside">
                        <li>Ask people who knew the organization</li>
                        <li>They confirm existence &amp; your role</li>
                        <li>3 confirmations = verified</li>
                      </ol>
                      <Button
                        variant="dark-primary"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => setShowVerificationForm(true)}
                        leftIcon={<Send className="w-4 h-4" />}
                      >
                        Request Verification
                      </Button>
                    </div>
                  )}

                  {/* Verification requests list */}
                  {isOwner && verificationRequests.length > 0 && (
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Verification Requests
                      </h4>
                      {isLoadingRequests ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {verificationRequests.map((request) => (
                            <VerificationRequestItem key={request.id} request={request} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Documents Verification Tab */}
              {verificationTab === "documents" && (
                <>
                  {/* Document status */}
                  <div>
                    <p className="text-sm text-slate-400 mb-3">
                      Upload registration documents showing you as owner/founder. Documents are
                      reviewed manually (1-3 business days).
                    </p>
                    {pendingDocs > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gold-400 mb-3">
                        <Clock className="w-4 h-4" />
                        {pendingDocs} document{pendingDocs !== 1 ? "s" : ""} pending review
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  {isOwner && organization.verification_status !== "verified" && (
                    <Button
                      variant="dark-primary"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowDocumentUpload(true)}
                      leftIcon={<Upload className="w-4 h-4" />}
                    >
                      Upload Document
                    </Button>
                  )}

                  {/* Documents list */}
                  {verificationDocuments.length > 0 && (
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Uploaded Documents
                      </h4>
                      {isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {verificationDocuments.map((doc) => (
                            <DocumentItem
                              key={doc.id}
                              document={doc}
                              onDelete={() => fetchVerificationDocuments()}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Verification Form Modal */}
          {showVerificationForm && (
            <VerificationFormModal
              organizationId={organization.id}
              organizationName={organization.name}
              confirmedCount={confirmedCount}
              requesterName={currentUserData.name}
              requesterRole={currentUserData.role}
              onClose={() => setShowVerificationForm(false)}
              onSuccess={() => {
                setShowVerificationForm(false);
                fetchVerificationRequests();
              }}
            />
          )}

          {/* Document Upload Modal */}
          {showDocumentUpload && (
            <DocumentUploadModal
              organizationId={organization.id}
              onClose={() => setShowDocumentUpload(false)}
              onSuccess={() => {
                setShowDocumentUpload(false);
                fetchVerificationDocuments();
              }}
            />
          )}

          {/* Edit Organization Modal */}
          {showEditModal && (
            <EditOrganizationModal
              organization={orgData}
              onClose={() => setShowEditModal(false)}
              onSuccess={(updatedOrg) => {
                setOrgData(updatedOrg);
                setShowEditModal(false);
              }}
            />
          )}
        </div>

        {/* Cenotaph Avatar (Right Column) */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <CenotaphAvatar memorial={memorial} organizationId={organization.id} isOwner={isOwner} />
        </div>
      </div>

      {/* Stories/Perspectives Section */}
      <Card variant="dark" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle variant="dark">Perspectives</CardTitle>
              <CardDescription variant="dark">Stories told about this organization</CardDescription>
            </div>
            {isOwner && !myStory && (
              <a href={`/interview?org=${organization.id}`}>
                <Button variant="dark-primary" size="sm" rightIcon={<Plus className="w-4 h-4" />}>
                  Add Your Story
                </Button>
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No stories yet</p>
              {isOwner && (
                <a href={`/organization/create?org=${organization.id}&returnTo=interview`}>
                  <Button variant="dark-primary" rightIcon={<Plus className="w-4 h-4" />}>
                    Add Your Story
                  </Button>
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* My Story First */}
              {myStory && <StoryCard story={myStory} isOwn={true} authorName="You" />}
              {/* Other Stories */}
              {otherStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isOwn={false}
                  authorName={story.profile?.display_name || "Anonymous"}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Section (Owner Only) */}
      {isOwner && (
        <Card variant="dark">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <CardTitle variant="dark">Settings</CardTitle>
                <CardDescription variant="dark">Manage this organization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Visibility Toggle */}
              <SwitchWithLabel
                variant="dark"
                label="Public profile"
                description="Allow others to see this organization's profile and cenotaph"
                checked={isPublic}
                onCheckedChange={handleVisibilityChange}
                disabled={isSaving}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Button
                  variant="dark-ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-error-400 hover:text-error-300"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  Delete Organization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

// Roman marble frame styles
const marbleFrameStyles = `
  relative
  aspect-[3/4]
  rounded-sm
  bg-gradient-to-b from-marble-100 via-marble-200 to-marble-300
  p-[3px]
  shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)]
  before:absolute before:inset-[3px] before:rounded-sm
  before:border before:border-marble-400/30
  before:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
`;

const marbleFrameEmptyStyles = `
  relative
  aspect-[3/4]
  rounded-sm
  bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900
  p-[3px]
  shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
  border border-dashed border-slate-600
`;

// Cenotaph Avatar Component
function CenotaphAvatar({
  memorial,
  organizationId,
  isOwner,
}: {
  memorial: MemorialData | null;
  organizationId: string;
  isOwner: boolean;
}) {
  const [showImagePopup, setShowImagePopup] = useState(false);

  if (memorial) {
    // Check if memorial has AI-generated cenotaph image
    // Show existing design even if regeneration is in progress (cenotaph_image_url persists until new one is selected)
    const hasDesign = !!memorial.cenotaph_image_url;
    const isRegenerating =
      memorial.design_status === "generating" || memorial.design_status === "options_ready";
    const needsDesign = !hasDesign && isOwner;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => hasDesign && setShowImagePopup(true)}
          className="block group w-full text-left cursor-pointer"
          disabled={!hasDesign}
        >
          {/* Roman Marble Frame */}
          <div className={marbleFrameStyles}>
            {/* Inner content */}
            <div
              className="relative w-full h-full rounded-sm overflow-hidden transition-all"
              style={{
                backgroundColor: hasDesign ? "transparent" : memorial.tombstone_color || "#1e293b",
              }}
            >
              {/* AI-generated cenotaph image */}
              {hasDesign && memorial.cenotaph_image_url && (
                <img
                  src={memorial.cenotaph_image_url}
                  alt="Cenotaph design"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Decorative corner ornaments (only when no image) */}
              {!hasDesign && (
                <>
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold-400/40" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold-400/40" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold-400/40" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold-400/40" />
                </>
              )}

              {/* Tombstone Preview (only when no image) */}
              {!hasDesign && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Landmark className="w-10 h-10 text-marble-300/80 mb-3" />
                  <p className="text-marble-200 font-serif text-sm italic line-clamp-3 px-2">
                    {memorial.epitaph || "In memoriam"}
                  </p>
                </div>
              )}

              {/* Hover Overlay (only when has design) */}
              {hasDesign && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-900 text-sm font-medium rounded-md">
                    View Cenotaph
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {memorial.views_count}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {memorial.respects_count}
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Image Popup Modal */}
        {showImagePopup && memorial.cenotaph_image_url && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowImagePopup(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-marble-300 hover:text-marble-100 transition-colors"
              onClick={() => setShowImagePopup(false)}
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img
              src={memorial.cenotaph_image_url}
              alt="Cenotaph design"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Design Cenotaph button (shown when no AI design yet) */}
        {needsDesign && (
          <div className="mt-3 text-center">
            <a href={`/cenotaph/create/${memorial.id}`}>
              <Button
                variant="dark-secondary"
                size="sm"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Design Cenotaph
              </Button>
            </a>
          </div>
        )}

        {/* Change Design / Continue Designing button (shown when design exists and user is owner) */}
        {hasDesign && isOwner && (
          <div className="mt-3 text-center">
            <a href={`/cenotaph/create/${memorial.id}`}>
              <Button
                variant="dark-ghost"
                size="sm"
                leftIcon={
                  isRegenerating ? <Sparkles className="w-4 h-4" /> : <Pencil className="w-4 h-4" />
                }
              >
                {isRegenerating ? "Continue Designing" : "Change Design"}
              </Button>
            </a>
          </div>
        )}
      </div>
    );
  }

  // No cenotaph - show invitation with Roman frame style
  return (
    <div className={marbleFrameEmptyStyles}>
      <div className="relative w-full h-full rounded-sm bg-slate-800/50 flex flex-col items-center justify-center p-6 text-center">
        {/* Decorative corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-slate-500/50" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-slate-500/50" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-slate-500/50" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-slate-500/50" />

        <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-3 border border-slate-600">
          <Landmark className="w-7 h-7 text-slate-500" />
        </div>
        <h3 className="font-display text-base text-marble-300 mb-2">No Cenotaph Yet</h3>
        <p className="text-slate-500 text-sm mb-4 px-2">
          Create a memorial to preserve this legacy
        </p>
        {isOwner && (
          <a href={`/create?org=${organizationId}`}>
            <Button variant="dark-primary" size="sm" rightIcon={<Plus className="w-4 h-4" />}>
              Create Cenotaph
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// Story Card Component
function StoryCard({
  story,
  isOwn,
  authorName,
}: {
  story: StoryData;
  isOwn: boolean;
  authorName: string;
}) {
  const progress = Math.round((story.completed_modules.length / MODULES.length) * 100);
  const isCoined = story.status === "coined";

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-marble-200">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-marble-100 font-medium">
              {authorName}
              {isOwn && <span className="text-slate-500 ml-2">(you)</span>}
            </p>
            <div className="flex items-center gap-2">
              {isCoined ? (
                <Badge variant="dark-success" size="sm">
                  Coined
                </Badge>
              ) : (
                <Badge variant="dark-outline" size="sm">
                  {progress}% complete
                </Badge>
              )}
              {story.coined_at && (
                <span className="text-sm text-slate-500">
                  {new Date(story.coined_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwn && (
          <a href={`/interview/${story.id}`}>
            <Button variant="dark-ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              {isCoined ? "View" : "Continue"}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// Verification Request Item Component
function VerificationRequestItem({ request }: { request: VerificationRequest }) {
  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-gold-400" />,
    confirmed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    declined: <XCircle className="w-4 h-4 text-red-400" />,
    expired: <Clock className="w-4 h-4 text-slate-500" />,
  };

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    declined: "Declined",
    expired: "Expired",
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-800/50 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className="text-slate-300 truncate">
          {request.verifier_name || request.verifier_email}
        </span>
        <span className="text-slate-500 flex-shrink-0">
          ({RELATIONSHIP_LABELS[request.relationship]})
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        {statusIcons[request.status]}
        <span
          className={`${
            request.status === "confirmed"
              ? "text-green-400"
              : request.status === "declined"
                ? "text-red-400"
                : request.status === "pending"
                  ? "text-gold-400"
                  : "text-slate-500"
          }`}
        >
          {statusLabels[request.status]}
        </span>
      </div>
    </div>
  );
}

// Role labels for email preview
const ROLE_LABELS_FOR_EMAIL: Record<string, string> = {
  founder: "the Founder",
  co_founder: "a Co-Founder",
  cofounder: "a Co-Founder",
  executive: "an Executive",
  ceo_non_founder: "the CEO",
  employee: "a team member",
  customer: "a customer",
  supplier: "a supplier",
  partner: "a partner",
  investor: "an investor",
  other: "a team member",
};

// Verification Form Modal Component
function VerificationFormModal({
  organizationId,
  organizationName,
  confirmedCount,
  requesterName,
  requesterRole,
  onClose,
  onSuccess,
}: {
  organizationId: string;
  organizationName: string;
  confirmedCount: number;
  requesterName: string;
  requesterRole: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const neededCount = Math.max(1, 3 - confirmedCount);

  // Format role for display
  const roleLabel = requesterRole
    ? ROLE_LABELS_FOR_EMAIL[requesterRole] || "a team member"
    : "a team member";

  // Initialize with the required number of contact fields
  const [contacts, setContacts] = useState<
    Array<{
      email: string;
      name: string;
      relationship: VerificationRelationship;
    }>
  >(() =>
    Array.from({ length: neededCount }, () => ({
      email: "",
      name: "",
      relationship: "colleague" as VerificationRelationship,
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContact = () => {
    if (contacts.length < 10) {
      setContacts([...contacts, { email: "", name: "", relationship: "colleague" }]);
    }
  };

  const removeContact = (index: number) => {
    // Don't allow removing below the required minimum
    if (contacts.length > neededCount) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validContacts = contacts.filter((c) => c.email.trim());
    if (validContacts.length === 0) {
      setError("Please add at least one contact");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const contact of validContacts) {
      if (!emailRegex.test(contact.email)) {
        setError(`Invalid email format: ${contact.email}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          contacts: validContacts.map((c) => ({
            email: c.email.trim(),
            name: c.name.trim() || undefined,
            relationship: c.relationship,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send verification requests");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send requests");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">Request Verification</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Ask people who can confirm that{" "}
            <strong className="text-marble-200">{organizationName}</strong> existed and your role in
            it. You need <strong className="text-gold-400">{neededCount} more</strong> confirmation
            {neededCount !== 1 ? "s" : ""}.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Two-column layout */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column: Contacts */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-3">
                  Contacts to ask
                </h3>

                {/* Tip */}
                <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gold-300">
                    <strong>Tip:</strong> The more people you ask, the faster verification will
                    complete.
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="email"
                          placeholder="Email *"
                          value={contact.email}
                          onChange={(e) => updateContact(index, "email", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Name (optional)"
                            value={contact.name}
                            onChange={(e) => updateContact(index, "name", e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                          />
                          <select
                            value={contact.relationship}
                            onChange={(e) => updateContact(index, "relationship", e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                          >
                            <option value="colleague">Ex-Colleague</option>
                            <option value="customer">Ex-Customer</option>
                            <option value="supplier">Ex-Supplier</option>
                            <option value="partner">Ex-Partner</option>
                            <option value="investor">Ex-Investor</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      {contacts.length > neededCount && (
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {contacts.length < 10 && (
                  <button
                    type="button"
                    onClick={addContact}
                    className="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add another contact
                  </button>
                )}
              </div>

              {/* Right column: Email Preview (always visible) */}
              <div className="lg:border-l lg:border-slate-700 lg:pl-6">
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Preview
                </h3>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                  <p className="text-slate-300 mb-3">
                    <strong className="text-marble-200">Subject:</strong> {requesterName} asks for
                    your help preserving {organizationName}&apos;s legacy
                  </p>
                  <div className="text-slate-400 space-y-2.5">
                    <p>
                      Hi <span className="text-marble-200">[Recipient Name]</span>,
                    </p>

                    <p>
                      <strong className="text-marble-200">{requesterName}</strong>, who was{" "}
                      <strong className="text-gold-400">{roleLabel}</strong> of{" "}
                      <strong className="text-marble-200">{organizationName}</strong>, is
                      documenting the organization&apos;s story on SOIL — a platform dedicated to
                      preserving the legacies of organizations that have closed.
                    </p>

                    <p>
                      Every year, millions of companies close their doors. Their stories, lessons,
                      and the people who built them risk being forgotten. SOIL exists to change that
                      — creating digital cenotaphs that honor these journeys and help future
                      founders learn from the past.
                    </p>

                    <p>
                      <strong className="text-marble-200">{requesterName}</strong> listed you as{" "}
                      <strong className="text-gold-400">
                        an{" "}
                        {contacts[0]
                          ? RELATIONSHIP_LABELS[contacts[0].relationship].toLowerCase()
                          : "contact"}
                      </strong>{" "}
                      who can confirm that {organizationName} existed and their role in it. Your
                      verification helps ensure authenticity and honors the real story.
                    </p>

                    <div className="bg-gold-500/10 border border-gold-500/20 rounded p-2.5 my-2">
                      <p className="text-gold-300 text-xs">
                        <strong>It takes just 30 seconds:</strong> Click the button below, review
                        the details, and confirm.
                      </p>
                    </div>

                    <p className="text-gold-400 font-medium">[Verify Now Button]</p>

                    <p className="text-slate-500 text-xs pt-2 border-t border-slate-700">
                      If you don&apos;t recognize {requesterName} or {organizationName}, simply
                      ignore this email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isSubmitting}
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )
                }
              >
                {isSubmitting ? "Sending..." : "Send Requests"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Document Item Component
function DocumentItem({
  document,
  onDelete,
}: {
  document: VerificationDocument;
  onDelete: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const statusIcons = {
    pending_review: <Clock className="w-4 h-4 text-gold-400" />,
    approved: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    rejected: <XCircle className="w-4 h-4 text-red-400" />,
  };

  const statusLabels = {
    pending_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  const handleDelete = async () => {
    if (!confirm("Delete this document?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/verification/documents?id=${document.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete();
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-800/50 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <File className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <div className="min-w-0">
          <span className="text-slate-300 truncate block">{document.file_name}</span>
          <span className="text-slate-500 text-xs">
            {DOCUMENT_TYPE_LABELS[document.document_type]}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <div className="flex items-center gap-1.5">
          {statusIcons[document.status]}
          <span
            className={`${
              document.status === "approved"
                ? "text-green-400"
                : document.status === "rejected"
                  ? "text-red-400"
                  : "text-gold-400"
            }`}
          >
            {statusLabels[document.status]}
          </span>
        </div>
        {document.status === "pending_review" && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {document.status === "rejected" && document.rejection_reason && (
        <div className="absolute left-0 right-0 -bottom-6 text-sm text-red-400 truncate">
          Reason: {document.rejection_reason}
        </div>
      )}
    </div>
  );
}

// Document Upload Modal Component
function DocumentUploadModal({
  organizationId,
  onClose,
  onSuccess,
}: {
  organizationId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("registration");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.value = "";
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("File must be PDF, JPEG, PNG, or WebP");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("organizationId", organizationId);
      formData.append("documentType", documentType);
      if (description.trim()) {
        formData.append("description", description.trim());
      }

      const res = await fetch("/api/verification/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload document");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">Upload Document</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Upload a document that proves your ownership of this organization. Accepted formats:
            PDF, JPEG, PNG, WebP (max 10MB).
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document File *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  file
                    ? "border-gold-500/50 bg-gold-500/5"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <File className="w-6 h-6 text-gold-400" />
                    <span className="text-marble-200 text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 mb-2">Click to select or drag and drop</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Document Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
              >
                <option value="registration">Registration Certificate</option>
                <option value="extract">Registry Extract (EGRUL, etc.)</option>
                <option value="charter">Company Charter</option>
                <option value="shareholder_list">Shareholder List</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any additional notes about this document..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isUploading || !file}
                leftIcon={
                  isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )
                }
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Organization Modal Component
function EditOrganizationModal({
  organization,
  onClose,
  onSuccess,
}: {
  organization: OrganizationData;
  onClose: () => void;
  onSuccess: (updatedOrg: OrganizationData) => void;
}) {
  const [formData, setFormData] = useState({
    name: organization.name,
    description: organization.description || "",
    organization_type: organization.organization_type,
    business_model: organization.business_model || "",
    industry: organization.industry || "",
    location_country: organization.location_country || "",
    location_city: organization.location_city || "",
    founded_date: organization.founded_date || "",
    closed_date: organization.closed_date || "",
    stage_at_closure: organization.stage_at_closure,
    peak_team_size: organization.peak_team_size,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get business models for selected org type
  const businessModels = formData.organization_type
    ? getBusinessModelsForOrgType(formData.organization_type)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/organization/${organization.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          organization_type: formData.organization_type,
          business_model: formData.business_model || null,
          industry: formData.industry || null,
          location_country: formData.location_country || null,
          location_city: formData.location_city || null,
          founded_date: formData.founded_date || null,
          closed_date: formData.closed_date || null,
          stage_at_closure: formData.stage_at_closure,
          peak_team_size: formData.peak_team_size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update organization");
      }

      const data = await res.json();
      onSuccess(data.organization);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">Edit Organization</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                placeholder="Organization name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 resize-none"
                placeholder="Brief description of the organization"
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Organization Type
              </label>
              <select
                value={formData.organization_type || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization_type: (e.target.value as OrganizationType) || null,
                    business_model: "", // Reset business model when org type changes
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
              >
                <option value="">Select type...</option>
                {(Object.keys(ORG_TYPE_LABELS) as OrganizationType[]).map((type) => (
                  <option key={type} value={type}>
                    {ORG_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Model - only show if org type is selected */}
            {formData.organization_type && businessModels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Business Model
                </label>
                <select
                  value={formData.business_model}
                  onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="">Select business model...</option>
                  {businessModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                placeholder="e.g., Fintech, Healthcare, Education"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.location_country}
                  onChange={(e) => setFormData({ ...formData, location_country: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  placeholder="City"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Founded Date
                </label>
                <input
                  type="month"
                  value={formData.founded_date}
                  onChange={(e) => setFormData({ ...formData, founded_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Closed Date</label>
                <input
                  type="month"
                  value={formData.closed_date}
                  onChange={(e) => setFormData({ ...formData, closed_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Stage at Closure */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Stage at Closure
              </label>
              <select
                value={formData.stage_at_closure || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stage_at_closure: (e.target.value as LifecycleStage) || null,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
              >
                <option value="">Select stage...</option>
                {(Object.keys(LIFECYCLE_LABELS) as LifecycleStage[]).map((stage) => (
                  <option key={stage} value={stage}>
                    {LIFECYCLE_LABELS[stage]} - {LIFECYCLE_STAGE_DESCRIPTIONS[stage]}
                  </option>
                ))}
              </select>
            </div>

            {/* Peak Team Size */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Peak Team Size
              </label>
              <input
                type="number"
                min={1}
                value={formData.peak_team_size || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    peak_team_size: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                placeholder="e.g., 25"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
