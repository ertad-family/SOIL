"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import Link from "next/link";

// ============================================================================
// TERMS OF SERVICE PAGE
// Last Updated: December 2025
// ============================================================================

export default function TermsOfServicePage() {
  const lastUpdated = "December 20, 2025";
  const effectiveDate = "December 20, 2025";

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl animate-fade-in-up mb-16">
          <SectionLabel>legal</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mt-4 mb-6 text-marble-100 leading-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400">
            Effective Date: <span className="text-marble-100">{effectiveDate}</span>
            <span className="mx-3 text-slate-600">|</span>
            Last Updated: <span className="text-marble-100">{lastUpdated}</span>
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              1. Introduction and Acceptance of Terms
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Welcome to SOIL (Social Organizational Intelligence Lab), operated by SOIL
                Foundation, a Delaware nonprofit corporation organized under Section 501(c)(3) of
                the Internal Revenue Code (&quot;SOIL Foundation,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the SOIL
                platform, including our website at soil.rip, mobile applications, and all related
                services (collectively, the &quot;Service&quot;). By accessing or using the Service,
                you agree to be bound by these Terms. If you do not agree to these Terms, you may
                not access or use the Service.
              </p>
              <Card variant="dark-elevated" padding="lg" className="border-gold-500/30 border">
                <h3 className="font-display text-lg font-medium text-gold-400 mb-3">Our Mission</h3>
                <p>
                  SOIL is a research-first nonprofit project devoted to collecting organizational
                  autopsy data at scale to establish a new scientific field: Organizational Biology,
                  Health, and Medicine. We transform organizational failure from wasted potential
                  into collective wisdom.
                </p>
              </Card>
              <Card variant="dark-elevated" padding="lg" className="border-gold-500/30 border">
                <h3 className="font-display text-lg font-medium text-gold-400 mb-3">Our Promise</h3>
                <p>
                  A founder can create a complete, dignified cenotaph (organizational memorial)
                  without paying anything. Paid services are separate offerings for additional needs
                  — never &quot;upgrades&quot; or &quot;premium versions&quot; of the free
                  experience.
                </p>
              </Card>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              2. Eligibility
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.1 Age Requirement
                </h3>
                <p>
                  You must be at least eighteen (18) years of age to use the Service. By using the
                  Service, you represent and warrant that you are at least 18 years old and have the
                  legal capacity to enter into these Terms.
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.2 Organizational Representation
                </h3>
                <p>
                  If you are creating a cenotaph for an organization, you represent and warrant
                  that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    You were a founder, co-founder, CEO, or other senior leader of the organization;
                    OR
                  </li>
                  <li>
                    You have authorization from such a person to contribute data about the
                    organization; AND
                  </li>
                  <li>The organization has permanently ceased operations.</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.3 Minimum Organization Definition
                </h3>
                <p>To be eligible for a cenotaph, an organization must have had:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    At least 2 people involved at some point (co-founder, employee, contractor); OR
                  </li>
                  <li>External stakeholders (paying customers, investors, formal suppliers)</li>
                </ul>
                <p className="mt-4 text-slate-500 text-sm">
                  Solo side projects without external stakeholders are not eligible.
                </p>
              </Card>
            </div>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              3. Description of Service
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card
                variant="dark-elevated"
                padding="lg"
                className="border-gold-500/30 border space-y-4"
              >
                <h3 className="font-display text-lg font-medium text-gold-400">
                  3.1 Core Services (Free Forever)
                </h3>
                <p>SOIL provides the following services at no cost:</p>
                <div className="space-y-3 mt-4">
                  <div>
                    <strong className="text-marble-100">Cenotaph Creation:</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>Full access to the Cenotaphery (virtual memorial space)</li>
                      <li>
                        Complete interview wizard process (Basic Info, Functional Mapping, Financial
                        Picture, Dynamic Picture, Environment Analysis, Founder Context, and
                        Narrative modules)
                      </li>
                      <li>AI-assisted interview option</li>
                      <li>AI-generated cenotaph design (initial design)</li>
                      <li>Full 3D cenotaph visualization with all structural elements</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-marble-100">Verification Services:</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>
                        Social verification system (colleague, customer, supplier, partner, investor
                        confirmations)
                      </li>
                      <li>Documentary verification option</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-marble-100">Community Participation:</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>Access to the founder community</li>
                      <li>Mentorship program eligibility (upon completion)</li>
                      <li>Participation in events including Day of the Dead Venture</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  3.2 Respects Currency System
                </h3>
                <p>SOIL operates an internal currency called &quot;Respects&quot; that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Is earned through valuable platform actions (completing wizards, verification,
                    referrals, community participation)
                  </li>
                  <li>
                    Can be spent on cenotaph customization (materials, environment, decorative
                    elements, lighting, audio)
                  </li>
                  <li>Can be gifted to other cenotaphs (not your own) to show appreciation</li>
                  <li>Has a fixed value (1 Respect = 1 Respect, no exchange rates)</li>
                  <li>Is non-expiring and account-bound</li>
                  <li>Cannot be traded for money or withdrawn</li>
                </ul>
                <p className="mt-4 text-slate-500 text-sm">
                  New users receive a welcome bonus of 10 Respects upon registration, which can only
                  be gifted to other cenotaphs.
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  3.3 Paid Services (Separate Offerings)
                </h3>
                <p>The following optional services are available for a fee:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>
                    <strong className="text-marble-100">Therapeutic Course:</strong> 5 sessions with
                    a business psychologist for professional psychological support during closure —
                    a separate service, not a &quot;premium&quot; cenotaph
                  </li>
                  <li>
                    <strong className="text-marble-100">Single Therapy Session:</strong> 1 session
                    with a business psychologist — optional professional support
                  </li>
                  <li>
                    <strong className="text-marble-100">Crypt Storage:</strong> Secure preservation
                    of organizational documents, code, and media (infrastructure cost recovery)
                  </li>
                  <li>
                    <strong className="text-marble-100">Cenotaph Redesign:</strong> New AI-generated
                    monument design after initial creation
                  </li>
                </ul>
                <p className="mt-4 text-slate-500 text-sm">
                  These paid services are clearly distinguished from the free cenotaph creation
                  process and are never positioned as &quot;upgrades&quot; or &quot;premium
                  versions.&quot;
                </p>
              </Card>
            </div>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              4. Account Registration and Security
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                To use certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="mt-4">
                You are responsible for maintaining the confidentiality of your account credentials.
                SOIL Foundation is not liable for any loss or damage arising from your failure to
                protect your account information. Each individual may maintain only one account.
              </p>
            </div>
          </section>

          {/* User Content and IP */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              5. User Content and Intellectual Property
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.1 Your Content
                </h3>
                <p>
                  &quot;User Content&quot; means any information, data, text, documents, images, or
                  other materials you submit to the Service, including organization information,
                  interview responses, financial data, personal narratives, and verification
                  documents.
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">5.2 Ownership</h3>
                <p>
                  You retain ownership of your User Content. By submitting User Content to the
                  Service, you grant SOIL Foundation a worldwide, non-exclusive, royalty-free
                  license to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Store, process, and display your User Content as necessary to provide the
                    Service
                  </li>
                  <li>
                    Use anonymized and aggregated patterns derived from User Content for research
                    purposes
                  </li>
                  <li>
                    Include your cenotaph in the public Cenotaphery (if you choose to make it
                    public)
                  </li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.3 Research License
                </h3>
                <p>
                  You understand and agree that SOIL Foundation may use your User Content for
                  scientific research purposes, subject to the following protections:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="text-gold-400 font-medium mb-2">Used for research:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Aggregated patterns</li>
                      <li>Anonymized models</li>
                      <li>Industry benchmarks</li>
                      <li>Framework validation studies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-gold-400 font-medium mb-2">NEVER sold or shared:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Raw founder stories in identifiable form</li>
                      <li>Individual organizational details without consent</li>
                      <li>Personal founder information</li>
                      <li>Interview recordings/transcripts in identifiable form</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.4 AI-Generated Content
                </h3>
                <p>
                  Cenotaph designs are generated using artificial intelligence (Google Vertex AI
                  Gemini and Imagen). You acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    AI-generated designs are created based on your organization&apos;s information
                    and optional design preferences
                  </li>
                  <li>Multiple design options are generated for your selection</li>
                  <li>The final selected design becomes part of your cenotaph</li>
                  <li>You receive a license to display and share your cenotaph design</li>
                  <li>
                    SOIL Foundation may use anonymized design generation data to improve the Service
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              6. Data Collection and Use
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                SOIL collects extensive data through the interview process. For complete details on
                how we collect, use, and protect your data, please see our{" "}
                <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <Card variant="dark-elevated" padding="lg" className="border-gold-500/30 border">
                <h3 className="font-display text-lg font-medium text-gold-400 mb-3">
                  Data as Sacred Trust
                </h3>
                <p>SOIL treats founder data as a sacred trust. We commit to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Never selling raw, identifiable founder stories</li>
                  <li>Never using data against founders&apos; interests</li>
                  <li>Always respecting founder control over visibility and deletion</li>
                  <li>Maintaining strict data protection standards</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Verification */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              7. Verification Requirements
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                Verification ensures the authenticity and trustworthiness of cenotaphs for research
                integrity. Cenotaphs must be verified before becoming publicly visible and
                searchable.
              </p>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  7.1 Verification Methods
                </h3>
                <div className="space-y-4">
                  <div>
                    <strong className="text-marble-100">Social Verification:</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>
                        Requires 3 or more confirmations from people who knew the organization
                      </li>
                      <li>
                        Eligible verifiers: former colleagues, customers, suppliers, partners,
                        investors
                      </li>
                      <li>Verification requests expire after 30 days</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-marble-100">Documentary Verification:</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>
                        Submission of official documents (registration certificates, dissolution
                        documents, etc.)
                      </li>
                      <li>Documents reviewed by SOIL administrators</li>
                      <li>One approved document achieves verification</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  7.2 Consequences of False Information
                </h3>
                <p>
                  Providing false or misleading information about an organization may result in:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cenotaph removal</li>
                  <li>Account suspension or termination</li>
                  <li>Reporting to appropriate authorities if fraud is suspected</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Privacy and Anonymity */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              8. Privacy and Anonymity Controls
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  8.1 Publicity Tiers
                </h3>
                <p>Founders choose their visibility level:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>
                    <strong className="text-marble-100">Full Anonymity (default):</strong> Pattern
                    and data only; no identifying information public
                  </li>
                  <li>
                    <strong className="text-marble-100">Pseudonym + Story:</strong> Industry,
                    geography, dates, narrative without real names
                  </li>
                  <li>
                    <strong className="text-marble-100">Full Publicity (opt-in):</strong>{" "}
                    Organization name, founder name, full story visible
                  </li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  8.2 Co-Founder Considerations
                </h3>
                <p>You own your story; you do not own other people&apos;s identities.</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="text-gold-400 font-medium mb-2">
                      Proceeds without others&apos; consent:
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>Organization name, dates, industry, what it did</li>
                      <li>Your personal narrative and learnings</li>
                      <li>Framework analysis from your perspective</li>
                      <li>Anonymized data contribution</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-gold-400 font-medium mb-2">Requires consent:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Naming other co-founders by name</li>
                      <li>Specific characterizations of named individuals</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              9. Third-Party Services
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>SOIL uses the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-marble-100">Supabase:</strong> Authentication, database,
                  file storage
                </li>
                <li>
                  <strong className="text-marble-100">Google Cloud Vertex AI:</strong> AI-generated
                  cenotaph designs (Gemini, Imagen)
                </li>
                <li>
                  <strong className="text-marble-100">Vercel:</strong> Website hosting and
                  deployment
                </li>
                <li>
                  <strong className="text-marble-100">Resend:</strong> Transactional email delivery
                </li>
              </ul>
              <p className="mt-4">
                By using the cenotaph design feature, you consent to AI processing of your
                organization information and design preferences by Google Cloud.
              </p>
            </div>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              10. Prohibited Conduct
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>You agree not to:</p>
              <Card variant="dark" padding="lg" className="space-y-4">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Create false or misleading cenotaphs for organizations that did not exist or did
                    not close
                  </li>
                  <li>Impersonate another person or organization</li>
                  <li>Create multiple accounts to manipulate Respects or verification</li>
                  <li>
                    Attempt to manipulate the Cenotavr Award through coordinated Respects gifting
                  </li>
                  <li>
                    Submit content that is defamatory, libelous, or invasive of others&apos; privacy
                  </li>
                  <li>Submit content that harasses, threatens, or harms any person</li>
                  <li>Upload malware, viruses, or other harmful code</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Scrape, harvest, or collect data from the Service without authorization</li>
                  <li>Use the Service for any illegal purpose</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              11. Disclaimer of Warranties
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <p className="uppercase text-sm tracking-wide">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
                  WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                  NON-INFRINGEMENT.
                </p>
                <p className="mt-4">SOIL Foundation does not warrant:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The accuracy, completeness, or reliability of any User Content</li>
                  <li>
                    That any cenotaph accurately represents the organization or events described
                  </li>
                  <li>That verification confirms the truth of all claims made in a cenotaph</li>
                  <li>That the Service will be uninterrupted, secure, or error-free</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              12. Limitation of Liability
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <p className="uppercase text-sm tracking-wide">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SOIL FOUNDATION SHALL NOT BE
                  LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                  INTANGIBLE LOSSES.
                </p>
                <p className="mt-4 uppercase text-sm tracking-wide">
                  IN NO EVENT SHALL SOIL FOUNDATION&apos;S TOTAL LIABILITY TO YOU FOR ALL CLAIMS
                  EXCEED THE AMOUNT YOU PAID TO SOIL FOUNDATION, IF ANY, FOR USE OF THE SERVICE
                  DURING THE TWELVE (12) MONTHS PRIOR TO THE CLAIM.
                </p>
              </Card>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              13. Indemnification
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                You agree to indemnify, defend, and hold harmless SOIL Foundation, its officers,
                directors, employees, agents, and successors from and against any and all claims,
                liabilities, damages, losses, costs, and expenses (including reasonable
                attorneys&apos; fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the Service</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any claim that your User Content caused damage to a third party</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              14. Termination
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  14.1 Your Right to Terminate
                </h3>
                <p>
                  You may terminate your account at any time by contacting us. Upon termination:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your account will be deactivated</li>
                  <li>You may request deletion of your User Content</li>
                  <li>Any Respects in your account will be forfeited</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  14.2 Data Deletion Rights
                </h3>
                <p>
                  You have the right to request deletion of your personal data and User Content:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your cenotaph will be removed from the Cenotaphery</li>
                  <li>Your personal information will be deleted from our systems</li>
                  <li>
                    Aggregated, anonymized patterns derived from your data may be retained for
                    research purposes
                  </li>
                  <li>Deletion will be completed within 30 days</li>
                </ul>
                <p className="mt-4">
                  To request deletion, contact{" "}
                  <a
                    href="mailto:privacy@soil.rip"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    privacy@soil.rip
                  </a>
                  .
                </p>
              </Card>
            </div>
          </section>

          {/* GDPR */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              15. International Users and GDPR Compliance
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                SOIL is available globally. By using the Service, you consent to the transfer of
                your information to the United States and other countries which may have different
                data protection laws than your country of residence.
              </p>
              <p>
                If you are located in the European Economic Area (EEA), United Kingdom, or
                Switzerland, you have additional rights under the General Data Protection Regulation
                (GDPR), including rights of access, rectification, erasure, restriction, data
                portability, objection, and withdrawal of consent. See our{" "}
                <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline">
                  Privacy Policy
                </Link>{" "}
                for full details.
              </p>
            </div>
          </section>

          {/* Community Events */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              16. Day of the Dead Venture and Community Events
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  16.1 Annual Celebration
                </h3>
                <p>
                  SOIL hosts the annual &quot;Day of the Dead Venture&quot; on October 19th — a
                  global day of remembrance for failed organizations. Participation is voluntary and
                  not gamified (no Respects are awarded for attendance).
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  16.2 The Cenotavr Award
                </h3>
                <p>
                  The Cenotavr Award recognizes the most impactful cenotaph of the year, determined
                  entirely by objective platform metrics (total Respects received). By creating a
                  public, verified cenotaph, you are automatically eligible unless you opt out.
                  There are no applications, nominations, or jury decisions.
                </p>
              </Card>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              17. Modifications to Terms
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                SOIL Foundation reserves the right to modify these Terms at any time. We will
                provide notice of material changes by posting the updated Terms on the Service and
                sending an email notification to registered users.
              </p>
              <p>
                Your continued use of the Service after any modifications constitutes acceptance of
                the updated Terms. If you do not agree to the modified Terms, you must discontinue
                use of the Service.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              18. Governing Law and Dispute Resolution
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the
                  State of Delaware, United States, without regard to its conflict of law
                  provisions.
                </p>
                <p>
                  Any dispute arising out of or relating to these Terms or the Service shall be
                  resolved exclusively in the state or federal courts located in Delaware, and you
                  consent to the personal jurisdiction of such courts.
                </p>
                <p>
                  Any claim arising out of or relating to these Terms or the Service must be filed
                  within one (1) year after the cause of action arose, or such claim shall be
                  permanently barred.
                </p>
                <p className="uppercase text-sm tracking-wide mt-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU AGREE THAT ANY DISPUTE RESOLUTION
                  PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS,
                  CONSOLIDATED, OR REPRESENTATIVE ACTION.
                </p>
              </Card>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              19. Contact Information
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>If you have questions about these Terms, please contact us:</p>
              <Card variant="dark-elevated" padding="lg" className="space-y-4">
                <div>
                  <p className="text-marble-100 font-medium">SOIL Foundation</p>
                  <p className="text-slate-500 text-sm">
                    (Delaware 501(c)(3) Nonprofit — In Formation)
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-marble-100">General Inquiries:</strong>{" "}
                    <a
                      href="mailto:hello@soil.rip"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      hello@soil.rip
                    </a>
                  </p>
                  <p>
                    <strong className="text-marble-100">Privacy Concerns:</strong>{" "}
                    <a
                      href="mailto:privacy@soil.rip"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      privacy@soil.rip
                    </a>
                  </p>
                  <p>
                    <strong className="text-marble-100">Legal Matters:</strong>{" "}
                    <a
                      href="mailto:legal@soil.rip"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      legal@soil.rip
                    </a>
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Decorative divider */}
          <div className="divider-roman pt-12">
            <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">SPQR</span>
          </div>

          {/* Summary Card */}
          <Card variant="dark-elevated" padding="lg" className="border-gold-500/20 border">
            <h3 className="font-display text-xl font-medium text-marble-100 mb-4">Terms Summary</h3>
            <div className="grid md:grid-cols-2 gap-6 text-slate-400">
              <div>
                <h4 className="text-gold-400 font-medium mb-2">You Get:</h4>
                <ul className="space-y-1 text-sm">
                  <li>Free complete cenotaph creation</li>
                  <li>AI-generated memorial design</li>
                  <li>Verification and community access</li>
                  <li>Control over your visibility</li>
                  <li>Right to delete your data</li>
                  <li>Respects currency for customization</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold-400 font-medium mb-2">You Agree To:</h4>
                <ul className="space-y-1 text-sm">
                  <li>Provide accurate information</li>
                  <li>Be 18+ years old</li>
                  <li>Respect others&apos; privacy</li>
                  <li>Not misuse the platform</li>
                  <li>Allow research use of anonymized data</li>
                  <li>Accept Delaware jurisdiction</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Related Links */}
          <div className="flex flex-wrap gap-4 pt-8">
            <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline text-sm">
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/about" className="text-gold-400 hover:text-gold-300 underline text-sm">
              About SOIL
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
