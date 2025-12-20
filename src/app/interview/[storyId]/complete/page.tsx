"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

/**
 * Story Complete Page - Redirect to integrated overview
 *
 * The completion view has been integrated into the main story overview page.
 * This page now redirects to maintain backward compatibility with any existing links.
 */
export default function CompletePage() {
  const router = useRouter();
  const params = useParams();
  const storyId = params.storyId;

  React.useEffect(() => {
    // Redirect to the main story overview page which now includes the completion view
    if (storyId) {
      router.replace(`/interview/${storyId}`);
    }
  }, [storyId, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
