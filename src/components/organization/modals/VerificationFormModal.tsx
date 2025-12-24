"use client";

import { useState } from "react";
import { XCircle, Plus, Trash2, Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RELATIONSHIP_LABELS } from "../constants";
import type { VerificationRelationship } from "../types";

// Role labels for email preview
const ROLE_LABELS_FOR_EMAIL: Record<string, string> = {
  founder: "the Founder",
  co_founder: "a Co-Founder",
  cofounder: "a Co-Founder",
  executive: "an Executive",
  ceo_non_founder: "the CEO",
  employee: "a team member",
  customer: "a customer",
  supplier: "a supplier",
  partner: "a partner",
  investor: "an investor",
  other: "a team member",
};

interface VerificationFormModalProps {
  organizationId: string;
  organizationName: string;
  confirmedCount: number;
  pendingCount: number;
  requesterName: string;
  requesterRole: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function VerificationFormModal({
  organizationId,
  organizationName,
  confirmedCount,
  pendingCount,
  requesterName,
  requesterRole,
  onClose,
  onSuccess,
}: VerificationFormModalProps) {
  // Calculate needed confirmations: 3 total required, minus confirmed and pending
  const neededCount = Math.max(1, 3 - confirmedCount - pendingCount);

  // Format role for display
  const roleLabel = requesterRole
    ? ROLE_LABELS_FOR_EMAIL[requesterRole] || "a team member"
    : "a team member";

  // Initialize with the required number of contact fields
  const [contacts, setContacts] = useState<
    Array<{
      email: string;
      name: string;
      relationship: VerificationRelationship;
    }>
  >(() =>
    Array.from({ length: neededCount }, () => ({
      email: "",
      name: "",
      relationship: "colleague" as VerificationRelationship,
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContact = () => {
    if (contacts.length < 10) {
      setContacts([...contacts, { email: "", name: "", relationship: "colleague" }]);
    }
  };

  const removeContact = (index: number) => {
    // Don't allow removing below the required minimum
    if (contacts.length > neededCount) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validContacts = contacts.filter((c) => c.email.trim());
    if (validContacts.length === 0) {
      setError("Please add at least one contact");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const contact of validContacts) {
      if (!emailRegex.test(contact.email)) {
        setError(`Invalid email format: ${contact.email}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          contacts: validContacts.map((c) => ({
            email: c.email.trim(),
            name: c.name.trim() || undefined,
            relationship: c.relationship,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send verification requests");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send requests");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">Request Verification</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Ask people who can confirm that{" "}
            <strong className="text-marble-200">{organizationName}</strong> existed and your role in
            it.{" "}
            {confirmedCount + pendingCount >= 3 ? (
              <>
                You already have{" "}
                <strong className="text-gold-400">
                  {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
                </strong>
                . Add more contacts to increase your chances.
              </>
            ) : (
              <>
                You need{" "}
                <strong className="text-gold-400">{3 - confirmedCount - pendingCount} more</strong>{" "}
                confirmation{3 - confirmedCount - pendingCount !== 1 ? "s" : ""}.
              </>
            )}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Two-column layout */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column: Contacts */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-3">
                  Contacts to ask
                </h3>

                {/* Tip */}
                <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gold-300">
                    <strong>Tip:</strong> The more people you ask, the faster verification will
                    complete.
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="email"
                          placeholder="Email *"
                          value={contact.email}
                          onChange={(e) => updateContact(index, "email", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Name (optional)"
                            value={contact.name}
                            onChange={(e) => updateContact(index, "name", e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                          />
                          <select
                            value={contact.relationship}
                            onChange={(e) => updateContact(index, "relationship", e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                          >
                            <option value="colleague">Ex-Colleague</option>
                            <option value="customer">Ex-Customer</option>
                            <option value="supplier">Ex-Supplier</option>
                            <option value="partner">Ex-Partner</option>
                            <option value="investor">Ex-Investor</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      {contacts.length > neededCount && (
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {contacts.length < 10 && (
                  <button
                    type="button"
                    onClick={addContact}
                    className="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add another contact
                  </button>
                )}
              </div>

              {/* Right column: Email Preview (always visible) */}
              <div className="lg:border-l lg:border-slate-700 lg:pl-6">
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Preview
                </h3>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                  <p className="text-slate-300 mb-3">
                    <strong className="text-marble-200">Subject:</strong> {requesterName} asks for
                    your help preserving {organizationName}&apos;s legacy
                  </p>
                  <div className="text-slate-400 space-y-2.5">
                    <p>
                      Hi <span className="text-marble-200">[Recipient Name]</span>,
                    </p>

                    <p>
                      <strong className="text-marble-200">{requesterName}</strong>, who was{" "}
                      <strong className="text-gold-400">{roleLabel}</strong> of{" "}
                      <strong className="text-marble-200">{organizationName}</strong>, is
                      documenting the organization&apos;s story on SOIL — a platform dedicated to
                      preserving the legacies of organizations that have closed.
                    </p>

                    <p>
                      Every year, millions of companies close their doors. Their stories, lessons,
                      and the people who built them risk being forgotten. SOIL exists to change that
                      — creating digital cenotaphs that honor these journeys and help future
                      founders learn from the past.
                    </p>

                    <p>
                      <strong className="text-marble-200">{requesterName}</strong> listed you as{" "}
                      <strong className="text-gold-400">
                        an{" "}
                        {contacts[0]
                          ? RELATIONSHIP_LABELS[contacts[0].relationship].toLowerCase()
                          : "contact"}
                      </strong>{" "}
                      who can confirm that {organizationName} existed and their role in it. Your
                      verification helps ensure authenticity and honors the real story.
                    </p>

                    <div className="bg-gold-500/10 border border-gold-500/20 rounded p-2.5 my-2">
                      <p className="text-gold-300 text-xs">
                        <strong>It takes just 30 seconds:</strong> Click the button below, review
                        the details, and confirm.
                      </p>
                    </div>

                    <p className="text-gold-400 font-medium">[Verify Now Button]</p>

                    <p className="text-slate-500 text-xs pt-2 border-t border-slate-700">
                      If you don&apos;t recognize {requesterName} or {organizationName}, simply
                      ignore this email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isSubmitting}
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )
                }
              >
                {isSubmitting ? "Sending..." : "Send Requests"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
