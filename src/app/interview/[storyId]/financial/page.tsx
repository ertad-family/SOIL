"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Info,
} from "lucide-react";
import type {
  FinancialEvent,
  FinancialEventCategory,
  UploadedFile,
  ImpactSeverity,
  EssentialMetricType,
  EssentialMetrics,
  MetricTrend,
  ProfitabilityStatus,
  CurrencyCode,
} from "@/types/interview";
import { createEmptyEssentialMetrics } from "@/types/interview";

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  { id: "financial", label: "Financial Picture", description: "Metrics and events" },
  { id: "documents", label: "Documents", description: "Upload supporting documents (optional)" },
];

// =============================================================================
// CURRENCY CONFIGURATION
// =============================================================================

const CURRENCY_OPTIONS: Array<{ value: CurrencyCode; label: string; symbol: string }> = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "CAD", label: "Canadian Dollar", symbol: "CA$" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$" },
  { value: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { value: "INR", label: "Indian Rupee", symbol: "₹" },
  { value: "BRL", label: "Brazilian Real", symbol: "R$" },
  { value: "MXN", label: "Mexican Peso", symbol: "MX$" },
  { value: "RUB", label: "Russian Ruble", symbol: "₽" },
  { value: "KRW", label: "South Korean Won", symbol: "₩" },
  { value: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { value: "HKD", label: "Hong Kong Dollar", symbol: "HK$" },
  { value: "SEK", label: "Swedish Krona", symbol: "kr" },
  { value: "NOK", label: "Norwegian Krone", symbol: "kr" },
  { value: "DKK", label: "Danish Krone", symbol: "kr" },
  { value: "PLN", label: "Polish Zloty", symbol: "zł" },
  { value: "ILS", label: "Israeli Shekel", symbol: "₪" },
  { value: "ZAR", label: "South African Rand", symbol: "R" },
  { value: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { value: "THB", label: "Thai Baht", symbol: "฿" },
  { value: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { value: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { value: "PHP", label: "Philippine Peso", symbol: "₱" },
  { value: "VND", label: "Vietnamese Dong", symbol: "₫" },
  { value: "NZD", label: "New Zealand Dollar", symbol: "NZ$" },
  { value: "CZK", label: "Czech Koruna", symbol: "Kč" },
  { value: "HUF", label: "Hungarian Forint", symbol: "Ft" },
  { value: "TRY", label: "Turkish Lira", symbol: "₺" },
  { value: "UAH", label: "Ukrainian Hryvnia", symbol: "₴" },
  { value: "CLP", label: "Chilean Peso", symbol: "CL$" },
  { value: "COP", label: "Colombian Peso", symbol: "CO$" },
  { value: "PEN", label: "Peruvian Sol", symbol: "S/" },
  { value: "ARS", label: "Argentine Peso", symbol: "AR$" },
];

/** Map country codes to their default currency */
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // North America
  "United States": "USD",
  USA: "USD",
  US: "USD",
  Canada: "CAD",
  CA: "CAD",
  Mexico: "MXN",
  MX: "MXN",
  // Europe
  "United Kingdom": "GBP",
  UK: "GBP",
  GB: "GBP",
  Germany: "EUR",
  DE: "EUR",
  France: "EUR",
  FR: "EUR",
  Italy: "EUR",
  IT: "EUR",
  Spain: "EUR",
  ES: "EUR",
  Netherlands: "EUR",
  NL: "EUR",
  Belgium: "EUR",
  BE: "EUR",
  Austria: "EUR",
  AT: "EUR",
  Ireland: "EUR",
  IE: "EUR",
  Portugal: "EUR",
  PT: "EUR",
  Finland: "EUR",
  FI: "EUR",
  Greece: "EUR",
  GR: "EUR",
  Switzerland: "CHF",
  CH: "CHF",
  Sweden: "SEK",
  SE: "SEK",
  Norway: "NOK",
  NO: "NOK",
  Denmark: "DKK",
  DK: "DKK",
  Poland: "PLN",
  PL: "PLN",
  "Czech Republic": "CZK",
  Czechia: "CZK",
  CZ: "CZK",
  Hungary: "HUF",
  HU: "HUF",
  Ukraine: "UAH",
  UA: "UAH",
  Russia: "RUB",
  RU: "RUB",
  Turkey: "TRY",
  TR: "TRY",
  // Asia Pacific
  Japan: "JPY",
  JP: "JPY",
  China: "CNY",
  CN: "CNY",
  India: "INR",
  IN: "INR",
  "South Korea": "KRW",
  Korea: "KRW",
  KR: "KRW",
  Singapore: "SGD",
  SG: "SGD",
  "Hong Kong": "HKD",
  HK: "HKD",
  Thailand: "THB",
  TH: "THB",
  Indonesia: "IDR",
  ID: "IDR",
  Malaysia: "MYR",
  MY: "MYR",
  Philippines: "PHP",
  PH: "PHP",
  Vietnam: "VND",
  VN: "VND",
  Australia: "AUD",
  AU: "AUD",
  "New Zealand": "NZD",
  NZ: "NZD",
  // Middle East & Africa
  Israel: "ILS",
  IL: "ILS",
  "United Arab Emirates": "AED",
  UAE: "AED",
  AE: "AED",
  "South Africa": "ZAR",
  ZA: "ZAR",
  // South America
  Brazil: "BRL",
  BR: "BRL",
  Argentina: "ARS",
  AR: "ARS",
  Chile: "CLP",
  CL: "CLP",
  Colombia: "COP",
  CO: "COP",
  Peru: "PEN",
  PE: "PEN",
};

function getCurrencyForCountry(country: string | null | undefined): CurrencyCode {
  if (!country) return "USD";
  return COUNTRY_TO_CURRENCY[country] ?? "USD";
}

// =============================================================================
// METRICS CONFIGURATION
// =============================================================================

interface MetricConfig {
  type: EssentialMetricType;
  name: string;
  description: string;
}

const ESSENTIAL_METRICS: MetricConfig[] = [
  {
    type: "revenue",
    name: "Revenue",
    description: "Annual revenue at peak and how it changed",
  },
  {
    type: "margins",
    name: "Margins",
    description: "Gross and net margin percentages",
  },
  {
    type: "profitability",
    name: "Profitability",
    description: "Whether you achieved profitability",
  },
  {
    type: "cashPosition",
    name: "Cash Position",
    description: "Burn rate and runway",
  },
  {
    type: "funding",
    name: "Funding",
    description: "Total raised and funding stage",
  },
  {
    type: "customerBase",
    name: "Customer Base",
    description: "Customer count and concentration",
  },
];

// =============================================================================
// FINANCIAL EVENTS CONSTANTS
// =============================================================================

const EVENT_CATEGORIES: Array<{
  value: FinancialEventCategory;
  label: string;
  description: string;
}> = [
  { value: "funding", label: "Funding", description: "Investment rounds, loans, grants" },
  { value: "revenue", label: "Revenue", description: "Revenue milestones, contracts" },
  { value: "cash", label: "Cash", description: "Cash flow and runway events" },
  { value: "costs", label: "Costs", description: "Major expenses, cost cutting" },
  { value: "profitability", label: "Profitability", description: "Profit/loss milestones" },
];

const EVENT_SUBTYPES: Record<FinancialEventCategory, string[]> = {
  funding: [
    "Seed round",
    "Series A",
    "Series B+",
    "Angel investment",
    "Loan",
    "Grant",
    "Revenue-based financing",
    "Failed to close",
    "Other",
  ],
  revenue: [
    "First revenue",
    "Major contract",
    "Lost major customer",
    "Revenue milestone",
    "Recurring revenue achieved",
    "Other",
  ],
  cash: ["Extended runway", "Runway shortened", "Reached critical low", "Cash crisis", "Other"],
  costs: [
    "Major hire/expense",
    "Cost cutting round",
    "Office/infrastructure",
    "Unexpected expense",
    "Other",
  ],
  profitability: ["First profit", "Break even", "Return to loss", "Margin improvement", "Other"],
};

const SEVERITY_OPTIONS: Array<{ value: ImpactSeverity; label: string }> = [
  { value: "minor", label: "Minor - We adapted" },
  { value: "significant", label: "Significant - Changed our trajectory" },
  { value: "critical", label: "Critical - Existential threat" },
];

// =============================================================================
// EVENT CONTEXT GUIDANCE (Issue #134)
// =============================================================================

const FINANCIAL_EVENTS_GUIDANCE = {
  why: "Financial events often precede or follow organizational changes. Understanding the financial story helps identify which financial patterns correlate with different failure modes.",
  what: [
    "Funding events (raises, failed rounds, runway changes)",
    "Revenue milestones (first revenue, lost contracts, growth/decline)",
    "Cash crises or runway concerns",
    "Major cost decisions (hiring, cuts, pivots)",
    "Profitability changes",
  ],
  tip: "Include both positive and negative events. The full financial story—including near-misses and recoveries—is valuable for research.",
};

const LOOKING_BACK_OPTIONS: Array<{
  value: NonNullable<FinancialEvent["lookingBack"]>;
  label: string;
}> = [
  { value: "caught_in_time", label: "We caught this in time" },
  { value: "too_late", label: "We realized too late" },
  { value: "nothing_could_do", label: "Nothing we could do" },
  { value: "made_worse", label: "We made it worse" },
];

// =============================================================================
// RADIO OPTIONS FOR METRICS
// =============================================================================

const TREND_OPTIONS: Array<{ value: MetricTrend; label: string }> = [
  { value: "grew", label: "Growing" },
  { value: "stable", label: "Stable" },
  { value: "declined", label: "Declining" },
  { value: "collapsed", label: "Collapsed" },
];

const PROFITABILITY_STATUS_OPTIONS: Array<{ value: ProfitabilityStatus; label: string }> = [
  { value: "profitable", label: "Reached profitability" },
  { value: "almost", label: "Almost profitable" },
  { value: "never", label: "Never profitable" },
];

type FundingStage = "bootstrapped" | "pre_seed" | "seed" | "series_a" | "series_b_plus";

const FUNDING_STAGE_OPTIONS: Array<{
  value: FundingStage;
  label: string;
}> = [
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "pre_seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b_plus", label: "Series B+" },
];

// =============================================================================
// HELPERS
// =============================================================================

function createEmptyEvent(): FinancialEvent {
  return {
    id: crypto.randomUUID(),
    date: "",
    category: "funding",
    subType: "",
    severity: null,
    responses: [],
    lookingBack: null,
    details: null,
  };
}

function isMetricComplete(metrics: EssentialMetrics | null, type: EssentialMetricType): boolean {
  if (!metrics) return false;
  const metric = metrics[type];
  if (!metric) return false;

  switch (type) {
    case "revenue":
      return metric && "peakAnnual" in metric && metric.peakAnnual !== null;
    case "margins":
      return metric && "grossPercent" in metric && metric.grossPercent !== null;
    case "profitability":
      return metric && "status" in metric && metric.status !== null;
    case "cashPosition":
      return metric && "burnRate" in metric && metric.burnRate !== null;
    case "funding":
      return metric && "stage" in metric && metric.stage !== null;
    case "customerBase":
      return metric && "peakCount" in metric && metric.peakCount !== null;
    default:
      return false;
  }
}

function isEventComplete(event: FinancialEvent): boolean {
  return event.date !== "" && event.subType !== "";
}

// =============================================================================
// RADIO OPTIONS COMPONENT
// =============================================================================

interface RadioOptionProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (value: T) => void;
  name: string;
}

function RadioOptions<T extends string>({ options, value, onChange, name }: RadioOptionProps<T>) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-2.5 cursor-pointer transition-colors",
            value === option.value ? "text-marble-100" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <span
            className={cn(
              "flex items-center justify-center rounded-full border-2 transition-colors w-5 h-5",
              value === option.value
                ? "border-gold-500 bg-gold-500"
                : "border-slate-500 bg-transparent"
            )}
          >
            {value === option.value && <span className="rounded-full bg-slate-900 w-2 h-2" />}
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

// =============================================================================
// OPTION BUTTON COMPONENT
// =============================================================================

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function OptionButton({ selected, onClick, children, className }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-md border text-sm transition-colors",
        selected
          ? "bg-gold-500/20 border-gold-500 text-gold-300"
          : "border-slate-600 text-slate-300 hover:border-slate-500 hover:text-slate-200",
        className
      )}
    >
      {children}
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FinancialPage() {
  const router = useRouter();
  const { story, isLoading, updateFinancialPicture, completeModule } = useInterview();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(["metrics"]) // Start with metrics expanded
  );
  const [expandedMetrics, setExpandedMetrics] = React.useState<Set<string>>(new Set());
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

  // Get data from story
  const essentialMetrics = story?.financialPicture.essentialMetrics ?? null;
  const currency = story?.financialPicture.currency ?? null;
  const events = story?.financialPicture.events ?? [];
  const uploadedFiles = story?.financialPicture.uploadedFiles ?? [];
  const organizationCountry = story?.organization?.location?.country ?? null;

  // Set default currency based on organization country if not already set
  React.useEffect(() => {
    if (story && !currency) {
      const defaultCurrency = getCurrencyForCountry(organizationCountry);
      updateFinancialPicture({ currency: defaultCurrency });
    }
  }, [story, currency, organizationCountry, updateFinancialPicture]);

  // Get the current currency (with fallback)
  const currentCurrency = currency ?? getCurrencyForCountry(organizationCountry);
  const currencyInfo = CURRENCY_OPTIONS.find((c) => c.value === currentCurrency);

  // ==========================================================================
  // CURRENCY HANDLER
  // ==========================================================================

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    if (!story) return;
    updateFinancialPicture({ currency: newCurrency });
  };

  // ==========================================================================
  // METRICS HANDLERS
  // ==========================================================================

  const getOrCreateMetrics = (): EssentialMetrics => {
    return essentialMetrics ?? createEmptyEssentialMetrics();
  };

  const isMetricActive = (type: EssentialMetricType): boolean => {
    if (!essentialMetrics) return false;
    return essentialMetrics[type] !== null;
  };

  const toggleMetric = (type: EssentialMetricType) => {
    if (!story) return;

    const currentMetrics = getOrCreateMetrics();
    const isCurrentlyActive = currentMetrics[type] !== null;

    if (isCurrentlyActive) {
      // Deactivate metric
      updateFinancialPicture({
        essentialMetrics: { ...currentMetrics, [type]: null },
      });
      setExpandedMetrics((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
    } else {
      // Activate metric with empty values
      const emptyMetric = getEmptyMetric(type);
      updateFinancialPicture({
        essentialMetrics: { ...currentMetrics, [type]: emptyMetric },
      });
      setExpandedMetrics((prev) => new Set([...prev, type]));
    }
  };

  const getEmptyMetric = (type: EssentialMetricType) => {
    switch (type) {
      case "revenue":
        return { peakAnnual: null, trend: null };
      case "margins":
        return { grossPercent: null, netPercent: null };
      case "profitability":
        return { status: null, whenAchieved: null, whenLost: null };
      case "cashPosition":
        return { burnRate: null, runwayMonths: null };
      case "funding":
        return { totalRaised: null, stage: null };
      case "customerBase":
        return { peakCount: null, concentrationPercent: null };
    }
  };

  const updateMetric = <K extends EssentialMetricType>(
    type: K,
    updates: Partial<NonNullable<EssentialMetrics[K]>>
  ) => {
    if (!story) return;

    const currentMetrics = getOrCreateMetrics();
    const currentMetric = currentMetrics[type] ?? getEmptyMetric(type);

    updateFinancialPicture({
      essentialMetrics: {
        ...currentMetrics,
        [type]: { ...currentMetric, ...updates },
      },
    });
  };

  const markMetricNotApplicable = (type: EssentialMetricType) => {
    if (!story) return;

    const currentMetrics = getOrCreateMetrics();
    updateFinancialPicture({
      essentialMetrics: { ...currentMetrics, [type]: null },
    });
    setExpandedMetrics((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const addEvent = () => {
    if (!story) return;
    const newEvent = createEmptyEvent();
    updateFinancialPicture({ events: [...events, newEvent] });
    setExpandedEventId(newEvent.id);
  };

  const updateEvent = (eventId: string, updates: Partial<FinancialEvent>) => {
    if (!story) return;
    const updatedEvents = events.map((e) => (e.id === eventId ? { ...e, ...updates } : e));
    // Sort events by date (empty dates go to the end)
    const sortedEvents = [...updatedEvents].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
    updateFinancialPicture({ events: sortedEvents });
  };

  const removeEvent = (eventId: string) => {
    if (!story) return;
    updateFinancialPicture({ events: events.filter((e) => e.id !== eventId) });
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    }
  };

  // ==========================================================================
  // FILE HANDLERS
  // ==========================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!story || !e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      storagePath: "", // Will be set after actual upload
    }));

    updateFinancialPicture({ uploadedFiles: [...uploadedFiles, ...newFiles] });
    e.target.value = "";
  };

  const removeFile = (fileId: string) => {
    if (!story) return;
    updateFinancialPicture({ uploadedFiles: uploadedFiles.filter((f) => f.id !== fileId) });
  };

  // ==========================================================================
  // CATEGORY HANDLERS
  // ==========================================================================

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleMetricExpand = (metricId: string) => {
    setExpandedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(metricId)) {
        next.delete(metricId);
      } else {
        next.add(metricId);
      }
      return next;
    });
  };

  const handleMetricDone = (metricId: string) => {
    setExpandedMetrics((prev) => {
      const next = new Set(prev);
      next.delete(metricId);
      return next;
    });
  };

  // ==========================================================================
  // PROGRESS CALCULATION
  // ==========================================================================

  const activeMetricsCount = ESSENTIAL_METRICS.filter((m) => isMetricActive(m.type)).length;
  const completedMetricsCount = ESSENTIAL_METRICS.filter((m) =>
    isMetricComplete(essentialMetrics, m.type)
  ).length;
  const completedEventsCount = events.filter((e) => isEventComplete(e)).length;

  // ==========================================================================
  // NAVIGATION HANDLERS
  // ==========================================================================

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push(`/interview/${story?.id}`);
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      try {
        await completeModule("financial");
        router.push(`/interview/${story?.id}`);
      } catch (err) {
        console.error("Failed to complete module:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ==========================================================================
  // RENDER METRIC FORM
  // ==========================================================================

  const renderMetricForm = (config: MetricConfig) => {
    const metrics = getOrCreateMetrics();

    switch (config.type) {
      case "revenue":
        const revenue = metrics.revenue ?? { peakAnnual: null, trend: null };
        return (
          <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
            <FormField variant="dark" label="What was your peak annual revenue?">
              <Input
                variant="dark"
                value={revenue.peakAnnual || ""}
                onChange={(e) => updateMetric("revenue", { peakAnnual: e.target.value || null })}
                placeholder="e.g., $1.2M, ~500K"
              />
            </FormField>
            <FormField variant="dark" label="How was revenue trending over time?">
              <RadioOptions
                name="revenue-trend"
                options={TREND_OPTIONS}
                value={revenue.trend}
                onChange={(v) => updateMetric("revenue", { trend: v })}
              />
            </FormField>
            <div className="pt-2 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleMetricDone("revenue")}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        );

      case "margins":
        const margins = metrics.margins ?? { grossPercent: null, netPercent: null };
        return (
          <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
            <FormField variant="dark" label="Gross margin at peak (%)">
              <Input
                variant="dark"
                type="number"
                min={0}
                max={100}
                value={margins.grossPercent ?? ""}
                onChange={(e) =>
                  updateMetric("margins", {
                    grossPercent: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g., 65"
              />
            </FormField>
            <FormField variant="dark" label="Net margin at peak (%)">
              <Input
                variant="dark"
                type="number"
                min={-100}
                max={100}
                value={margins.netPercent ?? ""}
                onChange={(e) =>
                  updateMetric("margins", {
                    netPercent: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g., 15"
              />
            </FormField>
            <div className="pt-2 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleMetricDone("margins")}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        );

      case "profitability":
        const profitability = metrics.profitability ?? {
          status: null,
          whenAchieved: null,
          whenLost: null,
        };
        return (
          <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
            <FormField variant="dark" label="Did you achieve profitability?">
              <RadioOptions
                name="profitability-status"
                options={PROFITABILITY_STATUS_OPTIONS}
                value={profitability.status}
                onChange={(v) => updateMetric("profitability", { status: v })}
              />
            </FormField>
            {profitability.status === "profitable" && (
              <>
                <FormField variant="dark" label="When did you achieve profitability?">
                  <Input
                    variant="dark"
                    value={profitability.whenAchieved || ""}
                    onChange={(e) =>
                      updateMetric("profitability", { whenAchieved: e.target.value || null })
                    }
                    placeholder="e.g., Year 2, Q3 2022"
                  />
                </FormField>
                <FormField variant="dark" label="When did you lose profitability? (if applicable)">
                  <Input
                    variant="dark"
                    value={profitability.whenLost || ""}
                    onChange={(e) =>
                      updateMetric("profitability", { whenLost: e.target.value || null })
                    }
                    placeholder="e.g., Year 4, Q1 2024"
                  />
                </FormField>
              </>
            )}
            <div className="pt-2 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleMetricDone("profitability")}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        );

      case "cashPosition":
        const cashPosition = metrics.cashPosition ?? { burnRate: null, runwayMonths: null };
        return (
          <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
            <FormField variant="dark" label="What was your typical burn rate?">
              <Input
                variant="dark"
                value={cashPosition.burnRate || ""}
                onChange={(e) => updateMetric("cashPosition", { burnRate: e.target.value || null })}
                placeholder="e.g., $50K/month"
              />
            </FormField>
            <FormField variant="dark" label="Peak runway in months">
              <Input
                variant="dark"
                type="number"
                min={0}
                value={cashPosition.runwayMonths ?? ""}
                onChange={(e) =>
                  updateMetric("cashPosition", {
                    runwayMonths: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g., 18"
              />
            </FormField>
            <div className="pt-2 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleMetricDone("cashPosition")}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        );

      case "funding":
        const funding = metrics.funding ?? { totalRaised: null, stage: null };
        return (
          <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
            <FormField variant="dark" label="Total funding raised">
              <Input
                variant="dark"
                value={funding.totalRaised || ""}
                onChange={(e) => updateMetric("funding", { totalRaised: e.target.value || null })}
                placeholder="e.g., $2.5M"
              />
            </FormField>
            <FormField variant="dark" label="Funding stage at peak">
              <RadioOptions
                name="funding-stage"
                options={FUNDING_STAGE_OPTIONS}
                value={funding.stage}
                onChange={(v) => updateMetric("funding", { stage: v })}
              />
            </FormField>
            <div className="pt-2 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleMetricDone("funding")}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        );

      case "customerBase":
        const customerBase = metrics.customerBase ?? {
          peakCount: null,
          concentrationPercent: null,
        };
        return (
          <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
            <FormField variant="dark" label="Peak customer count">
              <Input
                variant="dark"
                type="number"
                min={0}
                value={customerBase.peakCount ?? ""}
                onChange={(e) =>
                  updateMetric("customerBase", {
                    peakCount: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g., 150"
              />
            </FormField>
            <FormField
              variant="dark"
              label="Revenue concentration (%)"
              hint="% of revenue from your top customer"
            >
              <Input
                variant="dark"
                type="number"
                min={0}
                max={100}
                value={customerBase.concentrationPercent ?? ""}
                onChange={(e) =>
                  updateMetric("customerBase", {
                    concentrationPercent: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g., 25"
              />
            </FormField>
            <div className="pt-2 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleMetricDone("customerBase")}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        );
    }
  };

  // ==========================================================================
  // RENDER EVENTS SECTION
  // ==========================================================================

  const renderEventsSection = () => (
    <div className="space-y-4">
      {/* Event Context Guidance */}
      <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-gold-400">Why we ask: </span>
              {FINANCIAL_EVENTS_GUIDANCE.why}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-medium text-gold-400">What to include: </span>
              {FINANCIAL_EVENTS_GUIDANCE.what.join(", ")}.
            </p>
            <p className="text-sm text-slate-400 italic">{FINANCIAL_EVENTS_GUIDANCE.tip}</p>
          </div>
        </div>
      </div>

      {events.map((event) => {
        const isExpanded = expandedEventId === event.id;
        const categoryInfo = EVENT_CATEGORIES.find((c) => c.value === event.category);

        return (
          <div key={event.id} className="border border-slate-600 rounded-lg overflow-hidden">
            {/* Event header */}
            <div className="flex items-center justify-between p-3 bg-slate-800">
              <button
                onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
              >
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-marble-100">
                  {event.date || "No date"} — {event.subType || categoryInfo?.label || "New Event"}
                </span>
              </button>
              <div className="flex items-center gap-2">
                {isEventComplete(event) && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                <button
                  onClick={() => removeEvent(event.id)}
                  className="p-1 text-slate-500 hover:text-error-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Event details */}
            {isExpanded && (
              <div className="p-4 space-y-4 bg-slate-800/50 border-t border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <FormField variant="dark" label="Date">
                    <Input
                      variant="dark"
                      type="month"
                      value={event.date}
                      onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                    />
                  </FormField>

                  <FormField variant="dark" label="Category">
                    <select
                      value={event.category}
                      onChange={(e) =>
                        updateEvent(event.id, {
                          category: e.target.value as FinancialEventCategory,
                          subType: "",
                        })
                      }
                      className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                    >
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField variant="dark" label="What happened?">
                  <select
                    value={event.subType}
                    onChange={(e) => updateEvent(event.id, { subType: e.target.value })}
                    className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                  >
                    <option value="">Select...</option>
                    {EVENT_SUBTYPES[event.category].map((subtype) => (
                      <option key={subtype} value={subtype}>
                        {subtype}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField variant="dark" label="How severe was this event?">
                  <div className="flex flex-wrap gap-2">
                    {SEVERITY_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={event.severity === option.value}
                        onClick={() => updateEvent(event.id, { severity: option.value })}
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </FormField>

                <FormField variant="dark" label="Looking back...">
                  <div className="space-y-2">
                    {LOOKING_BACK_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={event.lookingBack === option.value}
                        onClick={() =>
                          updateEvent(event.id, {
                            lookingBack: option.value as FinancialEvent["lookingBack"],
                          })
                        }
                        className="w-full text-left"
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </FormField>

                <FormField variant="dark" label="Details" hint="Optional">
                  <Textarea
                    variant="dark"
                    value={event.details || ""}
                    onChange={(e) => updateEvent(event.id, { details: e.target.value || null })}
                    placeholder="Any additional context..."
                    rows={2}
                  />
                </FormField>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="dark-secondary"
                    size="sm"
                    onClick={() => setExpandedEventId(null)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {events.length === 0 && (
        <div className="text-center py-6 border border-dashed border-slate-600 rounded-lg">
          <p className="text-slate-400 text-sm">No events added yet</p>
        </div>
      )}

      <Button variant="dark-secondary" onClick={addEvent} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Financial Event
      </Button>
    </div>
  );

  // ==========================================================================
  // STEP 1: FINANCIAL PICTURE (ACCORDION TABS)
  // ==========================================================================

  const renderFinancialPicture = () => (
    <div className="space-y-4">
      {/* Currency selector */}
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <FormField
          variant="dark"
          label="Main currency"
          hint={
            organizationCountry
              ? `Based on your organization's location (${organizationCountry})`
              : "Select the primary currency for your financial data"
          }
        >
          <select
            value={currentCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.symbol} {option.label} ({option.value})
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Progress summary */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{activeMetricsCount}</span> metrics assessed
        </span>
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{events.length}</span> events recorded
        </span>
      </div>

      {/* Essential Metrics Category */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="flex items-center bg-slate-800/50">
          <button
            onClick={() => toggleCategory("metrics")}
            className="flex-1 flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
          >
            {expandedCategories.has("metrics") ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
            <span className="font-medium text-marble-100">Essential Metrics</span>
            {completedMetricsCount === ESSENTIAL_METRICS.length && (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>
          <div className="flex items-center gap-3 pr-4">
            <span className="text-sm text-slate-400">
              {completedMetricsCount}/{ESSENTIAL_METRICS.length}
            </span>
          </div>
        </div>

        {expandedCategories.has("metrics") && (
          <div className="divide-y divide-slate-700">
            {ESSENTIAL_METRICS.map((config) => {
              const isActive = isMetricActive(config.type);
              const isComplete = isMetricComplete(essentialMetrics, config.type);
              const isExpanded = expandedMetrics.has(config.type);

              return (
                <div key={config.type}>
                  <div
                    className={cn(
                      "w-full flex items-center gap-3 p-3 transition-colors",
                      isActive ? "bg-gold-500/10" : "hover:bg-slate-800/50"
                    )}
                  >
                    <button
                      onClick={() => toggleMetric(config.type)}
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                        isActive
                          ? "bg-gold-500 text-slate-900"
                          : "border border-slate-600 hover:border-slate-500"
                      )}
                    >
                      {isActive && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => toggleMetric(config.type)}
                      className={cn(
                        "text-sm flex-1 text-left",
                        isActive
                          ? "text-marble-100 font-medium"
                          : "text-slate-300 hover:text-slate-200"
                      )}
                    >
                      <span>{config.name}</span>
                      <span className="text-slate-500 ml-2 text-xs">{config.description}</span>
                    </button>
                    {isActive && isComplete && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    )}
                    {isActive && !isComplete && (
                      <span className="text-xs text-slate-500">needs details</span>
                    )}
                    <button
                      onClick={() => markMetricNotApplicable(config.type)}
                      className="text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                    >
                      N/A
                    </button>
                    {isActive && (
                      <button
                        onClick={() => toggleMetricExpand(config.type)}
                        className="p-1 hover:bg-slate-700 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>
                  {isActive && isExpanded && renderMetricForm(config)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Financial Events Category */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="flex items-center bg-slate-800/50">
          <button
            onClick={() => toggleCategory("events")}
            className="flex-1 flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
          >
            {expandedCategories.has("events") ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
            <span className="font-medium text-marble-100">Financial Events</span>
            {events.length > 0 && completedEventsCount === events.length && (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>
          <div className="flex items-center gap-3 pr-4">
            <span className="text-sm text-slate-400">{events.length} events</span>
          </div>
        </div>

        {expandedCategories.has("events") && <div className="p-4">{renderEventsSection()}</div>}
      </div>
    </div>
  );

  // ==========================================================================
  // STEP 2: DOCUMENTS
  // ==========================================================================

  const renderDocuments = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        If you have financial documents you&apos;d like to include (P&amp;L, cap table, etc.), you
        can upload them here. This is optional and all documents are kept confidential.
      </p>

      {/* Upload area */}
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-400 mb-2">Drag and drop files here, or click to browse</p>
        <p className="text-xs text-slate-500 mb-4">
          Supported formats: PDF, CSV, XLS, XLSX (max 10MB each)
        </p>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.csv,.xls,.xlsx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="dark-secondary" asChild>
            <span>Select Files</span>
          </Button>
        </label>
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">Uploaded Files</h3>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-md"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-marble-100">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-slate-500 hover:text-error-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Privacy note */}
      <div className="p-4 bg-gold-900/30 border border-gold-700 rounded-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-gold-400">Privacy note:</strong> All financial documents are
          encrypted and stored securely. They will only be used for research purposes and will never
          be shared publicly without your explicit consent.
        </p>
      </div>
    </div>
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      nextLabel={currentStep === STEPS.length - 1 ? "Complete" : "Continue"}
      title="Financial Picture"
      subtitle="Your organization's financial journey"
    >
      {currentStep === 0 && renderFinancialPicture()}
      {currentStep === 1 && renderDocuments()}
    </WizardLayout>
  );
}
