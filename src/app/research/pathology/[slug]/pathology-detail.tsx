"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Cog,
  Zap,
  Clock,
  RefreshCw,
  EyeOff,
  AlertTriangle,
  BookOpen,
  FileText,
  Target,
  Activity,
  Shield,
  Microscope,
} from "lucide-react";

// Types
type PathologyLocalization = "LP" | "SP" | "FP" | "CP" | "MP" | "OP";
type PathologyEtiology = "ETI-F" | "ETI-M" | "ETI-C" | "ETI-R" | "ETI-T" | "ETI-S";
type PathologyCourse = "ACU" | "CHR" | "REL" | "LAT";

interface Pathology {
  id: string;
  code: string;
  slug: string;
  name: string;
  alternative_names: string[];
  definition: string;
  localization: PathologyLocalization;
  primary_etiology: PathologyEtiology;
  typical_course: PathologyCourse;
  diagnostic_criteria: string[];
  symptoms: string[];
  stages: string[];
  course_description: string | null;
  etiology_explanation: string | null;
  risk_factors: string[];
  differential_diagnosis: string[];
  prognosis: string | null;
  known_cases: string[];
  literature_references: string[];
  key_authors: string[];
  related_lexicon_terms: string[];
  // Primary source citation fields
  primary_source_title: string | null;
  primary_source_authors: string | null;
  primary_source_year: number | null;
  primary_source_journal: string | null;
  primary_source_doi: string | null;
  primary_source_url: string | null;
  primary_source_abstract: string | null;
  // Zotero integration
  zotero_item_key: string | null;
  created_at: string;
  updated_at: string;
}

interface NavPathology {
  slug: string;
  code: string;
  name: string;
}

interface PathologyDetailProps {
  pathology: Pathology;
  prevPathology: NavPathology | null;
  nextPathology: NavPathology | null;
}

// Display labels
const LOCALIZATION_LABELS: Record<PathologyLocalization, string> = {
  LP: "Leadership Pathology",
  SP: "Structural Pathology",
  FP: "Financial Pathology",
  CP: "Cultural Pathology",
  MP: "Market Pathology",
  OP: "Operational Pathology",
};

const ETIOLOGY_LABELS: Record<PathologyEtiology, string> = {
  "ETI-F": "Founder-induced",
  "ETI-M": "Market-induced",
  "ETI-C": "Competition-induced",
  "ETI-R": "Regulatory-induced",
  "ETI-T": "Technology-induced",
  "ETI-S": "Stochastic (random/bad luck)",
};

const COURSE_LABELS: Record<PathologyCourse, string> = {
  ACU: "Acute (sudden onset)",
  CHR: "Chronic (slow decline)",
  REL: "Relapsing (crisis cycles)",
  LAT: "Latent (hidden, manifests later)",
};

// Helper functions
function getLocalizationIcon(localization: PathologyLocalization) {
  const iconClass = "w-5 h-5";
  switch (localization) {
    case "LP":
      return <User className={iconClass} />;
    case "SP":
      return <Building2 className={iconClass} />;
    case "FP":
      return <DollarSign className={iconClass} />;
    case "CP":
      return <Users className={iconClass} />;
    case "MP":
      return <TrendingUp className={iconClass} />;
    case "OP":
      return <Cog className={iconClass} />;
    default:
      return <Microscope className={iconClass} />;
  }
}

