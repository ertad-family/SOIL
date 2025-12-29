/**
 * Interview Framework Types
 *
 * Core data structures for the Story Coining Process -
 * the organizational autopsy interview wizard.
 */

// =============================================================================
// ENUMS & LITERAL TYPES
// =============================================================================

/** Organization types supported by the interview framework */
export type OrganizationType =
  | "tech_product"
  | "services"
  | "ecommerce"
  | "manufacturing"
  | "ngo"
  | "media";

/** Organization lifecycle stages */
export type LifecycleStage =
  | "formation" // <10 people, operations started
  | "establishment" // 10-30 people, stable operations
  | "growth" // 30-100 people, scaling
  | "maturity"; // 100+ people, established structure

/** Story completion status */
export type StoryStatus =
  | "draft" // Just created, basic info incomplete
  | "in_progress" // At least basic info complete
  | "coined" // All modules complete, story finalized
  | "archived"; // Soft deleted

/** Verification status for organizations */
export type VerificationStatus = "unverified" | "pending" | "verified";

/** Interview module identifiers */
export type ModuleId =
  | "basic_info" // Module 0
  | "functional" // Module 1
  | "financial" // Module 2
  | "dynamic" // Module 3
  | "environment" // Module 4
  | "founder" // Module 5
  | "narrative"; // Module 6

/** Function visibility status in matrix */
export type FunctionStatus =
  | "active" // Expected for this org type/stage (shown by default)
  | "dimmed" // Not typical but can be activated
  | "hidden"; // Irrelevant for this org type

/** Execution model for organizational functions */
export type ExecutionModel = "in_house" | "outsourced" | "hybrid" | "none";

/** Owner type for functions */
export type OwnerType =
  | "dedicated" // Has dedicated owner
  | "shared" // Shared responsibility
  | "founder" // Founder handles it
  | "nobody"; // No clear ownership

/** Provider type for outsourced functions */
export type ProviderType = "agency" | "freelancer" | "firm" | "other";

/** Formalization level of a function */
export type FormalizationLevel =
  | "none" // No documentation
  | "informal" // Some informal processes
  | "documented" // Written processes
  | "tooled" // Tools enforcing processes
  | "automated"; // Automated workflows

/** Health check dimension values */
export type TurnoverLevel = "low" | "normal" | "high";
export type StaffingLevel = "adequate" | "understaffed";
export type BudgetPressure = "none" | "some" | "severe";
export type QualityIssues = "none" | "some" | "serious";
export type LeadershipStatus = "stable" | "gaps" | "vacuum";

/** Metric trend from peak to death */
export type MetricTrend =
  | "grew" // Improved
  | "stable" // No change
  | "declined" // Got worse
  | "collapsed"; // Severe decline

/** Event impact severity */
export type ImpactSeverity =
  | "minor" // We adapted
  | "significant" // Changed trajectory
  | "critical"; // Existential threat

/** Resource availability level */
export type AvailabilityLevel = "high" | "medium" | "low";
export type CostLevel = "low" | "medium" | "high";
export type CompetitionLevel = "low" | "medium" | "high";
export type TrendChange = "improved" | "stable" | "declined" | "increased" | "decreased";

/** Founder role in organization */
export type FounderRole = "founder" | "cofounder" | "ceo_non_founder" | "other";

/** Public naming preference */
export type PublicNamingPreference = "yes" | "no" | "decide_later";

/** Satisfaction rating 1-5 */
export type SatisfactionRating = 1 | 2 | 3 | 4 | 5;

/** Emotion for event cards */
export type Emotion = "distressed" | "worried" | "neutral" | "hopeful";

// =============================================================================
// LOCATION TYPES
// =============================================================================

/** Geographic location with coordinates for cenotaphery placement */
export interface GeoLocation {
  country: string | null;
  /** Region/state/province (e.g., "California", "Île-de-France", "Kartli") */
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  /** GeoNames ID for deduplication and standardization */
  geoId?: number;
}

// createEmptyGeoLocation moved to @/lib/interview/factories
// Re-exported below for backwards compatibility

// =============================================================================
// MODULE 0: BASIC INFO
// =============================================================================

/**
 * @deprecated BasicInfoData is now split between Organization (org facts)
 * and Story columns (founderRole, publicNaming). This interface is kept
 * for backward compatibility with existing stories.
 */
export interface BasicInfoData {
  // Screen 1: The Basics (now in organizations table)
  organizationName: string;
  description: string;
  organizationType: OrganizationType | null;
  businessModel: string | null;
  industry: string | null;
  location: GeoLocation;

