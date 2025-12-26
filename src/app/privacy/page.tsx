"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";

// ============================================================================
// PRIVACY POLICY PAGE
// Last Updated: December 2025
// ============================================================================

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 22, 2025";

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl animate-fade-in-up mb-16">
          <SectionLabel>legal</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mt-4 mb-6 text-marble-100 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400">
            Last Updated: <span className="text-marble-100">{lastUpdated}</span>
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              1. Introduction
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Welcome to SOIL (Social Organizational Intelligence Lab). This Privacy Policy
                explains how SOIL Foundation, a Delaware 501(c)(3) nonprofit organization
                (&quot;SOIL,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), collects,
                uses, discloses, and protects your personal information when you use our website,
                platform, and services (collectively, the &quot;Services&quot;).
              </p>
              <p>
                SOIL is a research-first project devoted to collecting{" "}
                <GlossaryTerm term="Autopsy">organizational autopsy</GlossaryTerm> data at scale to
                advance the scientific understanding of organizational mortality. We are committed
                to protecting your privacy while fulfilling our research mission.
              </p>
              <p>
                By using our Services, you agree to the collection and use of information in
                accordance with this Privacy Policy. If you do not agree with our policies and
                practices, please do not use our Services.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>We collect several types of information from and about users of our Services:</p>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.1 Account Information
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email address</li>
                  <li>Name (optional display name)</li>
                  <li>Profile information you choose to provide</li>
                  <li>Authentication data (passwords are securely hashed)</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.2 Organizational Autopsy Data
                </h3>
                <p>
                  When you contribute data about an organization through our interview wizard, we
                  collect:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-marble-100">Basic Information:</strong> Organization
                    name, type, industry, location, founding and closure dates, lifecycle stage,
                    team size
                  </li>
                  <li>
                    <strong className="text-marble-100">Functional Mapping:</strong> Organizational
                    structure, function assessments, health indicators, staffing details
                  </li>
                  <li>
                    <strong className="text-marble-100">Financial Picture:</strong> Revenue metrics,
                    funding history, financial events, optional document uploads (financial
                    statements, pitch decks)
                  </li>
                  <li>
                    <strong className="text-marble-100">Dynamic Picture:</strong> Timeline events,
                    organizational changes, crisis events
                  </li>
                  <li>
                    <strong className="text-marble-100">Environment Analysis:</strong> Market
                    conditions, external events, resource availability
                  </li>
                  <li>
                    <strong className="text-marble-100">Founder Context:</strong> Background,
                    experience, personal impact of closure (health, relationships, finances)
                  </li>
                  <li>
                    <strong className="text-marble-100">Narrative:</strong> Your interpretation of
                    events, lessons learned, advice for others
                  </li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.3 Verification Data
                </h3>
                <p>
                  To ensure data quality, we collect verification information from colleagues and
                  stakeholders you invite:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verifier email addresses (provided by you)</li>
                  <li>Relationship type to the organization</li>
                  <li>Confirmation of basic organizational facts</li>
                  <li>Optional: Their perspective on organizational dynamics</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.4 Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address</li>
                  <li>Pages visited and actions taken on our platform</li>
                  <li>Referring website</li>
                  <li>Date and time of visits</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.5 Communication Data
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Emails you send to us</li>
                  <li>Waitlist subscriptions and newsletter preferences</li>
                  <li>Support inquiries</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  2.6 Payment Information
                </h3>
                <p>
                  For paid services (such as the Therapeutic Course or Crypt Storage), payment
                  processing is handled by Stripe. We do not store your full credit card number.
                  Stripe may share with us:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Last four digits of your card</li>
                  <li>Card expiration date</li>
                  <li>Billing address</li>
                  <li>Transaction history</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  3.1 Research Purposes
                </h3>
                <p>Our primary mission is scientific research. We use organizational data to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Identify patterns in organizational mortality</li>
                  <li>Develop and validate diagnostic frameworks</li>
                  <li>Create predictive models for organizational health</li>
                  <li>Publish academic research (using anonymized, aggregated data only)</li>
                  <li>Advance the field of Organizational Medicine</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  3.2 Platform Operations
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create and manage your account</li>
                  <li>Process your organizational data contributions</li>
                  <li>Generate and display your cenotaph (memorial)</li>
                  <li>Facilitate the verification process</li>
                  <li>Provide customer support</li>
                  <li>Process payments for optional services</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  3.3 Communications
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Send verification request emails to colleagues you designate</li>
                  <li>Notify you about your cenotaph status and verification progress</li>
                  <li>Send reminders about incomplete data submissions (with your consent)</li>
                  <li>
                    Send newsletters and updates to waitlist subscribers (with explicit opt-in)
                  </li>
                  <li>Respond to your inquiries</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  3.4 Improvement and Analytics
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analyze usage patterns to improve our Services</li>
                  <li>Detect and prevent technical issues</li>
                  <li>Measure the effectiveness of our platform</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Legal Basis for Processing */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              4. Legal Basis for Processing (GDPR)
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                For users in the European Economic Area (EEA), United Kingdom, and Switzerland, we
                process personal data under the following legal bases:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong className="text-marble-100">Consent:</strong> When you voluntarily
                  contribute organizational data through our interview wizard, subscribe to our
                  newsletter, or opt into specific features.
                </li>
                <li>
                  <strong className="text-marble-100">Contract Performance:</strong> When processing
                  is necessary to provide our Services to you (account management, cenotaph
                  creation).
                </li>
                <li>
                  <strong className="text-marble-100">Legitimate Interests:</strong> For research
                  purposes (with appropriate safeguards), platform improvement, and security.
                </li>
                <li>
                  <strong className="text-marble-100">Legal Obligation:</strong> When we must comply
                  with applicable laws.
                </li>
                <li>
                  <strong className="text-marble-100">
                    Scientific Research (GDPR Article 89):
                  </strong>{" "}
                  Processing for scientific research purposes with appropriate safeguards.
                </li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              5. Information Sharing and Disclosure
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark-elevated" padding="lg" className="border-gold-500/30 border">
                <h3 className="font-display text-lg font-medium text-gold-400 mb-3">
                  What We Never Do
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>We never sell your raw, identifiable data</strong>
                  </li>
                  <li>We never share individual founder stories without explicit consent</li>
                  <li>We never use your data against your interests</li>
                  <li>We never provide individual data to potential employers or investors</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.1 Public Display (Cenotaph)
                </h3>
                <p>
                  Stories and cenotaphs are always anonymized by default. Based on your privacy
                  settings, you can choose to reveal limited identifying information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-marble-100">Full Anonymity (default):</strong> No
                    identifying information displayed — organization and founder names are hidden
                  </li>
                  <li>
                    <strong className="text-marble-100">Organization Name Visible (opt-in):</strong>{" "}
                    You may choose to reveal your organization&apos;s name while keeping your
                    personal identity private
                  </li>
                  <li>
                    <strong className="text-marble-100">Founder Name Visible (opt-in):</strong> You
                    may choose to reveal your name for networking and consultation purposes, in
                    addition to or separately from your organization name
                  </li>
                </ul>
                <p className="mt-4">
                  <strong className="text-marble-100">Important:</strong> Even with visibility
                  settings enabled, the narrative content and organizational details in your
                  cenotaph remain anonymized. Only the organization name and/or founder name can be
                  revealed — never other individuals mentioned in your story (employees,
                  co-founders, investors, etc.).
                </p>
                <p className="mt-2">
                  You control your visibility settings and can change them at any time.
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.2 Research Access
                </h3>
                <p>
                  Qualified academic researchers may access anonymized, aggregated datasets for
                  scientific research. This access:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Requires approval from our Data Access Committee</li>
                  <li>Is governed by strict data use agreements</li>
                  <li>Never includes individual identifying information</li>
                  <li>Is limited to legitimate research purposes</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.3 Commercial Services (Aggregated Data Only)
                </h3>
                <p>Future commercial spin-offs may use:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Aggregated patterns (e.g., &quot;X% of organizations with Y characteristics
                    experienced Z&quot;)
                  </li>
                  <li>Anonymized predictive models</li>
                  <li>Industry benchmarks without individual identification</li>
                </ul>
                <p className="mt-4">
                  These services never have access to your individual, identifiable data.
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.4 Service Providers
                </h3>
                <p>
                  We share information with trusted service providers who assist our operations:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-marble-100">Supabase:</strong> Database hosting,
                    authentication, file storage
                  </li>
                  <li>
                    <strong className="text-marble-100">Vercel:</strong> Website hosting and
                    delivery
                  </li>
                  <li>
                    <strong className="text-marble-100">Stripe:</strong> Payment processing
                  </li>
                  <li>
                    <strong className="text-marble-100">Resend:</strong> Transactional email
                    delivery
                  </li>
                  <li>
                    <strong className="text-marble-100">Google Analytics:</strong> Website analytics
                    (see Cookies section)
                  </li>
                </ul>
                <p className="mt-4">
                  These providers are contractually bound to protect your information and use it
                  only for the services they provide to us.
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  5.5 Legal Requirements
                </h3>
                <p>
                  We may disclose information when required by law or in good faith belief that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Compliance with a legal obligation is necessary</li>
                  <li>Protection of our rights or property is required</li>
                  <li>Prevention of illegal activity is necessary</li>
                  <li>Protection of personal safety of users or the public is required</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Your Privacy Controls */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              6. Your Privacy Controls
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                We believe founders should maintain control over their data. You have the following
                controls:
              </p>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  6.1 Visibility Settings
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Choose your anonymity level (from full anonymous to full public)</li>
                  <li>Select how your organization name appears (veiled, unnamed, undisclosed)</li>
                  <li>Control which parts of your story are visible</li>
                  <li>Change visibility settings at any time</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  6.2 Data Deletion
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Delete your cenotaph and associated data at any time</li>
                  <li>
                    Request deletion of your account and all personal information Request deletion
                    of your account and all personal information
                  </li>
                  <li>
                    Note: Anonymized data that has already been included in published research
                    cannot be removed, as it is no longer identifiable
                  </li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  6.3 Access and Portability
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>View all data you have provided</li>
                  <li>See who has accessed your data and how</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  6.4 Consent Granularity
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Opt in or out of specific research uses</li>
                  <li>Control email preferences (newsletters, reminders)</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              7. Data Security
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-marble-100">Encryption:</strong> Data is encrypted at rest
                  and in transit using industry-standard protocols
                </li>
                <li>
                  <strong className="text-marble-100">Access Controls:</strong> Role-based access
                  ensures only authorized personnel can access specific data types
                </li>
                <li>
                  <strong className="text-marble-100">Audit Logging:</strong> All data access is
                  logged and monitored
                </li>
                <li>
                  <strong className="text-marble-100">Secure Infrastructure:</strong> Our platform
                  is hosted on enterprise-grade cloud infrastructure (Supabase, Vercel)
                </li>
                <li>
                  <strong className="text-marble-100">Regular Security Reviews:</strong> We
                  periodically assess and update our security practices
                </li>
              </ul>
              <p>
                While we strive to protect your personal information, no method of transmission over
                the Internet or electronic storage is 100% secure. We cannot guarantee absolute
                security.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              8. Data Retention
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>We retain your information as follows:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong className="text-marble-100">Account Data:</strong> Retained while your
                  account is active, plus 30 days after deletion request
                </li>
                <li>
                  <strong className="text-marble-100">Cenotaph Data:</strong> Retained permanently
                  as part of our research archive (this is the purpose of the memorial), unless you
                  request deletion
                </li>
                <li>
                  <strong className="text-marble-100">Anonymized Research Data:</strong> Retained
                  indefinitely for research purposes (cannot be linked back to individuals)
                </li>
                <li>
                  <strong className="text-marble-100">Communication Logs:</strong> Retained for 3
                  years for support and legal purposes
                </li>
                <li>
                  <strong className="text-marble-100">Payment Records:</strong> Retained as required
                  by law (typically 7 years for tax purposes)
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section id="cookies-and-tracking-technologies">
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              9. Cookies and Tracking Technologies
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                We use cookies and similar technologies to provide, improve, and protect our
                Services. You can manage your cookie preferences at any time using the &quot;Cookie
                Preferences&quot; link in our footer.
              </p>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  9.1 Essential Cookies
                </h3>
                <p>
                  Required for the platform to function. These cannot be disabled without breaking
                  core functionality:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-marble-100">Authentication cookies</strong> (Supabase) —
                    Session management and secure login
                  </li>
                  <li>
                    <strong className="text-marble-100">soil_analytics_consent</strong> — Stores
                    your cookie preference choice (1 year)
                  </li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  9.2 Analytics Cookies (Requires Consent)
                </h3>
                <p>
                  The following cookies and tracking technologies are only activated after you give
                  consent:
                </p>
                <ul className="list-disc list-inside space-y-3 ml-4">
                  <li>
                    <strong className="text-marble-100">Google Analytics (GA4)</strong> — Collects
                    anonymized data about pages visited, time spent, traffic sources, and device
                    information
                  </li>
                  <li>
                    <strong className="text-marble-100">Vercel Analytics</strong> — Performance
                    monitoring and page view tracking provided by our hosting platform
                  </li>
                  <li>
                    <strong className="text-marble-100">soil_visitor</strong> — Anonymous visitor
                    identifier used for features like preventing duplicate &quot;Pay Respects&quot;
                    actions (1 year, HTTP-only)
                  </li>
                  <li>
                    <strong className="text-marble-100">Internal analytics</strong> — Event tracking
                    for platform improvement (stored in Supabase)
                  </li>
                  <li>
                    <strong className="text-marble-100">Referral tracking</strong> — Tracks ?ref=
                    parameters for measuring share link effectiveness
                  </li>
                </ul>
                <p className="mt-4">
                  You can opt-out of Google Analytics separately by installing the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  .
                </p>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  9.3 Managing Cookies
                </h3>
                <p>
                  You can manage your cookie preferences at any time by clicking the &quot;Cookie
                  Preferences&quot; link in our website footer. You can also control cookies through
                  your browser settings. Note that disabling essential cookies may impact your
                  ability to use our Services.
                </p>
              </Card>
            </div>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              10. International Data Transfers
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                SOIL is based in the United States. If you access our Services from outside the
                United States, your information may be transferred to, stored, and processed in the
                United States or other countries where our service providers operate.
              </p>
              <p>
                For users in the EEA, UK, or Switzerland, we ensure appropriate safeguards for
                international transfers through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Service providers with appropriate certifications (e.g., SOC 2)</li>
                <li>Data processing agreements with all third-party processors</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              11. Children&apos;s Privacy
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Our Services are not intended for individuals under the age of 18. We do not
                knowingly collect personal information from children. If you are a parent or
                guardian and believe your child has provided us with personal information, please
                contact us at{" "}
                <a
                  href="mailto:privacy@soil.rip"
                  className="text-gold-400 hover:text-gold-300 underline"
                >
                  privacy@soil.rip
                </a>
                , and we will take steps to delete such information.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              12. Your Rights
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  12.1 Rights Under GDPR (EEA, UK, Switzerland)
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-marble-100">Right of Access:</strong> Request a copy of
                    your personal data
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Rectification:</strong> Request
                    correction of inaccurate data
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Erasure:</strong> Request deletion
                    of your data (&quot;right to be forgotten&quot;)
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Restrict Processing:</strong>{" "}
                    Request limitation of how we use your data
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Data Portability:</strong> Receive
                    your data in a structured, machine-readable format
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Object:</strong> Object to
                    processing based on legitimate interests
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Withdraw Consent:</strong> Withdraw
                    consent at any time where processing is based on consent
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Lodge a Complaint:</strong> File a
                    complaint with your local data protection authority
                  </li>
                </ul>
              </Card>

              <Card variant="dark" padding="lg" className="space-y-4">
                <h3 className="font-display text-lg font-medium text-marble-100">
                  12.2 Rights Under CCPA (California Residents)
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-marble-100">Right to Know:</strong> Request disclosure
                    of personal information collected, used, and disclosed
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Delete:</strong> Request deletion
                    of your personal information
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Opt-Out:</strong> Opt-out of the
                    sale of personal information (Note: We do not sell personal information)
                  </li>
                  <li>
                    <strong className="text-marble-100">Right to Non-Discrimination:</strong> We
                    will not discriminate against you for exercising your rights
                  </li>
                </ul>
              </Card>

              <p>
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@soil.rip"
                  className="text-gold-400 hover:text-gold-300 underline"
                >
                  privacy@soil.rip
                </a>
                . We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              13. Third-Party Links
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Our Services may contain links to third-party websites or services. We are not
                responsible for the privacy practices of these third parties. We encourage you to
                read their privacy policies before providing any personal information.
              </p>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              14. Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the &quot;Last Updated&quot; date at the top</li>
                <li>
                  Sending you an email notification (for significant changes affecting your rights)
                </li>
              </ul>
              <p>
                We encourage you to review this Privacy Policy periodically for any changes. Your
                continued use of our Services after any modifications constitutes acceptance of the
                updated Privacy Policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="font-display text-2xl font-medium text-marble-100 mb-4">
              15. Contact Us
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please
                contact us:
              </p>
              <Card variant="dark-elevated" padding="lg" className="space-y-4">
                <div>
                  <p className="text-marble-100 font-medium">SOIL Foundation</p>
                  <p className="text-slate-500 text-sm">
                    (Delaware 501(c)(3) Nonprofit — In Formation)
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-marble-100">Email:</strong>{" "}
                    <a
                      href="mailto:privacy@soil.rip"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      privacy@soil.rip
                    </a>
                  </p>
                  <p>
                    <strong className="text-marble-100">General Inquiries:</strong>{" "}
                    <a
                      href="mailto:hello@soil.rip"
                      className="text-gold-400 hover:text-gold-300 underline"
                    >
                      hello@soil.rip
                    </a>
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Decorative divider */}
          <div className="divider-roman pt-12">
            <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
          </div>

          {/* Summary Card */}
          <Card variant="dark-elevated" padding="lg" className="border-gold-500/20 border">
            <h3 className="font-display text-xl font-medium text-marble-100 mb-4">
              Privacy Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-slate-400">
              <div>
                <h4 className="text-gold-400 font-medium mb-2">We Do:</h4>
                <ul className="space-y-1 text-sm">
                  <li>✓ Collect data you voluntarily provide</li>
                  <li>✓ Use data for scientific research</li>
                  <li>✓ Anonymize data for publications</li>
                  <li>✓ Give you control over visibility</li>
                  <li>✓ Let you delete your data</li>
                  <li>✓ Protect your data with encryption</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold-400 font-medium mb-2">We Don&apos;t:</h4>
                <ul className="space-y-1 text-sm">
                  <li>✗ Sell your personal data</li>
                  <li>✗ Share identifiable stories without consent</li>
                  <li>✗ Use data against your interests</li>
                  <li>✗ Give individual data to employers/investors</li>
                  <li>✗ Collect data from children</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
