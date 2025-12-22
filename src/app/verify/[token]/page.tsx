"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Loader2,
  AlertCircle,
  User,
  BadgeCheck,
  Landmark,
  MessageSquarePlus,
  ArrowRight,
} from "lucide-react";

// Claimed role labels
const ROLE_LABELS: Record<string, string> = {
  founder: "Founder",
  co_founder: "Co-Founder",
  cofounder: "Co-Founder",
  executive: "Executive",
  ceo_non_founder: "CEO (Non-Founder)",
  employee: "Employee",
  customer: "Customer",
  supplier: "Supplier",
  partner: "Partner",
  investor: "Investor",
  other: "Team Member",
};

interface Organization {
  id: string;
  name: string;
  organization_type: string | null;
  founded_date: string | null;
  closed_date: string | null;
}

interface VerificationRequest {
  id: string;
  verifierEmail: string;
  verifierName: string | null;
  relationship: string;
  requesterName: string | null;
  claimedRole: string | null;
  organization: Organization | null;
}

type PageState =
  | "loading"
  | "ready"
  | "submitting"
  | "success"
  | "error"
  | "expired"
  | "already_responded";

export default function VerifyPage() {
  const params = useParams();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [resultAction, setResultAction] = useState<"confirm" | "decline" | null>(null);

  // Fetch verification request info
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/verification/${token}`);

        if (res.status === 410) {
          setPageState("expired");
          return;
        }

        if (res.status === 400) {
          const data = await res.json();
          if (data.error?.includes("already been responded")) {
            setPageState("already_responded");
            return;
          }
        }

        if (!res.ok) {
          throw new Error("Verification request not found");
        }

        const data = await res.json();
        setRequest(data.request);
        setPageState("ready");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to load verification request");
        setPageState("error");
      }
    };

    fetchRequest();
  }, [token]);

  // Handle verification response
  const handleResponse = async (action: "confirm" | "decline") => {
    setPageState("submitting");
    setResultAction(action);

    try {
      const res = await fetch(`/api/verification/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          message: responseMessage.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit response");
      }

      setPageState("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit response");
      setPageState("error");
    }
  };

  // Format lifespan
  const formatLifespan = (founded: string | null, closed: string | null) => {
    if (!founded) return null;
    const start = founded.replace("-", ".");
    const end = closed ? closed.replace("-", ".") : "present";
    return `${start} — ${end}`;
  };

  // Loading state
  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card variant="dark" className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gold-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading verification request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card variant="dark" className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-display text-marble-100 mb-2">Error</h1>
            <p className="text-slate-400">{errorMessage || "Something went wrong"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expired state
  if (pageState === "expired") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card variant="dark" className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-display text-marble-100 mb-2">Link Expired</h1>
            <p className="text-slate-400">
              This verification link has expired. Please ask the organization owner to send a new
              invitation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already responded state
  if (pageState === "already_responded") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card variant="dark" className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-xl font-display text-marble-100 mb-2">Already Responded</h1>
            <p className="text-slate-400">
              You have already responded to this verification request. Thank you!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (pageState === "success") {
    const orgName = request?.organization?.name;

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Thank you message */}
          <Card variant="dark">
            <CardContent className="py-8 text-center">
              {resultAction === "confirm" ? (
                <>
                  <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h1 className="text-xl font-display text-marble-100 mb-2">
                    Thank You for Verifying!
                  </h1>
                  <p className="text-slate-400">
                    Your confirmation helps preserve the legacy of {orgName}. The organization owner
                    will be notified.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h1 className="text-xl font-display text-marble-100 mb-2">Response Recorded</h1>
                  <p className="text-slate-400">
                    Thank you for your response. The organization owner will be notified.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* CTAs Section */}
          <Card variant="dark">
            <CardContent className="py-6 space-y-5">
              {/* CTA a: Share Your Story */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-3">
                  <Landmark className="w-5 h-5 text-gold-400" />
                </div>
                <h2 className="text-lg font-display text-marble-100 mb-1">
                  Have you experienced organizational closure?
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Transform your experience into valuable insights for others.
                </p>
                <Button variant="dark-primary" size="md" asChild>
                  <Link href="/signup">
                    Share Your Story
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700" />

              {/* CTA b: Add Perspective (Coming Soon) */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
                  <MessageSquarePlus className="w-5 h-5 text-slate-400" />
                </div>
                <h2 className="text-base font-display text-marble-100 mb-1">
                  Share your perspective about {orgName}
                </h2>
                <p className="text-sm text-slate-400 mb-3">
                  Add your unique viewpoint as a former colleague, partner, or stakeholder.
                </p>
                <Button variant="dark-ghost" size="sm" disabled className="opacity-60">
                  Add Your Perspective
                  <span className="ml-2 text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CTA c: Learn More */}
          <div className="text-center">
            <Link
              href="/community"
              className="text-sm text-slate-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
            >
              Learn about our research & community
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ready state - show verification form
  const org = request?.organization;
  const requesterName = request?.requesterName || "Someone";
  const claimedRole = request?.claimedRole
    ? ROLE_LABELS[request.claimedRole] || request.claimedRole
    : null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="text-2xl font-display text-marble-100 mb-2">Verification Request</h1>
          <p className="text-slate-400">
            You&apos;ve been asked to verify information about an organization
          </p>
        </div>

        {/* Main Card */}
        <Card variant="dark">
          <CardHeader className="pb-4">
            <CardTitle variant="dark" className="text-center">
              Can you confirm this?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What to verify */}
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
              {/* Organization */}
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gold-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Organization
                  </p>
                  <p className="text-marble-100 font-medium">{org?.name || "Unknown"}</p>
                  {org?.founded_date && (
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatLifespan(org.founded_date, org.closed_date)}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700" />

              {/* Requester's claimed role */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gold-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Claims to be
                  </p>
                  <p className="text-marble-100">
                    <span className="font-medium">{requesterName}</span>
                    {claimedRole && (
                      <span className="text-slate-400"> was {claimedRole.toLowerCase()}</span>
                    )}
                    {!claimedRole && (
                      <span className="text-slate-400"> was associated with this organization</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification question */}
            <div className="text-center p-4 border border-gold-500/30 rounded-lg bg-gold-500/5">
              <BadgeCheck className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-marble-200 font-medium">
                Can you confirm that this organization existed
                {claimedRole && (
                  <>
                    {" "}
                    and that <strong>{requesterName}</strong> was {claimedRole.toLowerCase()}
                  </>
                )}
                ?
              </p>
            </div>

            {/* Optional message */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Optional message (private)
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Any additional comments..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 resize-none"
                disabled={pageState === "submitting"}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="dark-ghost"
                className="flex-1"
                onClick={() => handleResponse("decline")}
                disabled={pageState === "submitting"}
                leftIcon={
                  pageState === "submitting" && resultAction === "decline" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )
                }
              >
                I Cannot Confirm
              </Button>
              <Button
                variant="dark-primary"
                className="flex-1"
                onClick={() => handleResponse("confirm")}
                disabled={pageState === "submitting"}
                leftIcon={
                  pageState === "submitting" && resultAction === "confirm" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )
                }
              >
                Yes, I Confirm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          This verification helps preserve authentic organizational histories. Your response is
          confidential.
        </p>
      </div>
    </div>
  );
}