  // Screen 2: Timeline (now in organizations table)
  foundedDate: string | null; // ISO date string (YYYY-MM)
  closedDate: string | null; // ISO date string (YYYY-MM)
  stageAtClosure: LifecycleStage | null;
  peakTeamSize: number | null;

  // Screen 3: About You (now in stories columns)
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  // contactEmail removed - use user's registration email instead (see issue #35)
}

// =============================================================================
// MODULE 1: FUNCTIONAL MAPPING
// =============================================================================

export interface FunctionHealthCheck {
  turnover: TurnoverLevel | null;
  staffing: StaffingLevel | null;
  budgetPressure: BudgetPressure | null;
  qualityIssues: QualityIssues | null;
  leadership: LeadershipStatus | null;
  crossFunctionConflict: boolean | null;
  otherIssues: string | null; // Text if "Yes" selected
}

export interface FunctionDetail {
  functionId: string; // Unique identifier (e.g., "sales_lead_generation")
  categoryId: string; // Parent category (e.g., "sales")
  isActive: boolean; // User activated this function
  isCustom: boolean; // User-created custom function

  // If custom
  customName?: string;
  customDescription?: string;

  // Execution details
  executionModel: ExecutionModel | null;

  // In-house specifics
  headcount: number | null;
  ftePercentages: number[]; // FTE% per person
  ownerType: OwnerType | null;

  // Outsourced specifics
  providerType: ProviderType | null;

  // Common fields
  formalization: FormalizationLevel | null;
  startedAt: LifecycleStage | null;
  stoppedAt: LifecycleStage | "until_end" | null;
  satisfaction: SatisfactionRating | null;
  issueDescription: string | null; // If satisfaction <= 3
  comments: string | null;

  // Health check
  healthCheck: FunctionHealthCheck;
}

/**
 * Category-level answers for simplified functional mapping (Phase 2)
 */
export interface FunctionalCategoryAnswer {
  /** How the functions were organized, who owned them */
  organization: string;
  /** What worked well, pain points, satisfaction level */
  satisfaction: string;
  /** Health issues: turnover, understaffing, budget, quality, leadership */
  health: string;
}

/**
 * Custom function added by user (from catalog or fully custom)
 */
export interface CustomFunction {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  /** If added from another org type's catalog */
  sourceOrgType?: string;
}

export interface FunctionalMappingData {
  // Legacy: detailed function data (for backward compatibility)
  functions: FunctionDetail[];
  customCategories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  /** Categories where "none of these functions existed" was selected */
  excludedCategories?: string[];

  // New simplified fields (Phase 2)
  /** Selected function IDs from Step 1 visual mapping */
  selectedFunctions?: string[];
  /** Custom functions added by user */
  customFunctions?: CustomFunction[];
  /** Category-level free-form answers from Step 2 */
  categoryAnswers?: Record<string, FunctionalCategoryAnswer>;
}

// =============================================================================
// MODULE 2: FINANCIAL PICTURE
// =============================================================================

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  storagePath: string; // Supabase storage path
  uploadedAt: string; // ISO date
}

/** Base interface for all org-type specific metrics */
interface BaseFinancialMetrics {
  profitable: boolean | "almost" | null;
}

export interface TechProductMetrics extends BaseFinancialMetrics {
  mrrOrArr: { value: number | null; isArr: boolean };
  burnRate: number | null;
  runwayMonths: number | null;
  ltvCacRatio: number | null;
  totalFundingRaised: number | null;
  fundingStage: "pre_seed" | "seed" | "series_a" | "series_b" | "series_c_plus" | null;
}

export interface ServicesMetrics extends BaseFinancialMetrics {
  monthlyRevenue: number | null;
  grossMarginPercent: number | null;
  utilizationPercent: number | null;
  avgProjectSize: number | null;
  cashCycleDays: number | null;
  revenueConcentrationPercent: number | null;
}

export interface EcommerceMetrics extends BaseFinancialMetrics {
  gmv: number | null;
  netRevenue: number | null;
  grossMarginPercent: number | null;
  cac: number | null;
  roas: number | null;
  inventoryTurnover: number | null;
}

export interface ManufacturingMetrics extends BaseFinancialMetrics {
  monthlyRevenue: number | null;
  grossMarginPercent: number | null;
  cogsPercent: number | null;
  inventoryValue: number | null;
  workingCapital: "positive" | "tight" | "negative" | null;
  capexInvested: number | null;
}

