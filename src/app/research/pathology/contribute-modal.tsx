"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Cog,
  FileText,
  Lightbulb,
  Send,
  AlertCircle,
} from "lucide-react";

// Types
interface FormData {
  contributor_name: string;
  contributor_email: string;
  contributor_affiliation: string;
  name: string;
  definition: string;
  localization: string;
  localization_other: string;
  primary_etiology: string;
  etiology_other: string;
  typical_course: string;
  course_other: string;
  alternative_names: string;
  diagnostic_criteria: string;
  symptoms: string;
  risk_factors: string;
  known_cases: string;
  rationale: string;
  supporting_references: string;
}

const initialFormData: FormData = {
  contributor_name: "",
  contributor_email: "",
  contributor_affiliation: "",
  name: "",
  definition: "",
  localization: "",
  localization_other: "",
  primary_etiology: "",
  etiology_other: "",
  typical_course: "",
  course_other: "",
  alternative_names: "",
  diagnostic_criteria: "",
  symptoms: "",
  risk_factors: "",
  known_cases: "",
  rationale: "",
  supporting_references: "",
};

// Step labels for progress indicator
const STEP_LABELS_AUTH = ["Details", "Evidence", "Done"];
const STEP_LABELS_GUEST = ["About You", "Details", "Evidence", "Done"];

// Classification options
const LOCALIZATIONS = [
  { value: "LP", label: "Leadership", icon: User },
  { value: "SP", label: "Structural", icon: Building2 },
  { value: "FP", label: "Financial", icon: DollarSign },
  { value: "CP", label: "Cultural", icon: Users },
  { value: "MP", label: "Market", icon: TrendingUp },
  { value: "OP", label: "Operational", icon: Cog },
  { value: "OTHER", label: "Other", icon: FileText },
];

const ETIOLOGIES = [
  { value: "ETI-F", label: "Founder-induced" },
  { value: "ETI-M", label: "Market-induced" },
  { value: "ETI-C", label: "Competition-induced" },
  { value: "ETI-R", label: "Regulatory-induced" },
  { value: "ETI-T", label: "Technology-induced" },
  { value: "ETI-S", label: "Stochastic" },
  { value: "OTHER", label: "Other" },
];

