"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  Eye,
  ChevronDown,
  Settings,
  Trash2,
  Pencil,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  Clock,
  XCircle,
  Send,
  Loader2,
  FileText,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SwitchWithLabel } from "@/components/ui/switch";
import { VerifiedBadgeWithTooltip } from "@/components/ui/verified-badge-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrivacyDisplayStyle, PRIVACY_DISPLAY_LABELS } from "@/lib/privacy";
import { BackButton } from "@/components/ui/back-button";

import { useSettings } from "@/hooks/use-settings";
import { isVerificationRequiredForPublicProfile } from "@/lib/settings";
import { useVerification } from "./hooks/use-verification";
import { useOrganizationSettings } from "./hooks/use-organization-settings";
import { CenotaphAvatar } from "./CenotaphAvatar";
import { StoryCard } from "./StoryCard";
import { VerificationRequestItem } from "./verification/VerificationRequestItem";
import { DocumentItem } from "./verification/DocumentItem";
import { VerificationFormModal } from "./modals/VerificationFormModal";
import { DocumentUploadModal } from "./modals/DocumentUploadModal";
import { EditOrganizationModal } from "./modals/EditOrganizationModal";
import { VerificationRequiredModal } from "./VerificationRequiredModal";
import { ORG_TYPE_LABELS, STAGE_LABELS } from "./constants";
import type { OrganizationData, StoryData, MemorialData, CurrentUserData } from "./types";

interface OwnerViewProps {
  organization: OrganizationData;
  stories: StoryData[];
  memorial: MemorialData | null;
  currentUserId: string;
  currentUserData: CurrentUserData;
  isOwner: boolean;
  onViewAsVisitor: () => void;
}