export interface NgoMetrics extends BaseFinancialMetrics {
  annualBudget: number | null;
  fundingMix: {
    grantsPercent: number | null;
    donationsPercent: number | null;
    earnedPercent: number | null;
  };
  overheadRatioPercent: number | null;
  reservesMonths: number | null;
  fundingConcentrationPercent: number | null;
}

export interface MediaMetrics extends BaseFinancialMetrics {
  monthlyRevenue: number | null;
  revenueMix: {
    adsPercent: number | null;
    subscriptionsPercent: number | null;
    otherPercent: number | null;
  };
  audienceSize: number | null;
  cpmOrArpu: number | null;
  grossMarginPercent: number | null;
}

export type FinancialMetrics =
  | TechProductMetrics
  | ServicesMetrics
  | EcommerceMetrics
  | ManufacturingMetrics
  | NgoMetrics
  | MediaMetrics;

// =============================================================================
// ESSENTIAL FINANCIAL METRICS (Universal across all org types)
// =============================================================================

/** Essential metric types - universal metrics all organizations track */
export type EssentialMetricType =
  | "revenue"
  | "margins"
  | "profitability"
  | "cashPosition"
  | "funding"
  | "customerBase";

/** Profitability status */
export type ProfitabilityStatus = "profitable" | "almost" | "never";

/** Revenue assessment */
export interface RevenueMetric {
  peakAnnual: string | null; // Free text for flexibility (e.g., "$1.2M", "~500K")
  trend: MetricTrend | null;
}

/** Margins assessment */
export interface MarginsMetric {
  grossPercent: number | null;
  netPercent: number | null;
}

/** Profitability assessment */
export interface ProfitabilityMetric {
  status: ProfitabilityStatus | null;
  whenAchieved: string | null; // Date or lifecycle stage
  whenLost: string | null; // Date or lifecycle stage
}

/** Cash position assessment */
export interface CashPositionMetric {
  burnRate: string | null; // Free text (e.g., "$50K/month")
  runwayMonths: number | null;
}

/** Funding assessment */
export interface FundingMetric {
  totalRaised: string | null; // Free text (e.g., "$2.5M")
  stage: "bootstrapped" | "pre_seed" | "seed" | "series_a" | "series_b_plus" | null;
}

/** Customer base assessment */
export interface CustomerBaseMetric {
  peakCount: number | null;
  concentrationPercent: number | null; // Top customer as % of revenue
}

/** Essential metrics container */
export interface EssentialMetrics {
  revenue: RevenueMetric | null;
  margins: MarginsMetric | null;
  profitability: ProfitabilityMetric | null;
  cashPosition: CashPositionMetric | null;
  funding: FundingMetric | null;
  customerBase: CustomerBaseMetric | null;
}

export interface MetricDynamic {
  metricName: string;
  peakValue: string | number | null;
  trend: MetricTrend | null;
}

/** Financial event categories */
export type FinancialEventCategory = "revenue" | "funding" | "cash" | "costs" | "profitability";

export interface FinancialEvent {
  id: string;
  date: string; // ISO date
  category: FinancialEventCategory;
  subType: string; // Specific event within category
  severity: ImpactSeverity | null;
  responses: string[]; // Multi-select responses
  lookingBack: "caught_in_time" | "too_late" | "nothing_could_do" | "made_worse" | null;
  details: string | null;
}

/**
 * ISO 4217 currency code (3-letter string).
 * Using string type to support all world currencies without restrictive union.
 * Common examples: USD, EUR, GBP, JPY, CNY, etc.
 */
export type CurrencyCode = string;

export interface FinancialPictureData {
  uploadedFiles: UploadedFile[];
  currency: CurrencyCode | null;
  essentialMetrics: EssentialMetrics | null;
  metrics: FinancialMetrics | null; // Org-type specific metrics (future use)
  dynamics: MetricDynamic[];
  events: FinancialEvent[];
  notApplicableMetrics?: EssentialMetricType[]; // Metrics explicitly marked as N/A
}

// =============================================================================
// MODULE 3: DYNAMIC PICTURE
// =============================================================================

/** Detected patterns from health check data */
export type DetectedPattern =
  | "systemic_turnover"
  | "widespread_understaffing"
  | "budget_squeeze"
  | "quality_erosion"
  | "leadership_crisis"
  | "internal_friction"
  | "concentrated_failure"
  | "cascade_signature";

export interface PatternQuestion {
  patternId: DetectedPattern;
  question: string;
  answer: string | null;
}

