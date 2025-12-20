"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PagePrivacyContextType {
  /** Whether the current page is public (shows visitor particles) */
  isPagePublic: boolean;
  /** Set the current page's public status */
  setPagePublic: (isPublic: boolean) => void;
}

const PagePrivacyContext = createContext<PagePrivacyContextType | undefined>(undefined);

interface PagePrivacyProviderProps {
  children: ReactNode;
}

/**
 * PagePrivacyProvider - Provides page-level privacy control.
 *
 * Pages can use setPagePublic(false) to hide visitor particles.
 * Default is true (most pages are public).
 *
 * Used by:
 * - AppShell to control GlobalParticles visibility
 * - Organization page to hide particles in owner view
 */
export function PagePrivacyProvider({ children }: PagePrivacyProviderProps) {
  const [isPagePublic, setIsPagePublic] = useState(true);

  const setPagePublic = useCallback((isPublic: boolean) => {
    setIsPagePublic(isPublic);
  }, []);

  return (
    <PagePrivacyContext.Provider value={{ isPagePublic, setPagePublic }}>
      {children}
    </PagePrivacyContext.Provider>
  );
}

/**
 * usePagePrivacy - Hook to access page privacy controls.
 *
 * @example
 * // In a page component that should hide particles:
 * const { setPagePublic } = usePagePrivacy();
 * useEffect(() => {
 *   setPagePublic(false);
 *   return () => setPagePublic(true); // Reset on unmount
 * }, [setPagePublic]);
 */
export function usePagePrivacy(): PagePrivacyContextType {
  const context = useContext(PagePrivacyContext);
  if (!context) {
    throw new Error("usePagePrivacy must be used within a PagePrivacyProvider");
  }
  return context;
}
