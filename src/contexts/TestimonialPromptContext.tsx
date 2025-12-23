"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { TestimonialPromptModal, TestimonialType } from "@/components/testimonials";

interface TestimonialPromptConfig {
  type: TestimonialType;
  contextId?: string;
  contextMetadata?: Record<string, unknown>;
  title?: string;
  description?: string;
}

interface TestimonialPromptContextType {
  /** Show the testimonial prompt modal */
  showPrompt: (config: TestimonialPromptConfig) => void;
  /** Schedule a prompt to show on exit intent */
  scheduleExitPrompt: (config: TestimonialPromptConfig) => void;
  /** Clear any scheduled exit prompt */
  clearExitPrompt: () => void;
  /** Whether a prompt is currently showing */
  isPromptOpen: boolean;
  /** Whether an exit prompt is scheduled */
  hasScheduledPrompt: boolean;
  /** Trigger the scheduled exit prompt (call before navigation) */
  triggerExitPrompt: () => boolean;
  /** Mark that feedback was already given for this session/type */
  markFeedbackGiven: (type: TestimonialType) => void;
  /** Check if feedback was already given for this type */
  hasFeedbackBeenGiven: (type: TestimonialType) => boolean;
  /** Whether feedback status has been loaded from database */
  isLoaded: boolean;
}

const TestimonialPromptContext = createContext<TestimonialPromptContextType | null>(null);

// Session storage key for tracking given feedback (used as cache and for immediate updates)
const FEEDBACK_GIVEN_KEY = "soil_feedback_given";

// Get feedback given set from session storage
function getFeedbackGiven(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = sessionStorage.getItem(FEEDBACK_GIVEN_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

// Save feedback given set to session storage
function saveFeedbackGiven(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(FEEDBACK_GIVEN_KEY, JSON.stringify([...set]));
  } catch {
    // Ignore storage errors
  }
}

// Fetch feedback status from database for authenticated users
async function fetchFeedbackStatus(): Promise<string[]> {
  try {
    const response = await fetch("/api/testimonials/check");
    if (!response.ok) return [];
    const data = await response.json();
    return data.submittedTypes || [];
  } catch {
    return [];
  }
}

interface TestimonialPromptProviderProps {
  children: ReactNode;
  /** Minimum time (ms) user must spend on site before general exit prompt */
  minTimeForGeneralPrompt?: number;
}

export function TestimonialPromptProvider({
  children,
  minTimeForGeneralPrompt = 60000, // 60 seconds default
}: TestimonialPromptProviderProps) {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<TestimonialPromptConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const scheduledPromptRef = useRef<TestimonialPromptConfig | null>(null);
  const feedbackGivenRef = useRef<Set<string>>(new Set());
  const pageLoadTimeRef = useRef<number>(Date.now());

  // Load feedback given state on mount (from session storage + database)
  useEffect(() => {
    async function loadFeedbackStatus() {
      // Start with session storage (immediate)
      feedbackGivenRef.current = getFeedbackGiven();

      // Fetch from database for authenticated users
      const dbTypes = await fetchFeedbackStatus();
      if (dbTypes.length > 0) {
        // Merge database types with session storage
        for (const type of dbTypes) {
          feedbackGivenRef.current.add(type);
        }
        // Save merged set to session storage for future checks
        saveFeedbackGiven(feedbackGivenRef.current);
      }

      setIsLoaded(true);
    }

    loadFeedbackStatus();
  }, []);

  // Show prompt immediately
  const showPrompt = useCallback((config: TestimonialPromptConfig) => {
    // Don't show if feedback already given for this type
    if (feedbackGivenRef.current.has(config.type)) {
      return;
    }
    setCurrentConfig(config);
    setIsPromptOpen(true);
  }, []);

  // Schedule a prompt for exit intent
  const scheduleExitPrompt = useCallback((config: TestimonialPromptConfig) => {
    // Don't schedule if feedback already given for this type
    if (feedbackGivenRef.current.has(config.type)) {
      return;
    }
    scheduledPromptRef.current = config;
  }, []);

  // Clear scheduled prompt
  const clearExitPrompt = useCallback(() => {
    scheduledPromptRef.current = null;
  }, []);

  // Trigger the scheduled exit prompt
  const triggerExitPrompt = useCallback((): boolean => {
    const config = scheduledPromptRef.current;
    if (!config) return false;

    // Don't trigger if feedback already given
    if (feedbackGivenRef.current.has(config.type)) {
      scheduledPromptRef.current = null;
      return false;
    }

    // For general prompts, check minimum time
    if (config.type === "general") {
      const timeOnPage = Date.now() - pageLoadTimeRef.current;
      if (timeOnPage < minTimeForGeneralPrompt) {
        return false;
      }
    }

    setCurrentConfig(config);
    setIsPromptOpen(true);
    scheduledPromptRef.current = null;
    return true;
  }, [minTimeForGeneralPrompt]);

  // Mark feedback as given
  const markFeedbackGiven = useCallback((type: TestimonialType) => {
    feedbackGivenRef.current.add(type);
    saveFeedbackGiven(feedbackGivenRef.current);
  }, []);

  // Check if feedback was given
  const hasFeedbackBeenGiven = useCallback((type: TestimonialType): boolean => {
    return feedbackGivenRef.current.has(type);
  }, []);

  // Handle modal close
  const handleOpenChange = useCallback((open: boolean) => {
    setIsPromptOpen(open);
    if (!open) {
      setCurrentConfig(null);
    }
  }, []);

  // Handle successful submission
  const handleSuccess = useCallback(() => {
    if (currentConfig) {
      markFeedbackGiven(currentConfig.type);
    }
  }, [currentConfig, markFeedbackGiven]);

  // Note: beforeunload is NOT used because it shows browser's native dialog
  // which cannot be customized. Instead, we show modals automatically on
  // completion states (story coined, cenotaph design complete).

  const hasScheduledPrompt = scheduledPromptRef.current !== null;

  return (
    <TestimonialPromptContext.Provider
      value={{
        showPrompt,
        scheduleExitPrompt,
        clearExitPrompt,
        isPromptOpen,
        hasScheduledPrompt,
        triggerExitPrompt,
        markFeedbackGiven,
        hasFeedbackBeenGiven,
        isLoaded,
      }}
    >
      {children}
      {currentConfig && (
        <TestimonialPromptModal
          open={isPromptOpen}
          onOpenChange={handleOpenChange}
          type={currentConfig.type}
          contextId={currentConfig.contextId}
          contextMetadata={currentConfig.contextMetadata}
          title={currentConfig.title}
          description={currentConfig.description}
          onSuccess={handleSuccess}
        />
      )}
    </TestimonialPromptContext.Provider>
  );
}

export function useTestimonialPrompt() {
  const context = useContext(TestimonialPromptContext);
  if (!context) {
    throw new Error("useTestimonialPrompt must be used within a TestimonialPromptProvider");
  }
  return context;
}