/** Internal event categories */
export type InternalEventCategory =
  | "team"
  | "product"
  | "operations"
  | "growth_pains"
  | "hostile_actions"
  | "closure";

export interface InternalEvent {
  id: string;
  date: string; // ISO date
  category: InternalEventCategory;
  subType: string;
  emotionThen: Emotion | null;
  emotionTags: string[];
  lookingBack:
    | "turning_point"
    | "warning_missed"
    | "right_call"
    | "outside_control"
    | "mistake_learned"
    | null;
  details: string | null;
}

/** Overview questions about the decline dynamics */
export interface DynamicsOverview {
  declineSpeed: "sudden" | "gradual" | "slow_with_hope" | null;
  earlyWarnings: "clearly_visible" | "missed_them" | "blindsided" | null;
  pointOfNoReturn: "yes" | "no_gradual" | "hard_to_say" | null;
  pointOfNoReturnWhen: string | null; // If "yes", when was it
  timeToClosureFrom: "days" | "weeks" | "months" | "over_year" | null;
  closureDecision: "alone" | "founders_together" | "board" | "circumstances" | null;
}

export interface DynamicPictureData {
  detectedPatterns: DetectedPattern[];
  patternQuestions: PatternQuestion[];
  dynamicsOverview?: DynamicsOverview; // New: overview questions about decline
  events: InternalEvent[];
}

// =============================================================================
// MODULE 4: ENVIRONMENT ANALYSIS
// =============================================================================

/** Market resource types - resources you compete for */
export type MarketResourceType =
  | "customers"
  | "talent"
  | "suppliers"
  | "capital"
  // NGO-specific resources
  | "donors"
  | "volunteers"
  | "grants"
  // Additional resources for various org types
  | "partners"
  | "technology"
  | "community";

/** Operating condition types - environmental factors you operate within */
export type OperatingConditionType = "infrastructure" | "legal" | "regulatory" | "tax";

/** Accessibility level for market resources */
export type AccessibilityLevel = "easy" | "moderate" | "difficult";

/** Direction of change over time */
export type ChangeDirection = "improved" | "stable" | "worsened";

/** Cost change direction */
export type CostChangeDirection = "decreased" | "stable" | "increased";

/** Competition intensity */
export type CompetitionIntensity = "low" | "moderate" | "intense";

/** Competition change direction */
export type CompetitionChangeDirection = "less" | "stable" | "more";

/** Operating condition state */
export type ConditionState = "favorable" | "neutral" | "challenging";

/** Market resource assessment - detailed info about competitive resources */
export interface MarketResourceAssessment {
  resourceType: MarketResourceType;

  /** If true, organization didn't work with this resource type */
  notApplicable?: boolean;

  // Context question (who/what)
  context: string | null;

  // Accessibility (how easy to reach/find/get)
  peakAccessibility: AccessibilityLevel | null;
  accessibilityTrend: ChangeDirection | null;

  // Cost
  peakCost: CostLevel | null;
  costTrend: CostChangeDirection | null;

  // Competition
  peakCompetition: CompetitionIntensity | null;
  competitionTrend: CompetitionChangeDirection | null;
}

/** Operating condition assessment - environmental factors */
export interface OperatingConditionAssessment {
  conditionType: OperatingConditionType;

  /** If true, this condition wasn't relevant to the organization */
  notApplicable?: boolean;

  // Context question (what specifically)
  context: string | null;

  // State assessment
  peakState: ConditionState | null;
  trend: ChangeDirection | null;
}

/**
 * @deprecated Use MarketResourceType instead
 */
export type ResourceType =
  | "customers"
  | "talent"
  | "suppliers"
  | "capital"
  | "infrastructure"
  | "legal_justice"
  | "regulatory"
  | "tax_burden";

/**
 * @deprecated Use MarketResourceAssessment or OperatingConditionAssessment instead
 */
export interface ResourceAssessment {
  resourceType: ResourceType;
  peakAvailability: AvailabilityLevel | null;
  peakCost: CostLevel | null;
  peakCompetition: CompetitionLevel | null;
  availabilityChange: TrendChange | null;
  costChange: TrendChange | null;
  competitionChange: TrendChange | null;
  whatChanged: string | null;
}

/** External event categories */
export type ExternalEventCategory =
  | "market"
  | "competition"
  | "regulation"
  | "capital"
  | "talent"
  | "macro"
  | "technology"
  | "supplier"
  | "reputation"
  | "hostile_actions";

