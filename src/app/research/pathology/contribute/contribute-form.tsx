"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import {
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
type ContributionType = "new_pathology" | "edit_pathology" | "add_case" | "add_reference";

interface FormData {
  // Contributor
  contributor_name: string;
  contributor_email: string;
  contributor_affiliation: string;
  // Contribution type
  contribution_type: ContributionType;
  target_pathology_id: string;
  // Proposed pathology (for new_pathology)
  name: string;
  definition: string;
  localization: string;
  primary_etiology: string;
  typical_course: string;
  alternative_names: string;
  diagnostic_criteria: string;
  symptoms: string;
  risk_factors: string;
  known_cases: string;
  // For add_case or add_reference
  content: string;
  // Common
  rationale: string;
  supporting_references: string;
}

const initialFormData: FormData = {
  contributor_name: "",
  contributor_email: "",
  contributor_affiliation: "",
  contribution_type: "new_pathology",
  target_pathology_id: "",
  name: "",
  definition: "",
  localization: "",
  primary_etiology: "",
  typical_course: "",
  alternative_names: "",
  diagnostic_criteria: "",
  symptoms: "",
  risk_factors: "",
  known_cases: "",
  content: "",
  rationale: "",
  supporting_references: "",
};

// Classification options
const LOCALIZATIONS = [
  { value: "LP", label: "Leadership Pathology", icon: User },
  { value: "SP", label: "Structural Pathology", icon: Building2 },
  { value: "FP", label: "Financial Pathology", icon: DollarSign },
  { value: "CP", label: "Cultural Pathology", icon: Users },
  { value: "MP", label: "Market Pathology", icon: TrendingUp },
  { value: "OP", label: "Operational Pathology", icon: Cog },
];

const ETIOLOGIES = [
  { value: "ETI-F", label: "Founder-induced", description: "Caused by founder decisions/behavior" },
  { value: "ETI-M", label: "Market-induced", description: "Caused by market conditions" },
  { value: "ETI-C", label: "Competition-induced", description: "Caused by competitive pressure" },
  { value: "ETI-R", label: "Regulatory-induced", description: "Caused by regulatory changes" },
  { value: "ETI-T", label: "Technology-induced", description: "Caused by tech disruption" },
  { value: "ETI-S", label: "Stochastic", description: "Random/bad luck" },
  {
    value: "ETI-I",
    label: "Iatrogenic",
    description: "Success-induced (own success becomes weakness)",
  },
  { value: "ETI-E", label: "External", description: "Shock/trauma from external events" },
];

const COURSES = [
  { value: "ACU", label: "Acute", description: "Sudden onset, rapid progression" },
  { value: "CHR", label: "Chronic", description: "Slow decline over time" },
  { value: "REL", label: "Relapsing", description: "Recurring crisis cycles" },
  { value: "LAT", label: "Latent", description: "Hidden, manifests later" },
];

