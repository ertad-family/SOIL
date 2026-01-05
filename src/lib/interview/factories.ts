/**
 * Interview Framework Factory Functions
 *
 * Factory functions for creating empty/default instances of interview data structures.
 * Extracted from types/interview.ts for better code organization.
 */

import type {
  GeoLocation,
  BasicInfoData,
  FunctionalMappingData,
  FinancialPictureData,
  EssentialMetrics,
  DynamicPictureData,
  EnvironmentData,
  FounderContextData,
  NarrativeData,
  Organization,
  Story,
} from "@/types/interview";

/** Creates an empty GeoLocation object */
export const createEmptyGeoLocation = (): GeoLocation => ({
  country: null,
  region: null,
  city: null,
  latitude: null,
  longitude: null,
});

export const createEmptyBasicInfo = (): BasicInfoData => ({
  organizationName: "",
  description: "",
  organizationType: null,
  businessModel: null,
  industry: null,
  location: createEmptyGeoLocation(),
  foundedDate: null,
  closedDate: null,
  stageAtClosure: null,
  peakTeamSize: null,
  founderRole: null,
  publicNaming: null,
});

export const createEmptyFunctionalMapping = (): FunctionalMappingData => ({
  functions: [],
  customCategories: [],
  selectedFunctions: [],
  customFunctions: [],
  categoryAnswers: {},
});

export const createEmptyFinancialPicture = (): FinancialPictureData => ({
  uploadedFiles: [],
  currency: null,
  essentialMetrics: null,
  metrics: null,
  dynamics: [],
  events: [],
});

export const createEmptyEssentialMetrics = (): EssentialMetrics => ({
  revenue: null,
  margins: null,
  profitability: null,
  cashPosition: null,
  funding: null,
  customerBase: null,
});

export const createEmptyDynamicPicture = (): DynamicPictureData => ({
  detectedPatterns: [],
  patternQuestions: [],
  events: [],
});

export const createEmptyEnvironment = (): EnvironmentData => ({
  marketResources: [],
  operatingConditions: [],
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
    // Co-founder dynamics
    cofounderSkillsComplementary: null,
    decisionMakingStyle: null,
    conflictResolution: null,
    visionAlignment: null,
    // Along the way
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
  location: createEmptyGeoLocation(),
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
  currentModule: "founder", // Start at founder/Your Story (basic_info handled by org wizard)
  completedModules: [],
  founderRole: null,
  publicNaming: null,
  basicInfo: createEmptyBasicInfo(), // Keep for backward compatibility
  functionalMapping: createEmptyFunctionalMapping(),
  financialPicture: createEmptyFinancialPicture(),
  dynamicPicture: createEmptyDynamicPicture(),
  environment: createEmptyEnvironment(),
  founderContext: createEmptyFounderContext(),
  narrative: createEmptyNarrative(),
  coinedAt: null,
  // AI summary fields
  aiSummary: null,
  aiSummaryStatus: "idle",
  aiSummaryUpdatedAt: null,
});