export interface ExternalEvent {
  id: string;
  date: string; // ISO date
  category: ExternalEventCategory;
  subType: string;
  emotionThen: Emotion | null;
  emotionTags: string[];
  lookingBack:
    | "major_factor"
    | "could_survived"
    | "adapted_well"
    | "outside_control"
    | "should_seen"
    | null;
  responses: string[];
  details: string | null;
}

export interface EnvironmentData {
  /** New structure: Market resources (customers, talent, suppliers, capital) */
  marketResources: MarketResourceAssessment[];

  /** New structure: Operating conditions (infrastructure, legal, regulatory, tax) */
  operatingConditions: OperatingConditionAssessment[];

  /** External events */
  events: ExternalEvent[];

  /**
   * @deprecated Use marketResources and operatingConditions instead
   */
  resourceAssessments?: ResourceAssessment[];
}

// =============================================================================
// MODULE 5: FOUNDER CONTEXT
// =============================================================================

export interface FounderBackground {
  // Part A: Before It Began
  priorExperience: "first_time" | "tried_before" | "done_before" | null;
  domainKnowledge: "learning" | "knew_basics" | "deep_expertise" | null;
  lifeSituation: "stable" | "in_transition" | "ready_for_leap" | null;

  // Part B: The Beginning
  commitment: "full_time" | "eased_in" | "never_full_time" | null;
  startedWith: "solo" | "one_other" | "team" | null;
  howFoundCoFounders: string | null; // If not solo
  roleClarity: "crystal_clear" | "figured_out" | "always_fuzzy" | null;

  // Part B2: Co-founder Dynamics (if not solo)
  cofounderSkillsComplementary: "very_complementary" | "some_overlap" | "too_similar" | null;
  decisionMakingStyle: "consensus" | "domain_based" | "one_leader" | "situational" | null;
  conflictResolution:
    | "open_discussion"
    | "avoided_conflict"
    | "escalated_often"
    | "third_party"
    | null;
  visionAlignment:
    | "fully_aligned"
    | "mostly_aligned"
    | "different_visions"
    | "never_discussed"
    | null;

  // Part C: Along the Way
  motivationEvolution: "grew_stronger" | "stayed_steady" | "started_fading" | null;
  fadingNoticedAt: LifecycleStage | null; // If fading
  cofounderRelationship: "got_closer" | "stayed_solid" | "got_hard" | "split" | null;
  investmentLevel: "yes_everything" | "kept_boundaries" | "pulled_back" | null;

  // Part D: The Cost
  healthImpact: "no" | "a_little" | "significantly" | null;
  relationshipImpact: "no" | "a_little" | "significantly" | null;
  financeImpact: "no" | "a_little" | "significantly" | null;
  recoveryTime: "days" | "weeks" | "months" | "still_working" | null;

  // Part E: Now
  timeSinceEnd: string | null; // Duration string
  currentFeeling: Emotion | "content" | null;
  whatHelpedProcess: string | null;
  wouldDoAgain: "yes_no_hesitation" | "yes_differently" | "probably_not" | "definitely_not" | null;
}

/** Personal event categories */
export type PersonalEventCategory =
  | "health"
  | "family"
  | "life_changes"
  | "other_commitments"
  | "positive_shifts";

export interface PersonalEvent {
  id: string;
  date: string; // ISO date
  category: PersonalEventCategory;
  subType: string;
  capacityImpact:
    | "couldnt_focus"
    | "significantly_reduced"
    | "somewhat_reduced"
    | "maintained"
    | "actually_helped"
    | null;
  organizationAdapted:
    | "others_stepped_up"
    | "tried_but_struggled"
    | "suffered"
    | "no_one_else"
    | null;
  lookingBack: "wish_asked_help" | "wish_stepped_away" | "proud" | "impossible_either_way" | null;
  details: string | null;
}

export interface FounderContextData {
  background: FounderBackground;
  events: PersonalEvent[];
}

// =============================================================================
// MODULE 6: NARRATIVE
// =============================================================================

export interface NarrativeSection {
  questionId: string;
  question: string;
  answer: string | null;
  skipped: boolean;
}

export interface NarrativeData {
  sections: {
    understanding: NarrativeSection[];
    hindsight: NarrativeSection[];
    lessons: NarrativeSection[];
    advice: NarrativeSection[];
    legacy: NarrativeSection[];
  };
}

// =============================================================================
// ORGANIZATION (FACTUAL DATA)
// =============================================================================