export function OwnerView({
  organization,
  stories,
  memorial,
  currentUserId,
  currentUserData,
  isOwner,
  onViewAsVisitor,
}: OwnerViewProps) {
  // Edit organization modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [orgData, setOrgData] = useState(organization);

  // Verification modal state
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showVerificationRequired, setShowVerificationRequired] = useState(false);

  // Load project settings
  const { settings: projectSettings } = useSettings();

  // Use verification hook
  const verification = useVerification({
    organizationId: organization.id,
    isOwner,
  });

  // Use organization settings hook
  const orgSettings = useOrganizationSettings({
    organizationId: organization.id,
    initialIsPublic: organization.is_public,
    initialPrivacyDisplayStyle: organization.privacy_display_style,
  });

  // My story (if I have one)
  const myStory = stories.find((s) => s.user_id === currentUserId);
  const otherStories = stories.filter((s) => s.user_id !== currentUserId);

  // Check if verification is required for public profile
  const isVerified = organization.verification_status === "verified";
  const requireVerificationForPublic = isVerificationRequiredForPublicProfile(projectSettings);
  const needsVerificationForPublic = requireVerificationForPublic && !isVerified;

  // Handler for visibility toggle - checks verification first
  const handleVisibilityToggle = (checked: boolean) => {
    // If trying to make public and verification is required but not verified
    if (checked && needsVerificationForPublic) {
      setShowVerificationRequired(true);
      return;
    }
    // Otherwise proceed with normal visibility change
    orgSettings.handleVisibilityChange(checked);
  };

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

  // Render Perspectives Card content
  const renderPerspectivesContent = () => (
    <Card variant="dark">
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
            {myStory && <StoryCard story={myStory} isOwn={true} authorName="You" />}
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
  );

  return (
    <DashboardLayout
      variant="dark"
      pageTitle={orgData.name}
      pageDescription="Organization profile"
      pageActions={
        <div className="flex items-center gap-3">
          <Button
            variant="dark-secondary"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={onViewAsVisitor}
          >
            View as Visitor
          </Button>
          <BackButton href="/account" text="Back to Account" />
        </div>
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
                  {orgSettings.isPublic ? (
                    <Badge variant="dark-outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="dark-ghost" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                  {organization.verification_status === "verified" ? (
                    <VerifiedBadgeWithTooltip
                      headline="This organization is verified"
                      description="Your story can now be used in research, your cenotaph is public and searchable, and you can offer consulting to the founder community."
                      side="bottom"
                    />
                  ) : (
                    <Badge
                      variant={verification.hasDocumentVerification ? "dark-warning" : "dark-error"}
                      size="sm"
                    >
                      {verification.hasDocumentVerification ? "Doc Verified" : "Unverified"}
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

          {/* Perspectives Card - shown here when verified (swapped position) */}
          {organization.verification_status === "verified" && renderPerspectivesContent()}

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
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Verification Tabs */}
              {isOwner && organization.verification_status !== "verified" && (
                <div className="flex gap-2 border-b border-slate-700 pb-3">
                  <button
                    onClick={() => verification.setVerificationTab("social")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      verification.verificationTab === "social"
                        ? "bg-gold-500/20 text-gold-400"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    References
                  </button>
                  <button
                    onClick={() => verification.setVerificationTab("documents")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      verification.verificationTab === "documents"
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
              {verification.verificationTab === "social" && (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            verification.confirmedCount >= 3 ? "bg-gold-500" : "bg-gold-500/60"
                          }`}
                          style={{
                            width: `${Math.min((verification.confirmedCount / 3) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      {verification.confirmedCount >= 3
                        ? "Organization verified!"
                        : `${3 - verification.confirmedCount} more confirmation${3 - verification.confirmedCount !== 1 ? "s" : ""} needed`}
                      {verification.pendingCount > 0 && ` (${verification.pendingCount} pending)`}
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
                  {isOwner && verification.verificationRequests.length > 0 && (
                    <div className="border-t border-slate-700 pt-4">
                      <button
                        onClick={() =>
                          verification.setIsRequestsCollapsed(!verification.isRequestsCollapsed)
                        }
                        className="flex items-center justify-between w-full text-left group"
                      >
                        <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
                          Verification Requests ({verification.verificationRequests.length})
                        </h4>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${
                            verification.isRequestsCollapsed ? "-rotate-90" : ""
                          }`}
                        />
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-200 ease-out"
                        style={{
                          gridTemplateRows: verification.isRequestsCollapsed ? "0fr" : "1fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          {verification.isLoadingRequests ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                            </div>
                          ) : (
                            <div className="space-y-2 pt-2">
                              {verification.verificationRequests.map((request) => (
                                <VerificationRequestItem
                                  key={request.id}
                                  request={request}
                                  onCancel={verification.cancelVerificationRequest}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Documents Verification Tab */}
              {verification.verificationTab === "documents" && (
                <>
                  {/* Document status */}
                  <div>
                    <p className="text-sm text-slate-400 mb-3">
                      Upload registration documents showing you as owner/founder. Documents are
                      reviewed manually (1-3 business days).
                    </p>
                    {verification.pendingDocs > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gold-400 mb-3">
                        <Clock className="w-4 h-4" />
                        {verification.pendingDocs} document
                        {verification.pendingDocs !== 1 ? "s" : ""} pending review
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
                  {verification.verificationDocuments.length > 0 && (
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Uploaded Documents
                      </h4>
                      {verification.isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {verification.verificationDocuments.map((doc) => (
                            <DocumentItem
                              key={doc.id}
                              document={doc}
                              onDelete={() => verification.fetchVerificationDocuments()}
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
              confirmedCount={verification.confirmedCount}
              pendingCount={verification.pendingCount}
              requesterName={currentUserData.name}
              requesterRole={currentUserData.role}
              onClose={() => setShowVerificationForm(false)}
              onSuccess={() => {
                setShowVerificationForm(false);
                verification.fetchVerificationRequests();
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
                verification.fetchVerificationDocuments();
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
          <CenotaphAvatar
            memorial={memorial}
            organizationId={organization.id}
            isOwner={isOwner}
            stories={stories}
            organization={orgData}
            myStory={myStory}
          />
        </div>
      </div>

      {/* Stories/Perspectives Section - shown here when NOT verified */}
      {organization.verification_status !== "verified" && (
        <div className="mb-8">{renderPerspectivesContent()}</div>
      )}

      {/* Settings Section (Owner Only) */}
      {isOwner && (
        <Card variant="dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <CardTitle variant="dark">Settings</CardTitle>
                  <CardDescription variant="dark">Manage this organization</CardDescription>
                </div>
              </div>
              {/* Save status indicator */}
              <div className="flex items-center gap-2 text-sm">
                {orgSettings.saveStatus === "saving" && (
                  <span className="flex items-center gap-1.5 text-gold-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                )}
                {orgSettings.saveStatus === "saved" && (
                  <span className="flex items-center gap-1.5 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved
                  </span>
                )}
                {orgSettings.saveStatus === "error" && (
                  <span className="flex items-center gap-1.5 text-error-400">
                    <XCircle className="w-4 h-4" />
                    {orgSettings.saveError || "Failed"}
                  </span>
                )}
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
                checked={orgSettings.isPublic}
                onCheckedChange={handleVisibilityToggle}
                disabled={orgSettings.saveStatus === "saving"}
              />

              {/* Privacy Display Style */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-marble-100">Privacy display style</label>
                <p className="text-sm text-slate-400 mb-2">
                  Choose how your organization name appears when private
                </p>
                <Select
                  value={orgSettings.privacyDisplayStyle}
                  onValueChange={(value) =>
                    orgSettings.handlePrivacyStyleChange(value as PrivacyDisplayStyle)
                  }
                  disabled={orgSettings.isPublic || orgSettings.saveStatus === "saving"}
                >
                  <SelectTrigger variant="dark" className="w-full">
                    <SelectValue placeholder="Select display style" />
                  </SelectTrigger>
                  <SelectContent variant="dark">
                    {(Object.keys(PRIVACY_DISPLAY_LABELS) as PrivacyDisplayStyle[]).map((style) => (
                      <SelectItem key={style} value={style} variant="dark">
                        {PRIVACY_DISPLAY_LABELS[style]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {orgSettings.isPublic && (
                  <p className="text-xs text-slate-500 mt-1">
                    This setting only applies when your profile is private
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Button
                  variant="dark-ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-error-400 hover:text-error-300"
                  onClick={orgSettings.handleDelete}
                  disabled={orgSettings.isDeleting}
                >
                  Delete Organization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Required Modal for Public Profile */}
      <VerificationRequiredModal
        open={showVerificationRequired}
        onOpenChange={setShowVerificationRequired}
        variant="public-profile"
      />
    </DashboardLayout>
  );
}
