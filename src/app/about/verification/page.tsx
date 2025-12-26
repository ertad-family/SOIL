"use client";

import {
  Shield,
  ShieldCheck,
  Users,
  FileText,
  CheckCircle2,
  Globe,
  Search,
  BookOpen,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlossaryTerm } from "@/components/ui/glossary-term";

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-marble-100 mb-4">
            Verification on SOIL
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Verification ensures the authenticity of organizational stories. It confirms that
            organizations existed and that founders played the roles they claim.
          </p>
        </div>
      </section>

      {/* Why Verification Matters */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-6">Why Verification Matters</h2>
          <div className="space-y-4 text-slate-400">
            <p>
              SOIL is building a repository of organizational knowledge - lessons learned from
              companies that have closed their doors. For this knowledge to be valuable, it must be
              authentic.
            </p>
            <p>Verification serves two purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-marble-200">Confirms existence</strong> - The organization
                actually existed and operated as described
              </li>
              <li>
                <strong className="text-marble-200">Confirms role</strong> - The storyteller held
                the position they claim (founder, executive, team member, etc.)
              </li>
            </ul>
            <p>
              This creates a foundation of trust that makes the stories on SOIL valuable for
              researchers, future founders, and the broader entrepreneurial community.
            </p>
          </div>
        </div>
      </section>

      {/* Two Paths */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-8">Two Paths to Verification</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Social Verification */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-lg font-display text-marble-100">Social Verification</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Ask former colleagues, customers, partners, or investors to confirm your story.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">3 confirmations required</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Takes 30 seconds per person</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">No account required for verifiers</span>
                </li>
              </ul>
            </div>

            {/* Document Verification */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-lg font-display text-marble-100">Document Verification</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Upload official documents that prove your ownership or founding role.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Registration certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Registry extracts (EGRUL, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Reviewed within 1-3 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Verification Unlocks */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-8">What Verification Unlocks</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-medium text-marble-100 mb-1">
                    Public <GlossaryTerm term="Cenotaph">Cenotaph</GlossaryTerm>
                  </h3>
                  <p className="text-sm text-slate-400">
                    Publish your memorial with full details. Unverified organizations can be
                    published anonymously, but only verified ones can display their name publicly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-medium text-marble-100 mb-1">Searchable Experience</h3>
                  <p className="text-sm text-slate-400">
                    Your organization and experience become discoverable by other founders seeking
                    wisdom.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-medium text-marble-100 mb-1">Research Contribution</h3>
                  <p className="text-sm text-slate-400">
                    Only verified data can be used in organizational research. Help advance the
                    science of startups by making your experience scientifically valuable.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-medium text-marble-100 mb-1">Consulting Opportunities</h3>
                  <p className="text-sm text-slate-400">
                    Offer your expertise to the founder community. Help others avoid the pitfalls
                    you faced.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-marble-100 mb-2">Privacy & Confidentiality</h3>
                <p className="text-sm text-slate-400">
                  Verifier responses are confidential. We only share that verification was
                  successful - never who verified or what they said. Documents are reviewed by our
                  team and never shared publicly. You control what information appears on your{" "}
                  <GlossaryTerm term="Cenotaph">cenotaph</GlossaryTerm>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-display text-marble-100 mb-4">Ready to Verify?</h2>
          <p className="text-slate-400 mb-6">
            Go to your organization page and click &quot;Request Verification&quot; to get started.
          </p>
          <Button variant="dark-primary" size="md" asChild>
            <a href="/account">
              Go to My Organizations
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