export function ContributeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [errors, setErrors] = useState<string[]>([]);

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

    if (currentStep === 2 && formData.contribution_type === "new_pathology") {
      if (!formData.name.trim()) newErrors.push("Pathology name is required");
      if (!formData.definition.trim()) newErrors.push("Definition is required");
      if (!formData.localization) newErrors.push("Localization is required");
      if (!formData.primary_etiology) newErrors.push("Primary etiology is required");
      if (!formData.typical_course) newErrors.push("Typical course is required");
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

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Build proposed_data based on contribution type
      let proposed_data: Record<string, unknown> = {};

      if (formData.contribution_type === "new_pathology") {
        proposed_data = {
          name: formData.name,
          definition: formData.definition,
          localization: formData.localization,
          primary_etiology: formData.primary_etiology,
          typical_course: formData.typical_course,
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
      } else {
        proposed_data = { content: formData.content };
      }

      const response = await fetch("/api/pathologies/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contribution_type: formData.contribution_type,
          target_pathology_id: formData.target_pathology_id || null,
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

  return (
    <>
      {/* Header */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            href="/research/pathology"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pathology Classification
          </Link>

          <SectionLabel>Community Contribution</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-marble-100">
            Propose a Pathology
          </h1>
          <p className="text-slate-400 text-lg">
            Help build the definitive taxonomy of organizational diseases. Your contribution will be
            reviewed by our academic maintainers.
          </p>
        </div>
      </section>

      {/* Progress */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s < step
                      ? "bg-gold-500 text-slate-900"
                      : s === step
                        ? "bg-gold-500/20 text-gold-400 border border-gold-500"
                        : "bg-slate-700 text-slate-500"
                  }`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-0.5 ${s < step ? "bg-gold-500" : "bg-slate-700"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>About You</span>
            <span>Pathology Details</span>
            <span>Evidence</span>
            <span>Complete</span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto px-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
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

          {/* Step 1: Contributor Info */}
          {step === 1 && (
            <Card variant="dark" padding="lg">
              <h2 className="font-display text-xl font-medium text-marble-100 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gold-400" />
                About You
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contributor_name}
                    onChange={(e) => updateField("contributor_name", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.contributor_email}
                    onChange={(e) => updateField("contributor_email", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="jane.smith@university.edu"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    We&apos;ll notify you when your contribution is reviewed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Affiliation <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contributor_affiliation}
                    onChange={(e) => updateField("contributor_affiliation", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="Stanford Graduate School of Business"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Pathology Details */}
          {step === 2 && (
            <Card variant="dark" padding="lg">
              <h2 className="font-display text-xl font-medium text-marble-100 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-400" />
                Pathology Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pathology Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="e.g., Strategic Paralysis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alternative Names <span className="text-slate-500">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.alternative_names}
                    onChange={(e) => updateField("alternative_names", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="Analysis Paralysis, Decision Freeze"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Definition <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.definition}
                    onChange={(e) => updateField("definition", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="A clear, clinical definition of the organizational pathology..."
                  />
                </div>

                {/* Localization */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Localization <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LOCALIZATIONS.map((loc) => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => updateField("localization", loc.value)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.localization === loc.value
                            ? "bg-gold-500/20 border-gold-500 text-gold-400"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <loc.icon className="w-4 h-4 mb-1" />
                        <span className="text-sm font-medium block">{loc.value}</span>
                        <span className="text-xs opacity-70">
                          {loc.label.replace(" Pathology", "")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Etiology */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Primary Etiology <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ETIOLOGIES.map((eti) => (
                      <button
                        key={eti.value}
                        type="button"
                        onClick={() => updateField("primary_etiology", eti.value)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.primary_etiology === eti.value
                            ? "bg-gold-500/20 border-gold-500 text-gold-400"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <span className="text-sm font-medium block">{eti.label}</span>
                        <span className="text-xs opacity-70">{eti.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Typical Course <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {COURSES.map((course) => (
                      <button
                        key={course.value}
                        type="button"
                        onClick={() => updateField("typical_course", course.value)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.typical_course === course.value
                            ? "bg-gold-500/20 border-gold-500 text-gold-400"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <span className="text-sm font-medium block">{course.label}</span>
                        <span className="text-xs opacity-70">{course.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional details */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Diagnostic Criteria <span className="text-slate-500">(one per line)</span>
                  </label>
                  <textarea
                    value={formData.diagnostic_criteria}
                    onChange={(e) => updateField("diagnostic_criteria", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="Observable indicators that diagnose this pathology..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Symptoms <span className="text-slate-500">(one per line)</span>
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => updateField("symptoms", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="How this pathology manifests in the organization..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Known Cases <span className="text-slate-500">(one per line)</span>
                  </label>
                  <textarea
                    value={formData.known_cases}
                    onChange={(e) => updateField("known_cases", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="Organizations that experienced this pathology..."
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Evidence & Rationale */}
          {step === 3 && (
            <Card variant="dark" padding="lg">
              <h2 className="font-display text-xl font-medium text-marble-100 mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-gold-400" />
                Evidence & Rationale
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Why should this be included? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.rationale}
                    onChange={(e) => updateField("rationale", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="Explain why this pathology is distinct, important, and belongs in the classification..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Consider: What makes this distinct from existing pathologies? What evidence
                    supports its inclusion?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Supporting References <span className="text-slate-500">(one per line)</span>
                  </label>
                  <textarea
                    value={formData.supporting_references}
                    onChange={(e) => updateField("supporting_references", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="Author, A. (Year). Title. Journal.&#10;Author, B. (Year). Another paper. Conference."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Academic citations strengthen your proposal
                  </p>
                </div>

                {/* Summary Preview */}
                <div className="pt-6 border-t border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Submission Summary</h3>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-sm">
                    <p className="text-slate-400">
                      <span className="text-slate-500">Contributor:</span>{" "}
                      <span className="text-marble-100">{formData.contributor_name}</span>
                      {formData.contributor_affiliation && (
                        <span className="text-slate-500">
                          {" "}
                          ({formData.contributor_affiliation})
                        </span>
                      )}
                    </p>
                    <p className="text-slate-400">
                      <span className="text-slate-500">Pathology:</span>{" "}
                      <span className="text-marble-100">{formData.name || "(not set)"}</span>
                    </p>
                    <p className="text-slate-400">
                      <span className="text-slate-500">Classification:</span>{" "}
                      <span className="text-gold-400">{formData.localization || "?"}</span>
                      {" / "}
                      <span>{formData.primary_etiology || "?"}</span>
                      {" / "}
                      <span>{formData.typical_course || "?"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Success */}
          {step === 4 && submitResult?.success && (
            <Card variant="dark" padding="lg" className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
                Contribution Submitted
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Thank you for contributing to the SOIL Pathology Classification. Our academic
                maintainers will review your proposal and notify you at{" "}
                <strong className="text-marble-100">{formData.contributor_email}</strong>.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/research/pathology"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-marble-100 rounded-lg transition-colors"
                >
                  View Classification
                </Link>
                <button
                  onClick={() => {
                    setFormData(initialFormData);
                    setStep(1);
                    setSubmitResult(null);
                  }}
                  className="px-6 py-3 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 rounded-lg transition-colors"
                >
                  Submit Another
                </button>
              </div>
            </Card>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  step === 1
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
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 rounded-lg transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-slate-900 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Proposal
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Error after submit */}
          {submitResult && !submitResult.success && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{submitResult.message}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