export interface Organization {
  id: string;
  slug: string;

  // Basic facts about the organization
  name: string;
  organizationType: OrganizationType | null;
  businessModel: string | null;
  industry: string | null;
  description: string | null;

  // Location
  location: GeoLocation;

  // Timeline
  foundedDate: string | null;
  closedDate: string | null;
  stageAtClosure: LifecycleStage | null;
  peakTeamSize: number | null;

  // Verification
  verificationStatus: VerificationStatus;
  verificationCount: number;
  isPublic: boolean;

  // Creator
  createdBy: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// AI SUMMARY TYPES
// =============================================================================

export type AISummaryStatus = "idle" | "generating" | "ready" | "failed";

export interface AISummary {
  text: string;
  lastModuleProcessed: ModuleId;
  keyFacts: string[];
  organizationType: OrganizationType | null;
  industry: string | null;
  lifespanMonths: number | null;
  peakTeamSize: number | null;
  closurePattern: string | null;
  // Appraisal: motivational messages for founder after completing a chapter
  appraisal: {
    affirmation: string; // Affirms founder's achievements so far
    anticipation: string; // Builds expectation for next chapter
  } | null;
}

// =============================================================================
// STORY (FOUNDER PERSPECTIVE)
// =============================================================================

export interface Story {
  id: string;
  organizationId: string; // Link to organization
  userId: string;
  status: StoryStatus;
  currentModule: ModuleId;
  completedModules: ModuleId[];

  // Author's role in the organization
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  // contactEmail removed - use user's registration email instead (see issue #35)

  // Module data (perspectives, not facts)
  basicInfo: BasicInfoData; // Keep for backward compatibility, will be deprecated
  functionalMapping: FunctionalMappingData;
  financialPicture: FinancialPictureData;
  dynamicPicture: DynamicPictureData;
  environment: EnvironmentData;
  founderContext: FounderContextData;
  narrative: NarrativeData;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  coinedAt: string | null;

  // AI-generated summary (privacy-stripped, research-ready)
  aiSummary: AISummary | null;
  aiSummaryStatus: AISummaryStatus;
  aiSummaryUpdatedAt: string | null;

  // Joined data (optional, for convenience)
  organization?: Organization;
}

// =============================================================================
// FUNCTION MATRIX TYPES
// =============================================================================

export interface FunctionDefinition {
  id: string;
  name: string;
  description?: string;
}

export interface FunctionCategoryDefinition {
  id: string;
  name: string;
  functions: FunctionDefinition[];
}

/** Status of a function for a specific org type and stage */
export interface FunctionStatusMatrix {
  [stage: string]: FunctionStatus; // LifecycleStage -> FunctionStatus
}

export interface OrgTypeFunctionConfig {
  orgType: OrganizationType;
  categories: Array<{
    categoryId: string;
    /** Override category name for this org type (e.g., "Fundraising" for NGO instead of "Sales") */
    nameOverride?: string;
    functions: Array<{
      functionId: string;
      /** Override function name for this org type */
      nameOverride?: string;
      statusByStage: FunctionStatusMatrix;
    }>;
    /** Additional functions specific to this org type */
    additionalFunctions?: Array<{
      id: string;
      name: string;
      description?: string;
      statusByStage: FunctionStatusMatrix;
    }>;
  }>;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface StoryListItem {
  id: string;
  status: StoryStatus;
  organizationName: string | null;
  organizationType: OrganizationType | null;
  currentModule: ModuleId;
  completedModules: ModuleId[];
  createdAt: string;
  updatedAt: string;
  coinedAt: string | null;
}

export interface CreateStoryResponse {
  story: Story;
}

export interface UpdateStoryResponse {
  story: Story;
}

// =============================================================================
// RE-EXPORTS: FACTORIES & METADATA
// =============================================================================
// Factory functions and module metadata have been extracted to separate files
// for better code organization. Re-exported here for backwards compatibility.

export {
  createEmptyGeoLocation,
  createEmptyBasicInfo,
  createEmptyFunctionalMapping,
  createEmptyFinancialPicture,
  createEmptyEssentialMetrics,
  createEmptyDynamicPicture,
  createEmptyEnvironment,
  createEmptyFounderContext,
  createEmptyNarrative,
  createEmptyOrganization,
  createEmptyStory,
} from "@/lib/interview/factories";

export {
  type ModuleMetadata,
  MODULES,
  getModuleById,
  getNextModule,
  getPreviousModule,
  calculateProgress,
} from "@/lib/interview/metadata";
