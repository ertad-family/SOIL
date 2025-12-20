"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { FormField, FormSection } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type {
  OrganizationType,
  LifecycleStage,
  FounderRole,
  PublicNamingPreference,
} from "@/types/interview";
import {
  ORG_TYPE_LABELS,
  ORG_TYPE_DESCRIPTIONS,
  getBusinessModelsForOrgType,
  LIFECYCLE_STAGE_LABELS,
  LIFECYCLE_STAGE_DESCRIPTIONS,
} from "@/data/function-matrix";

// Wizard steps for Organization creation (full flow)
const FULL_STEPS = [
  { id: "basics", label: "The Basics", description: "Tell us about the organization" },
  { id: "timeline", label: "Timeline", description: "When did this organization exist?" },
  { id: "about-you", label: "About You", description: "Your relationship to this organization" },
];

// Wizard steps for adding story to existing organization
const ADD_STORY_STEPS = [
  { id: "about-you", label: "About You", description: "Your relationship to this organization" },
];

// Organization data state
interface OrganizationFormData {
  // Step 1: The Basics
  name: string;
  description: string;
  organizationType: OrganizationType | null;
  businessModel: string | null;
  industry: string | null;
  location: {
    country: string | null;
    city: string | null;
  };

  // Step 2: Timeline
  foundedDate: string | null;
  closedDate: string | null;
  stageAtClosure: LifecycleStage | null;
  peakTeamSize: number | null;

  // Step 3: About You
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
}

const createEmptyFormData = (): OrganizationFormData => ({
  name: "",
  description: "",
  organizationType: null,
  businessModel: null,
  industry: null,
  location: { country: null, city: null },
  foundedDate: null,
  closedDate: null,
  stageAtClosure: null,
  peakTeamSize: null,
  founderRole: null,
  publicNaming: null,
});

// Existing organization data (when adding story to existing org)
interface ExistingOrganization {
  id: string;
  name: string;
  description: string | null;
  organization_type: OrganizationType | null;
}

/**
 * Organization Creation Wizard Content
 * Creates an organization and optionally starts an interview.
 * When `org` param is provided, skips org creation and only creates a story.
 */
function OrganizationCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const returnTo = searchParams.get("returnTo"); // e.g., "interview"
  const existingOrgId = searchParams.get("org"); // Existing org ID for adding story

  const [formData, setFormData] = React.useState<OrganizationFormData>(createEmptyFormData);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string | null>(null);
  const [existingOrg, setExistingOrg] = React.useState<ExistingOrganization | null>(null);

  // Use different steps based on whether we're adding to existing org
  const STEPS = existingOrgId ? ADD_STORY_STEPS : FULL_STEPS;

  // Check auth and load existing org if needed
  React.useEffect(() => {
    async function initialize() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        const redirect = existingOrgId
          ? `/organization/create?org=${existingOrgId}&returnTo=${returnTo || ""}`
          : "/organization/create";
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        return;
      }

      // If adding to existing org, load org data
      if (existingOrgId) {
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("id, name, description, organization_type")
          .eq("id", existingOrgId)
          .single();

        if (orgError || !orgData) {
          setError("Organization not found");
          setIsLoading(false);
          return;
        }

        setExistingOrg(orgData as ExistingOrganization);
      }

      setIsLoading(false);
    }
    initialize();
  }, [supabase, router, existingOrgId, returnTo]);

  // Get business models for selected org type
  const businessModels = formData.organizationType
    ? getBusinessModelsForOrgType(formData.organizationType)
    : [];

  // Validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const currentStepId = STEPS[step]?.id;

    if (currentStepId === "basics") {
      if (!formData.name?.trim()) {
        errors.name = "Organization name is required";
      }
      if (!formData.description?.trim()) {
        errors.description = "Please provide a brief description";
      }
      if (!formData.organizationType) {
        errors.organizationType = "Please select an organization type";
      }
    }

    if (currentStepId === "timeline") {
      if (!formData.foundedDate) {
        errors.foundedDate = "Please enter when the organization was founded";
      }
    }

    if (currentStepId === "about-you") {
      if (!formData.founderRole) {
        errors.founderRole = "Please select your role";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    } else {
      // Go back to where we came from
      if (existingOrgId) {
        router.push(`/organization/${existingOrgId}`);
      } else if (returnTo === "interview") {
        router.push("/interview");
      } else {
        router.push("/account");
      }
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setValidationErrors({});
    } else {
      // Complete - create organization and story
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Must be logged in");
      }

      let organizationId: string;

      // Different flows based on whether we're adding to existing org
      if (existingOrg) {
        // Adding story to existing organization - skip org creation
        organizationId = existingOrg.id;
      } else {
        // Full flow - create new organization first
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .insert({
            name: formData.name,
            description: formData.description,
            organization_type: formData.organizationType,
            business_model: formData.businessModel,
            industry: formData.industry,
            location_country: formData.location.country,
            location_city: formData.location.city,
            founded_date: formData.foundedDate,
            closed_date: formData.closedDate,
            stage_at_closure: formData.stageAtClosure,
            peak_team_size: formData.peakTeamSize,
            created_by: user.id,
          })
          .select("id")
          .single();

        if (orgError) {
          throw new Error(orgError.message);
        }

        organizationId = orgData.id;
      }

      // Create story linked to organization
      const basicInfoData = existingOrg
        ? {
            // For existing org, use org data for basic_info
            organizationName: existingOrg.name,
            description: existingOrg.description,
            organizationType: existingOrg.organization_type,
            founderRole: formData.founderRole,
            publicNaming: formData.publicNaming,
            contactEmail: null,
          }
        : {
            // For new org, use form data
            organizationName: formData.name,
            description: formData.description,
            organizationType: formData.organizationType,
            businessModel: formData.businessModel,
            industry: formData.industry,
            location: formData.location,
            foundedDate: formData.foundedDate,
            closedDate: formData.closedDate,
            stageAtClosure: formData.stageAtClosure,
            peakTeamSize: formData.peakTeamSize,
            founderRole: formData.founderRole,
            publicNaming: formData.publicNaming,
            contactEmail: null,
          };

      const { data: storyData, error: storyError } = await supabase
        .from("stories")
        .insert({
          organization_id: organizationId,
          user_id: user.id,
          status: "in_progress",
          current_module: "functional",
          completed_modules: ["basic_info"],
          founder_role: formData.founderRole,
          public_naming: formData.publicNaming,
          basic_info: basicInfoData,
        })
        .select("id")
        .single();

      if (storyError) {
        throw new Error(storyError.message);
      }

      // Navigate to interview
      router.push(`/interview/${storyData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create story");
      setIsSubmitting(false);
    }
  };

  // Update handlers
  const handleTextChange =
    (field: keyof OrganizationFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };

  const handleSelectChange = (field: keyof OrganizationFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleOrgTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationType: value as OrganizationType,
      businessModel: null, // Reset business model when org type changes
    }));
    if (validationErrors.organizationType) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.organizationType;
        return next;
      });
    }
  };

  const handleLocationChange =
    (field: "country" | "city") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: e.target.value || null,
        },
      }));
    };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-gradient flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Determine cancel href
  const cancelHref = existingOrgId
    ? `/organization/${existingOrgId}`
    : returnTo === "interview"
      ? "/interview"
      : "/account";

  // Determine next button label
  const nextLabel =
    currentStep === STEPS.length - 1
      ? existingOrg
        ? "Add Story & Continue"
        : "Create & Continue"
      : "Continue";

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={cancelHref}
      isLoading={isSubmitting}
      nextLabel={nextLabel}
    >
      {/* Header for existing org */}
      {existingOrg && (
        <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-400">Adding your story to</p>
          <p className="font-medium text-marble-100">{existingOrg.name}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-md text-red-300">
          {error}
        </div>
      )}

      {/* Step: The Basics (full flow only) */}
      {STEPS[currentStep]?.id === "basics" && (
        <div className="space-y-6">
          <FormField
            variant="dark"
            label="Organization Name"
            htmlFor="name"
            required
            error={validationErrors.name}
          >
            <Input
              variant="dark"
              id="name"
              value={formData.name}
              onChange={handleTextChange("name")}
              placeholder="What was it called?"
              error={!!validationErrors.name}
            />
          </FormField>

          <FormField
            variant="dark"
            label="What did it do?"
            htmlFor="description"
            required
            error={validationErrors.description}
            hint="In one sentence, describe what the organization did"
          >
            <Textarea
              variant="dark"
              id="description"
              value={formData.description}
              onChange={handleTextChange("description")}
              placeholder="e.g., A B2B SaaS platform that helped small businesses manage inventory"
              rows={2}
              error={!!validationErrors.description}
            />
          </FormField>

          <FormField
            variant="dark"
            label="Organization Type"
            required
            error={validationErrors.organizationType}
          >
            <RadioGroup
              value={formData.organizationType || ""}
              onValueChange={handleOrgTypeChange}
              className="grid gap-3 sm:grid-cols-2"
            >
              {(Object.keys(ORG_TYPE_LABELS) as OrganizationType[]).map((type) => (
                <div key={type} className="relative">
                  <RadioGroupItem value={type} id={type} className="peer sr-only" />
                  <Label
                    htmlFor={type}
                    className="flex flex-col p-4 border rounded-lg cursor-pointer border-slate-600 hover:border-gold-500/50 peer-data-[state=checked]:border-gold-500 peer-data-[state=checked]:bg-gold-500/10 transition-colors"
                  >
                    <span className="font-medium text-marble-100">{ORG_TYPE_LABELS[type]}</span>
                    <span className="text-sm text-slate-400">{ORG_TYPE_DESCRIPTIONS[type]}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          {formData.organizationType && businessModels.length > 0 && (
            <FormField variant="dark" label="Business Model" htmlFor="businessModel">
              <Select
                value={formData.businessModel || ""}
                onValueChange={handleSelectChange("businessModel")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                  {businessModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <FormField variant="dark" label="Industry" htmlFor="industry">
            <Input
              variant="dark"
              id="industry"
              value={formData.industry || ""}
              onChange={handleTextChange("industry")}
              placeholder="e.g., Fintech, Healthcare, Education"
            />
          </FormField>

          <FormSection variant="dark" title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField variant="dark" label="Country" htmlFor="country">
                <Input
                  variant="dark"
                  id="country"
                  value={formData.location.country || ""}
                  onChange={handleLocationChange("country")}
                  placeholder="Country"
                />
              </FormField>
              <FormField variant="dark" label="City" htmlFor="city">
                <Input
                  variant="dark"
                  id="city"
                  value={formData.location.city || ""}
                  onChange={handleLocationChange("city")}
                  placeholder="City"
                />
              </FormField>
            </div>
          </FormSection>
        </div>
      )}

      {/* Step: Timeline (full flow only) */}
      {STEPS[currentStep]?.id === "timeline" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              variant="dark"
              label="When was it founded?"
              htmlFor="foundedDate"
              required
              error={validationErrors.foundedDate}
            >
              <Input
                variant="dark"
                id="foundedDate"
                type="month"
                value={formData.foundedDate || ""}
                onChange={handleTextChange("foundedDate")}
                error={!!validationErrors.foundedDate}
              />
            </FormField>

            <FormField variant="dark" label="When did it close?" htmlFor="closedDate">
              <Input
                variant="dark"
                id="closedDate"
                type="month"
                value={formData.closedDate || ""}
                onChange={handleTextChange("closedDate")}
              />
            </FormField>
          </div>

          <FormField variant="dark" label="What stage was it at when it closed?">
            <RadioGroup
              value={formData.stageAtClosure || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, stageAtClosure: value as LifecycleStage }))
              }
              className="grid gap-3 sm:grid-cols-2"
            >
              {(Object.keys(LIFECYCLE_STAGE_LABELS) as LifecycleStage[]).map((stage) => (
                <div key={stage} className="relative">
                  <RadioGroupItem value={stage} id={`stage-${stage}`} className="peer sr-only" />
                  <Label
                    htmlFor={`stage-${stage}`}
                    className="flex flex-col p-4 border rounded-lg cursor-pointer border-slate-600 hover:border-gold-500/50 peer-data-[state=checked]:border-gold-500 peer-data-[state=checked]:bg-gold-500/10 transition-colors"
                  >
                    <span className="font-medium text-marble-100">
                      {LIFECYCLE_STAGE_LABELS[stage]}
                    </span>
                    <span className="text-sm text-slate-400">
                      {LIFECYCLE_STAGE_DESCRIPTIONS[stage]}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          <FormField
            variant="dark"
            label="Peak team size"
            htmlFor="peakTeamSize"
            hint="How many people at its largest?"
          >
            <Input
              variant="dark"
              id="peakTeamSize"
              type="number"
              min={1}
              value={formData.peakTeamSize || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  peakTeamSize: parseInt(e.target.value) || null,
                }))
              }
              placeholder="e.g., 25"
            />
          </FormField>
        </div>
      )}

      {/* Step: About You */}
      {STEPS[currentStep]?.id === "about-you" && (
        <div className="space-y-6">
          <FormField
            variant="dark"
            label="What was your role?"
            required
            error={validationErrors.founderRole}
          >
            <RadioGroup
              value={formData.founderRole || ""}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, founderRole: value as FounderRole }));
                if (validationErrors.founderRole) {
                  setValidationErrors((prev) => {
                    const next = { ...prev };
                    delete next.founderRole;
                    return next;
                  });
                }
              }}
              className="space-y-2"
            >
              {[
                { value: "founder", label: "Founder" },
                { value: "cofounder", label: "Co-founder" },
                { value: "ceo_non_founder", label: "CEO (non-founder)" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`role-${option.value}`} />
                  <Label
                    htmlFor={`role-${option.value}`}
                    className="cursor-pointer text-marble-100"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          <FormField
            variant="dark"
            label="Are you comfortable being named publicly?"
            hint="Your story can be shared anonymously if you prefer"
          >
            <RadioGroup
              value={formData.publicNaming || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, publicNaming: value as PublicNamingPreference }))
              }
              className="space-y-2"
            >
              {[
                { value: "yes", label: "Yes, I can be named" },
                { value: "no", label: "No, keep me anonymous" },
                { value: "decide_later", label: "I'll decide later" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`naming-${option.value}`} />
                  <Label
                    htmlFor={`naming-${option.value}`}
                    className="cursor-pointer text-marble-100"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>
        </div>
      )}
    </WizardLayout>
  );
}

/**
 * Organization Creation Page with Suspense boundary for useSearchParams
 */
export default function OrganizationCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-gradient flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <OrganizationCreateContent />
    </Suspense>
  );
}