function getCourseIcon(course: PathologyCourse) {
  const iconClass = "w-4 h-4";
  switch (course) {
    case "ACU":
      return <Zap className={iconClass} />;
    case "CHR":
      return <Clock className={iconClass} />;
    case "REL":
      return <RefreshCw className={iconClass} />;
    case "LAT":
      return <EyeOff className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
}

function getCourseColor(course: PathologyCourse) {
  switch (course) {
    case "ACU":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "CHR":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "REL":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "LAT":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

// Section Component
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-lg font-medium text-marble-100 mb-4 flex items-center gap-2">
        <span className="text-gold-400">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

// List Section Component
function ListSection({
  title,
  icon,
  items,
  ordered = false,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  ordered?: boolean;
}) {
  if (!items || items.length === 0) return null;

  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered ? "list-decimal" : "list-disc";

  return (
    <Section title={title} icon={icon}>
      <ListTag className={`${listClass} list-inside space-y-2 text-slate-300`}>
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ListTag>
    </Section>
  );
}

export function PathologyDetail({ pathology, prevPathology, nextPathology }: PathologyDetailProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-content mx-auto px-6">
          <Link
            href="/research/pathology"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pathology Classification
          </Link>

          <div className="animate-fade-in-up">
            {/* Code badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-lg text-gold-400 bg-gold-500/10 px-3 py-1 rounded">
                {pathology.code}
              </span>
              <span
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded border ${getCourseColor(pathology.typical_course)}`}
              >
                {getCourseIcon(pathology.typical_course)}
                {COURSE_LABELS[pathology.typical_course]}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-marble-100">
              {pathology.name}
            </h1>

            {/* Alternative names */}
            {pathology.alternative_names && pathology.alternative_names.length > 0 && (
              <p className="text-slate-400 mb-6">
                Also known as:{" "}
                <span className="text-slate-300">{pathology.alternative_names.join(", ")}</span>
              </p>
            )}

            {/* Classification badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="flex items-center gap-2 text-sm px-3 py-1.5 rounded bg-slate-700/50 text-slate-300">
                {getLocalizationIcon(pathology.localization)}
                {LOCALIZATION_LABELS[pathology.localization]}
              </span>
              <span className="text-sm px-3 py-1.5 rounded bg-slate-700/50 text-slate-300">
                {ETIOLOGY_LABELS[pathology.primary_etiology]}
              </span>
            </div>

            {/* Key authors */}
            {pathology.key_authors && pathology.key_authors.length > 0 && (
              <p className="text-slate-500 text-sm">
                Key researchers: {pathology.key_authors.join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2">
              {/* Definition */}
              <Section title="Definition" icon={<FileText className="w-5 h-5" />}>
                <p className="text-slate-300 leading-relaxed text-lg">{pathology.definition}</p>
              </Section>

              {/* Diagnostic Criteria */}
              <ListSection
                title="Diagnostic Criteria"
                icon={<Target className="w-5 h-5" />}
                items={pathology.diagnostic_criteria}
                ordered
              />

              {/* Symptoms */}
              <ListSection
                title="Symptoms"
                icon={<Activity className="w-5 h-5" />}
                items={pathology.symptoms}
              />

              {/* Stages */}
              {pathology.stages && pathology.stages.length > 0 && (
                <Section title="Disease Stages" icon={<Clock className="w-5 h-5" />}>
                  <div className="space-y-3">
                    {pathology.stages.map((stage, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="text-slate-300 leading-relaxed">{stage}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Course Description */}
              {pathology.course_description && (
                <Section title="Typical Course" icon={<RefreshCw className="w-5 h-5" />}>
                  <p className="text-slate-300 leading-relaxed">{pathology.course_description}</p>
                </Section>
              )}

              {/* Etiology Explanation */}
              {pathology.etiology_explanation && (
                <Section title="Etiology" icon={<Microscope className="w-5 h-5" />}>
                  <p className="text-slate-300 leading-relaxed">{pathology.etiology_explanation}</p>
                </Section>
              )}

              {/* Risk Factors */}
              <ListSection
                title="Risk Factors"
                icon={<AlertTriangle className="w-5 h-5" />}
                items={pathology.risk_factors}
              />

              {/* Differential Diagnosis */}
              {pathology.differential_diagnosis && pathology.differential_diagnosis.length > 0 && (
                <Section title="Differential Diagnosis" icon={<Shield className="w-5 h-5" />}>
                  <p className="text-slate-400 text-sm mb-3">
                    Conditions that may present similarly or co-occur:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pathology.differential_diagnosis.map((diagnosis, index) => (
                      <span
                        key={index}
                        className="text-sm px-3 py-1.5 rounded bg-slate-700/50 text-slate-300"
                      >
                        {diagnosis}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Prognosis */}
              {pathology.prognosis && (
                <Section title="Prognosis" icon={<TrendingUp className="w-5 h-5" />}>
                  <p className="text-slate-300 leading-relaxed">{pathology.prognosis}</p>
                </Section>
              )}

              {/* References Section */}
              {(pathology.primary_source_title ||
                (pathology.literature_references &&
                  pathology.literature_references.length > 0)) && (
                <Section title="References" icon={<BookOpen className="w-5 h-5" />}>
                  <div className="space-y-6">
                    {/* Primary Source */}
                    {pathology.primary_source_title && (
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <p className="text-xs text-gold-400 uppercase tracking-wider mb-2">
                          Defining Source
                        </p>
                        <p className="text-slate-200 leading-relaxed">
                          {pathology.primary_source_authors && (
                            <span>{pathology.primary_source_authors} </span>
                          )}
                          {pathology.primary_source_year && (
                            <span>({pathology.primary_source_year}). </span>
                          )}
                          <span className="italic">{pathology.primary_source_title}</span>
                          {pathology.primary_source_journal && (
                            <span>. {pathology.primary_source_journal}</span>
                          )}
                          {pathology.primary_source_doi && (
                            <span>
                              . DOI:{" "}
                              <a
                                href={`https://doi.org/${pathology.primary_source_doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold-400 hover:text-gold-300 transition-colors"
                              >
                                {pathology.primary_source_doi}
                              </a>
                            </span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3">
                          {pathology.primary_source_url && (
                            <a
                              href={pathology.primary_source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Access Source
                            </a>
                          )}
                          {pathology.zotero_item_key && (
                            <a
                              href={`https://www.zotero.org/groups/6367540/soil/items/${pathology.zotero_item_key}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300 transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              View in SOIL Bibliography
                            </a>
                          )}
                        </div>
                        {pathology.primary_source_abstract && (
                          <div className="mt-4 pt-4 border-t border-slate-700">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                              Abstract
                            </p>
                            <p className="text-sm text-slate-400 leading-relaxed italic">
                              {pathology.primary_source_abstract}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional References */}
                    {pathology.literature_references &&
                      pathology.literature_references.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                            Additional Sources
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm">
                            {pathology.literature_references.map((reference, index) => (
                              <li key={index} className="leading-relaxed pl-2">
                                {reference}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                  </div>
                </Section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Known Cases */}
                {pathology.known_cases && pathology.known_cases.length > 0 && (
                  <Card variant="dark" padding="md">
                    <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold-400" />
                      Known Cases
                    </h3>
                    <ul className="space-y-2">
                      {pathology.known_cases.map((caseExample, index) => (
                        <li key={index} className="text-sm text-slate-400">
                          {caseExample}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Classification Summary */}
                <Card variant="dark" padding="md">
                  <h3 className="font-display text-sm font-medium text-marble-100 mb-3">
                    Classification
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Code</dt>
                      <dd className="text-gold-400 font-mono">{pathology.code}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Localization</dt>
                      <dd className="text-slate-300">
                        {LOCALIZATION_LABELS[pathology.localization]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Primary Etiology</dt>
                      <dd className="text-slate-300">
                        {ETIOLOGY_LABELS[pathology.primary_etiology]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Typical Course</dt>
                      <dd className="text-slate-300">{COURSE_LABELS[pathology.typical_course]}</dd>
                    </div>
                  </dl>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 border-t border-slate-800">
        <div className="max-w-content mx-auto px-6">
          <div className="flex justify-between items-center">
            {prevPathology ? (
              <Link
                href={`/research/pathology/${prevPathology.slug}`}
                className="flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <span className="text-xs text-slate-500 block">{prevPathology.code}</span>
                  <span className="text-sm">{prevPathology.name}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPathology ? (
              <Link
                href={`/research/pathology/${nextPathology.slug}`}
                className="flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors group text-right"
              >
                <div>
                  <span className="text-xs text-slate-500 block">{nextPathology.code}</span>
                  <span className="text-sm">{nextPathology.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
