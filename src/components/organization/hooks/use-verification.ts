"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VerificationRequest, VerificationDocument, VerificationTab } from "../types";

interface UseVerificationOptions {
  organizationId: string;
  isOwner: boolean;
}

interface UseVerificationReturn {
  // State
  verificationTab: VerificationTab;
  setVerificationTab: (tab: VerificationTab) => void;
  verificationRequests: VerificationRequest[];
  verificationDocuments: VerificationDocument[];
  isLoadingRequests: boolean;
  isLoadingDocuments: boolean;
  isRequestsCollapsed: boolean;
  setIsRequestsCollapsed: (collapsed: boolean) => void;

  // Computed values
  confirmedCount: number;
  pendingCount: number;
  approvedDocs: number;
  pendingDocs: number;
  hasDocumentVerification: boolean;

  // Actions
  fetchVerificationRequests: () => Promise<void>;
  fetchVerificationDocuments: () => Promise<void>;
  cancelVerificationRequest: (requestId: string) => Promise<void>;
}

export function useVerification({
  organizationId,
  isOwner,
}: UseVerificationOptions): UseVerificationReturn {
  const [verificationTab, setVerificationTab] = useState<VerificationTab>("social");
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [verificationDocuments, setVerificationDocuments] = useState<VerificationDocument[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isRequestsCollapsed, setIsRequestsCollapsed] = useState(true);

  // Fetch verification requests
  const fetchVerificationRequests = useCallback(async () => {
    if (!isOwner) return;

    setIsLoadingRequests(true);
    try {
      const res = await fetch(`/api/verification/request?organizationId=${organizationId}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch verification requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [organizationId, isOwner]);

  // Fetch verification documents
  const fetchVerificationDocuments = useCallback(async () => {
    if (!isOwner) return;

    setIsLoadingDocuments(true);
    try {
      const res = await fetch(`/api/verification/documents?organizationId=${organizationId}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch verification documents:", err);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [organizationId, isOwner]);

  // Cancel a verification request
  const cancelVerificationRequest = useCallback(async (requestId: string) => {
    try {
      const res = await fetch(`/api/verification/request?id=${requestId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVerificationRequests((prev) => prev.filter((r) => r.id !== requestId));
      } else {
        const data = await res.json();
        console.error("Failed to cancel request:", data.error);
      }
    } catch (err) {
      console.error("Failed to cancel verification request:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchVerificationRequests();
    fetchVerificationDocuments();
  }, [fetchVerificationRequests, fetchVerificationDocuments]);

  // Subscribe to realtime updates for verification requests
  const supabaseRef = useRef(createClient());
  useEffect(() => {
    if (!isOwner) return;

    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`verification-requests-${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "verification_requests",
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          setVerificationRequests((prev) =>
            prev.map((req) =>
              req.id === payload.new.id ? { ...req, ...(payload.new as VerificationRequest) } : req
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, isOwner]);

  // Computed values
  const confirmedCount = verificationRequests.filter((r) => r.status === "confirmed").length;
  const pendingCount = verificationRequests.filter((r) => r.status === "pending").length;
  const approvedDocs = verificationDocuments.filter((d) => d.status === "approved").length;
  const pendingDocs = verificationDocuments.filter((d) => d.status === "pending_review").length;
  const hasDocumentVerification = approvedDocs > 0;

  return {
    verificationTab,
    setVerificationTab,
    verificationRequests,
    verificationDocuments,
    isLoadingRequests,
    isLoadingDocuments,
    isRequestsCollapsed,
    setIsRequestsCollapsed,
    confirmedCount,
    pendingCount,
    approvedDocs,
    pendingDocs,
    hasDocumentVerification,
    fetchVerificationRequests,
    fetchVerificationDocuments,
    cancelVerificationRequest,
  };
}
