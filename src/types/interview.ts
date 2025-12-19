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
// MODULE 0: BASIC INFO
// =============================================================================

export interface BasicInfoData {
  // Screen 1: The Basics
  organizationName: string;
  description: string;
  organizationType: OrganizationType | null;
  businessModel: string | null;
  industry: string | null;
  location: {
    country: string | null;
    city: string | null;
  };

  // Screen 2: Timeline
  foundedDate: string | null; // ISO date string (YYYY-MM)
  closedDate: string | null; // ISO date string (YYYY-MM)
  stageAtClosure: LifecycleStage | null;
  peakTeamSize: number | null;

  // Screen 3: About You
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  contactEmail: string | null;
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

export interface FunctionalMappingData {
  functions: FunctionDetail[];
  customCategories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  /** Categories where "none of these functions existed" was selected */
  excludedCategories?: string[];
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

export interface FinancialPictureData {
  uploadedFiles: UploadedFile[];
  metrics: FinancialMetrics | null;
  dynamics: MetricDynamic[];
  events: FinancialEvent[];
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

export interface DynamicPictureData {
  detectedPatterns: DetectedPattern[];
  patternQuestions: PatternQuestion[];
  events: InternalEvent[];
}

// =============================================================================
// MODULE 4: ENVIRONMENT ANALYSIS
// =============================================================================

export type ResourceType =
  | "customers"
  | "talent"
  | "suppliers"
  | "capital"
  | "infrastructure"
  | "legal_justice"
  | "regulatory"
  | "tax_burden";

export interface ResourceAssessment {
  resourceType: ResourceType;

  // At peak
  peakAvailability: AvailabilityLevel | null;
  peakCost: CostLevel | null;
  peakCompetition: CompetitionLevel | null; // Only for applicable resources