const COURSES = [
  { value: "ACU", label: "Acute" },
  { value: "CHR", label: "Chronic" },
  { value: "REL", label: "Relapsing" },
  { value: "LAT", label: "Latent" },
  { value: "OTHER", label: "Other" },
];

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContributeModal({ isOpen, onClose }: ContributeModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check auth and pre-fill user data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const checkAuth = async () => {
      setAuthLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile for display_name
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();

        const displayName =
          profile?.display_name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "";

        setFormData((prev) => ({
          ...prev,
          contributor_name: displayName,
          contributor_email: user.email || "",
        }));
        setIsAuthenticated(true);
        setStep(2); // Skip step 1 for authenticated users
      } else {
        setIsAuthenticated(false);
        setStep(1);
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: string[] = [];

    if (currentStep === 1) {
      if (!formData.contributor_name.trim()) newErrors.push("Name is required");
      if (!formData.contributor_email.trim()) newErrors.push("Email is required");
      if (
        formData.contributor_email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contributor_email)
      ) {
        newErrors.push("Please enter a valid email");
      }
    }

    if (currentStep === 2) {
      if (!formData.name.trim()) newErrors.push("Pathology name is required");
      if (!formData.definition.trim()) newErrors.push("Definition is required");
      if (!formData.localization) newErrors.push("Localization is required");
      if (formData.localization === "OTHER" && !formData.localization_other.trim()) {
        newErrors.push("Please specify the localization type");
      }
      if (!formData.primary_etiology) newErrors.push("Primary etiology is required");
      if (formData.primary_etiology === "OTHER" && !formData.etiology_other.trim()) {
        newErrors.push("Please specify the etiology type");
      }
      if (!formData.typical_course) newErrors.push("Typical course is required");
      if (formData.typical_course === "OTHER" && !formData.course_other.trim()) {
        newErrors.push("Please specify the course type");
      }
    }

    if (currentStep === 3) {
      if (!formData.rationale.trim()) newErrors.push("Please explain why this should be added");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const minStep = isAuthenticated ? 2 : 1;
  const prevStep = () => setStep((s) => Math.max(s - 1, minStep));

  // For display: authenticated users see 3 steps (1-3), others see 4 steps (1-4)
  const totalSteps = isAuthenticated ? 3 : 4;
  const displayStep = isAuthenticated ? step - 1 : step;
  const stepLabels = isAuthenticated ? STEP_LABELS_AUTH : STEP_LABELS_GUEST;

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Handle "Other" values - use the custom text if OTHER is selected
      const localizationValue =
        formData.localization === "OTHER"
          ? `OTHER: ${formData.localization_other}`
          : formData.localization;
      const etiologyValue =
        formData.primary_etiology === "OTHER"
          ? `OTHER: ${formData.etiology_other}`
          : formData.primary_etiology;
      const courseValue =
        formData.typical_course === "OTHER"
          ? `OTHER: ${formData.course_other}`
          : formData.typical_course;

      const proposed_data = {
        name: formData.name,
        definition: formData.definition,
        localization: localizationValue,
        primary_etiology: etiologyValue,
        typical_course: courseValue,
        alternative_names: formData.alternative_names
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        diagnostic_criteria: formData.diagnostic_criteria
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        symptoms: formData.symptoms
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        risk_factors: formData.risk_factors
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        known_cases: formData.known_cases
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/pathologies/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contribution_type: "new_pathology",
          contributor_name: formData.contributor_name,
          contributor_email: formData.contributor_email,
          contributor_affiliation: formData.contributor_affiliation || null,
          proposed_data,
          rationale: formData.rationale,
          supporting_references: formData.supporting_references
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: result.message });
        setStep(4);
      } else {
        setSubmitResult({ success: false, message: result.error || "Submission failed" });
      }
    } catch {
      setSubmitResult({ success: false, message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setStep(isAuthenticated ? 2 : 1);
    setSubmitResult(null);
    setErrors([]);
    setIsAuthenticated(false);
    setAuthLoading(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-display text-xl font-medium text-marble-100">
              Propose a Pathology
            </h2>
            <p className="text-sm text-slate-400">
              Step {displayStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-marble-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      s < displayStep
                        ? "bg-gold-500 text-slate-900"
                        : s === displayStep
                          ? "bg-gold-500/20 text-gold-400 border border-gold-500"
                          : "bg-slate-700 text-slate-500"
                    }`}
                  >
                    {s < displayStep ? <Check className="w-3 h-3" /> : s}
                  </div>
                  <span
                    className={`text-xs ${s === displayStep ? "text-gold-400" : "text-slate-500"}`}
                  >
                    {stepLabels[s - 1]}
                  </span>
                </div>
                {s < totalSteps && (
                  <div
                    className={`flex-1 h-0.5 mb-5 ${s < displayStep ? "bg-gold-500" : "bg-slate-700"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading state */}
          {authLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400" />
            </div>
          )}

          {!authLoading && (
            <>
              {/* Errors */}
              {errors.length > 0 && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      {errors.map((error, i) => (
                        <p key={i} className="text-red-400 text-sm">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Contributor Info (only for non-authenticated users) */}
              {step === 1 && !isAuthenticated && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-gold-400" />
                    <h3 className="font-display text-lg font-medium text-marble-100">About You</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contributor_name}
                      onChange={(e) => updateField("contributor_name", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.contributor_email}
                      onChange={(e) => updateField("contributor_email", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      placeholder="jane.smith@university.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Affiliation <span className="text-slate-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contributor_affiliation}
                      onChange={(e) => updateField("contributor_affiliation", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      placeholder="Stanford Graduate School of Business"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pathology Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gold-400" />
                    <h3 className="font-display text-lg font-medium text-marble-100">
                      Pathology Details
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Pathology Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      placeholder="e.g., Strategic Paralysis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Definition <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.definition}
                      onChange={(e) => updateField("definition", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                      placeholder="A clinical definition of the organizational pathology..."
                    />
                  </div>

                  {/* Classification Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Localization <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.localization}
                        onChange={(e) => updateField("localization", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      >
                        <option value="">Select...</option>
                        {LOCALIZATIONS.map((loc) => (
                          <option key={loc.value} value={loc.value}>
                            {loc.value === "OTHER" ? loc.label : `${loc.value} - ${loc.label}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Etiology <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.primary_etiology}
                        onChange={(e) => updateField("primary_etiology", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      >
                        <option value="">Select...</option>
                        {ETIOLOGIES.map((eti) => (
                          <option key={eti.value} value={eti.value}>
                            {eti.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Course <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.typical_course}
                        onChange={(e) => updateField("typical_course", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      >
                        <option value="">Select...</option>
                        {COURSES.map((course) => (
                          <option key={course.value} value={course.value}>
                            {course.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* "Other" text inputs - shown conditionally */}
                  {(formData.localization === "OTHER" ||
                    formData.primary_etiology === "OTHER" ||
                    formData.typical_course === "OTHER") && (
                    <div className="grid grid-cols-3 gap-3">
                      {formData.localization === "OTHER" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Specify Localization <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.localization_other}
                            onChange={(e) => updateField("localization_other", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                            placeholder="e.g., Strategic Pathology"
                          />
                        </div>
                      )}
                      {formData.primary_etiology === "OTHER" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Specify Etiology <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.etiology_other}
                            onChange={(e) => updateField("etiology_other", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                            placeholder="e.g., Culture-induced"
                          />
                        </div>
                      )}
                      {formData.typical_course === "OTHER" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Specify Course <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.course_other}
                            onChange={(e) => updateField("course_other", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                            placeholder="e.g., Progressive"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Diagnostic Criteria <span className="text-slate-500">(one per line)</span>
                    </label>
                    <textarea
                      value={formData.diagnostic_criteria}
                      onChange={(e) => updateField("diagnostic_criteria", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                      placeholder="Observable indicators..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Known Cases <span className="text-slate-500">(one per line)</span>
                    </label>
                    <textarea
                      value={formData.known_cases}
                      onChange={(e) => updateField("known_cases", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                      placeholder="Organizations that experienced this..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Evidence & Rationale */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-gold-400" />
                    <h3 className="font-display text-lg font-medium text-marble-100">
                      Evidence & Rationale
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Why should this be included? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.rationale}
                      onChange={(e) => updateField("rationale", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                      placeholder="Explain why this pathology is distinct and important..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Supporting References <span className="text-slate-500">(one per line)</span>
                    </label>
                    <textarea
                      value={formData.supporting_references}
                      onChange={(e) => updateField("supporting_references", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                      placeholder="Author, A. (Year). Title. Journal."
                    />
                  </div>

                  {/* Summary */}
                  <Card variant="dark" padding="sm" className="bg-slate-800/50">
                    <p className="text-xs text-slate-500 mb-2">Summary</p>
                    <p className="text-sm text-marble-100">{formData.name || "(no name)"}</p>
                    <p className="text-xs text-slate-400">
                      {formData.localization || "?"} / {formData.primary_etiology || "?"} /{" "}
                      {formData.typical_course || "?"}
                    </p>
                  </Card>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && submitResult?.success && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-marble-100 mb-2">
                    Contribution Submitted
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">
                    We&apos;ll review your proposal and notify you at{" "}
                    <strong className="text-marble-100">{formData.contributor_email}</strong>
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 rounded-lg transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Error after submit */}
              {submitResult && !submitResult.success && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{submitResult.message}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step < 4 && !authLoading && (
          <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === minStep}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                step === minStep
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:text-marble-100"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-1 px-4 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 rounded-lg transition-colors text-sm"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-slate-900 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