  // Peak to death change
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
  resourceAssessments: ResourceAssessment[];
  events: ExternalEvent[];
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
  location: {
    country: string | null;
    city: string | null;
  };

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
  contactEmail: string | null;

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
// DEFAULTS & FACTORIES
// =============================================================================

export const createEmptyBasicInfo = (): BasicInfoData => ({
  organizationName: "",
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
  contactEmail: null,
});

export const createEmptyFunctionalMapping = (): FunctionalMappingData => ({
  functions: [],
  customCategories: [],
});

export const createEmptyFinancialPicture = (): FinancialPictureData => ({
  uploadedFiles: [],
  metrics: null,
  dynamics: [],
  events: [],
});

export const createEmptyDynamicPicture = (): DynamicPictureData => ({
  detectedPatterns: [],
  patternQuestions: [],
  events: [],
});

export const createEmptyEnvironment = (): EnvironmentData => ({
  resourceAssessments: [],
  events: [],
});

export const createEmptyFounderContext = (): FounderContextData => ({
  background: {
    priorExperience: null,
    domainKnowledge: null,
    lifeSituation: null,
    commitment: null,
    startedWith: null,
    howFoundCoFounders: null,
    roleClarity: null,
    motivationEvolution: null,
    fadingNoticedAt: null,
    cofounderRelationship: null,
    investmentLevel: null,
    healthImpact: null,
    relationshipImpact: null,
    financeImpact: null,
    recoveryTime: null,
    timeSinceEnd: null,
    currentFeeling: null,
    whatHelpedProcess: null,
    wouldDoAgain: null,
  },
  events: [],
});

export const createEmptyNarrative = (): NarrativeData => ({
  sections: {
    understanding: [
      {
        questionId: "cause_of_death",
        question: "What do you believe was the primary cause of death?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "point_of_no_return",
        question: "Was there a point of no return? When?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "prevention",
        question: "Could it have been prevented? What would it have taken?",
        answer: null,
        skipped: false,
      },
    ],
    hindsight: [
      {
        questionId: "do_differently",
        question: "What would you do differently if you could go back?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "do_same",
        question: "What would you do exactly the same?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "blind_spots",
        question: "What did you not see that you wish you had?",
        answer: null,
        skipped: false,
      },
    ],
    lessons: [
      {
        questionId: "about_organizations",
        question: "What did you learn about building organizations?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "about_yourself",
        question: "What did you learn about yourself?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "most_surprising",
        question: "What surprised you most about the whole experience?",
        answer: null,
        skipped: false,
      },
    ],
    advice: [
      {
        questionId: "tell_beginner",
        question: "What would you tell someone standing where you stood at the beginning?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "question_to_ask",
        question: "What question should they ask themselves that you didn't?",
        answer: null,
        skipped: false,
      },
    ],
    legacy: [
      {
        questionId: "most_proud",
        question: "What are you most proud of about [Organization Name]?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "remember",
        question: "What do you want people to remember about it?",
        answer: null,
        skipped: false,
      },
      {
        questionId: "anything_else",
        question: "Is there anything else you want to say?",
        answer: null,
        skipped: false,
      },
    ],
  },
});

export const createEmptyOrganization = (
  createdBy: string,
  name: string = ""
): Omit<Organization, "id" | "slug" | "createdAt" | "updatedAt"> => ({
  name,
  organizationType: null,
  businessModel: null,
  industry: null,
  description: null,
  location: { country: null, city: null },
  foundedDate: null,
  closedDate: null,
  stageAtClosure: null,
  peakTeamSize: null,
  verificationStatus: "unverified",
  verificationCount: 0,
  isPublic: false,
  createdBy,
});

export const createEmptyStory = (
  userId: string,
  organizationId: string
): Omit<Story, "id" | "createdAt" | "updatedAt"> => ({
  organizationId,
  userId,
  status: "draft",
  currentModule: "basic_info",
  completedModules: [],
  founderRole: null,
  publicNaming: null,
  contactEmail: null,
  basicInfo: createEmptyBasicInfo(), // Keep for backward compatibility
  functionalMapping: createEmptyFunctionalMapping(),
  financialPicture: createEmptyFinancialPicture(),
  dynamicPicture: createEmptyDynamicPicture(),
  environment: createEmptyEnvironment(),
  founderContext: createEmptyFounderContext(),
  narrative: createEmptyNarrative(),
  coinedAt: null,
});

// =============================================================================
// MODULE METADATA
// =============================================================================

export interface ModuleMetadata {
  id: ModuleId;
  name: string;
  description: string;
  estimatedMinutes: number;
  order: number;
}

export const MODULES: ModuleMetadata[] = [
  {
    id: "basic_info",
    name: "Basic Info",
    description: "Organization basics, timeline, your role",
    estimatedMinutes: 5,
    order: 0,
  },
  {
    id: "functional",
    name: "Functional Mapping",
    description: "Organization structure at peak",
    estimatedMinutes: 35,
    order: 1,
  },
  {
    id: "financial",
    name: "Financial Picture",
    description: "Metrics, dynamics, financial events",
    estimatedMinutes: 18,
    order: 2,
  },
  {
    id: "dynamic",
    name: "Dynamic Picture",
    description: "Internal events from peak to closure",
    estimatedMinutes: 25,
    order: 3,
  },
  {
    id: "environment",
    name: "Environment",
    description: "External conditions and events",
    estimatedMinutes: 18,
    order: 4,
  },
  {
    id: "founder",
    name: "Your Story",
    description: "Background, journey, personal impact",
    estimatedMinutes: 18,
    order: 5,
  },
  {
    id: "narrative",
    name: "Meaning & Lessons",
    description: "Reflection, lessons, legacy",
    estimatedMinutes: 25,
    order: 6,
  },
];

export const getModuleById = (id: ModuleId): ModuleMetadata | undefined =>
  MODULES.find((m) => m.id === id);

export const getNextModule = (currentId: ModuleId): ModuleMetadata | undefined => {
  const current = MODULES.find((m) => m.id === currentId);
  if (!current) return undefined;
  return MODULES.find((m) => m.order === current.order + 1);
};

export const getPreviousModule = (currentId: ModuleId): ModuleMetadata | undefined => {
  const current = MODULES.find((m) => m.id === currentId);
  if (!current || current.order === 0) return undefined;
  return MODULES.find((m) => m.order === current.order - 1);
};

export const calculateProgress = (completedModules: ModuleId[]): number => {
  return Math.round((completedModules.length / MODULES.length) * 100);
};
