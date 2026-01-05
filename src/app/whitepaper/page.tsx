"use client";

import { useState, useEffect } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Menu, X } from "lucide-react";

// ============================================================================
// TABLE OF CONTENTS DATA
// ============================================================================
const tableOfContents = [
  { id: "abstract", title: "Abstract", level: 1 },
  { id: "introduction", title: "1. Introduction and Rationale", level: 1 },
  { id: "theoretical-foundations", title: "2. Theoretical Foundations", level: 1 },
  { id: "research-design", title: "3. Research Design Philosophy", level: 1 },
  { id: "data-collection", title: "4. Data Collection Methodology", level: 1 },
  { id: "validity-reliability", title: "5. Validity and Reliability Framework", level: 1 },
  { id: "analytical-approaches", title: "6. Analytical Approaches", level: 1 },
  { id: "ethical-framework", title: "7. Ethical Framework", level: 1 },
  { id: "limitations", title: "8. Limitations and Mitigation Strategies", level: 1 },
  { id: "research-agenda", title: "9. Research Agenda", level: 1 },
  { id: "collaboration", title: "10. Invitation to Collaboration", level: 1 },
  { id: "conclusion", title: "11. Conclusion", level: 1 },
];

// ============================================================================
// TABLE OF CONTENTS COMPONENT
// ============================================================================
function TableOfContents({
  activeSection,
  isOpen,
  onClose,
}: {
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-700/50 z-50
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:transform-none lg:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 lg:p-4 lg:pr-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="font-display text-lg font-medium text-marble-100">Contents</span>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-marble-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={onClose}
                className={`
                  block py-2 px-3 rounded-lg text-sm transition-colors
                  ${
                    activeSection === item.id
                      ? "bg-gold-500/20 text-gold-400"
                      : "text-slate-400 hover:text-marble-100 hover:bg-slate-800/50"
                  }
                `}
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Download link */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 mb-3">Version 1.1 | December 2025</p>
            <a href="/documents/SOIL_Research_Methodology_White_Paper.pdf" download>
              <Button variant="dark-secondary" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-2xl md:text-3xl font-medium text-marble-100 mb-6 pt-16 -mt-16 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-xl font-medium text-marble-100 mt-8 mb-4">{children}</h3>;
}

function Paragraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-slate-400 leading-relaxed mb-4 ${className || ""}`}>{children}</p>;
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 mb-6">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-gold-500/50 pl-6 my-6 italic text-slate-300">
      {children}
    </blockquote>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            {headers.map((header, i) => (
              <th key={i} className="text-left py-3 px-4 font-medium text-marble-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800/50">
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-slate-400">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-8">
        <SectionLabel>research methodology</SectionLabel>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mt-4 mb-6 text-marble-100 leading-tight">
          SOIL Research Methodology <span className="text-gradient-gold">White Paper</span>
        </h1>
        <p className="text-lg text-slate-400 mb-2">
          A Framework for Systematic Study of Organizational Mortality
        </p>
        <p className="text-slate-500">
          Studies of Organizational Illness and Loss | Version 1.1 | December 2025
        </p>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          "organizational mortality",
          "failure analysis",
          "autopsy methodology",
          "cross-disciplinary research",
          "organizational health",
          "research design",
          "organizational medicine",
          "longitudinal data collection",
        ].map((keyword) => (
          <span
            key={keyword}
            className="px-3 py-1 text-xs rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// ABSTRACT SECTION
// ============================================================================
function AbstractSection() {
  return (
    <section id="abstract" className="scroll-mt-24">
      <Card variant="dark-elevated" padding="lg" className="mb-12">
        <h2 className="font-display text-xl font-medium text-gold-400 mb-4">Abstract</h2>
        <p className="text-marble-100 leading-relaxed mb-4">
          This white paper presents the methodological foundation for SOIL (Studies of
          Organizational Illness and Loss), a research initiative establishing the systematic study
          of organizational mortality as a scientific discipline. We propose a methodology built on
          two principles: (1) comprehensive, theory-neutral data collection that captures the full
          organizational trajectory without pre-committing to any causal explanation, and (2)
          multi-disciplinary analysis that interprets collected data through complementary
          scientific lenses. The methodology addresses fundamental challenges in organizational
          research: survivor bias, self-report validity, temporal reconstruction accuracy, and
          multi-stakeholder perspective integration. By combining structured autopsy protocols with
          therapeutic interview techniques and computational text analysis, SOIL aims to build the
          empirical foundation for what we term &ldquo;Organizational Medicine&rdquo; — the
          systematic understanding, prediction, and prevention of organizational death.
        </p>
        <p className="text-slate-400 leading-relaxed italic">
          Drawing on medical pathology for data collection methodology and on ecology, psychology,
          systems theory, and sociology for analytical frameworks, SOIL recognizes that
          organizational mortality is a phenomenon too complex for any single disciplinary lens.
        </p>
      </Card>
    </section>
  );
}

// ============================================================================
// SECTION 1: INTRODUCTION
// ============================================================================
function IntroductionSection() {
  return (
    <section>
      <SectionHeading id="introduction">1. Introduction and Rationale</SectionHeading>

      <SubHeading>1.1 The Knowledge Gap</SubHeading>
      <Paragraph>
        Organizational mortality represents one of the most consequential yet understudied phenomena
        in social science. While estimates suggest that 90% of startups fail and organizational
        death affects millions of individuals annually, our systematic understanding of why
        organizations die remains remarkably primitive.
      </Paragraph>
      <Paragraph>Current knowledge suffers from several critical deficiencies:</Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Survivor Bias Dominance.</strong> The vast majority of
        organizational research examines successful organizations, extrapolating &ldquo;success
        factors&rdquo; from survivors. This approach fundamentally cannot distinguish between
        factors that contribute to success and factors that are merely common among both survivors
        and casualties.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Anecdotal Evidence Base.</strong> Existing failure
        knowledge consists primarily of post-hoc narratives, case studies selected for dramatic
        value, and self-serving founder accounts. These sources lack systematic structure,
        standardized measurement, and independent verification.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Temporal Compression.</strong> When failures are
        studied, analysis typically focuses on proximate causes — the final crisis that precipitated
        closure. The developmental trajectory leading to vulnerability remains largely unexplored.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Single-Perspective Limitation.</strong> Most failure
        accounts represent a single stakeholder view (typically the founder), missing the
        multi-dimensional reality of organizational dysfunction.
      </Paragraph>

      <SubHeading>1.2 The Medical Analogy</SubHeading>
      <Paragraph>
        Modern medicine developed through systematic autopsy — the careful examination of deceased
        bodies to understand disease processes. Before autopsy became standard practice, medicine
        relied on theory, speculation, and case reports. The shift to systematic post-mortem
        examination created the empirical foundation for pathology, which in turn enabled diagnosis,
        prognosis, and treatment.
      </Paragraph>
      <Paragraph>
        Organizational science currently resembles pre-autopsy medicine. We possess abundant theory
        about organizational health but lack the systematic empirical foundation that would allow us
        to:
      </Paragraph>
      <BulletList
        items={[
          "Classify organizational pathologies taxonomically",
          "Identify early warning indicators with predictive validity",
          "Distinguish survivable crises from terminal conditions",
          "Develop evidence-based intervention protocols",
        ]}
      />
      <Paragraph>
        SOIL proposes to address this gap by establishing organizational autopsy as a rigorous
        research practice.
      </Paragraph>

      <SubHeading>1.3 Research Objectives</SubHeading>
      <Paragraph>
        <strong className="text-marble-100">Primary Objective:</strong> Build a comprehensive,
        verified database of organizational mortality cases sufficient to enable pattern
        identification, hypothesis testing, predictive model development, and cross-disciplinary
        analysis.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Secondary Objectives:</strong>
      </Paragraph>
      <BulletList
        items={[
          "Develop and validate instruments for organizational autopsy data collection",
          "Establish reliability standards for retrospective organizational assessment",
          "Create taxonomies of organizational pathology",
          "Identify early warning indicators with predictive validity",
          "Generate testable hypotheses about organizational mortality mechanisms",
          "Provide therapeutic value to participants while maintaining research rigor",
        ]}
      />
    </section>
  );
}

// ============================================================================
// SECTION 2: THEORETICAL FOUNDATIONS
// ============================================================================
function TheoreticalFoundationsSection() {
  return (
    <section>
      <SectionHeading id="theoretical-foundations">2. Theoretical Foundations</SectionHeading>

      <SubHeading>2.1 Methodological Separation: Collection vs. Analysis</SubHeading>
      <Paragraph>
        SOIL&apos;s approach rests on a fundamental methodological distinction between{" "}
        <strong className="text-marble-100">data collection</strong> and{" "}
        <strong className="text-marble-100">data analysis</strong>.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Data Collection: Theory-Neutral, Comprehensive</strong>
        <br />
        Like a medical autopsy, organizational autopsy must collect comprehensive data without
        pre-committing to any particular diagnosis. A pathologist does not examine only the heart
        because they suspect cardiac failure — they examine the entire body systematically.
        Similarly, SOIL&apos;s interview protocols capture the complete organizational trajectory
        across all functions, allowing the data to reveal patterns rather than confirming
        pre-existing theories.
      </Paragraph>
      <BulletList
        items={[
          "Prevents confirmation bias (collecting only what supports a favored explanation)",
          "Preserves information that any single theory might overlook",
          "Enables retrospective analysis using frameworks not yet developed",
          "Allows comparison of explanatory power across different theoretical approaches",
        ]}
      />
      <Paragraph>
        <strong className="text-marble-100">
          Data Analysis: Multi-Disciplinary Interpretation
        </strong>
        <br />
        Once data is collected, analysis proceeds through multiple disciplinary lenses.
        Organizational mortality has been studied in fragments — economists examine market failures,
        psychologists study founder grief, sociologists analyze institutional pressures, ecologists
        model population dynamics. Each discipline illuminates aspects invisible to others.
      </Paragraph>
      <BulletList
        items={[
          "Reveals patterns invisible to any single discipline",
          "Enables comparison of explanatory power across frameworks",
          "Produces richer understanding through disciplinary triangulation",
          "Builds cumulative knowledge rather than fragmented disciplinary silos",
        ]}
      />

      <SubHeading>2.2 The Five Disciplinary Lenses</SubHeading>
      <Paragraph>
        SOIL&apos;s Phase 1 methodology integrates five scientific disciplines.{" "}
        <strong className="text-marble-100">Medicine</strong> occupies a special role — providing
        both the <em>data collection methodology</em> (systematic autopsy protocols) and an{" "}
        <em>analytical lens</em> (diagnostic frameworks). The other four disciplines — Ecology,
        Psychology, Systems Theory, and Sociology — primarily contribute{" "}
        <em>analytical frameworks</em> for interpreting collected data.
      </Paragraph>

      <div className="grid gap-4 my-6">
        {[
          {
            discipline: "Ecology",
            reveals: "Population-level mortality patterns, environmental selection, niche dynamics",
            questions:
              "What environmental conditions predict organizational death? How do mortality rates vary across populations?",
            contribution:
              "Survival analysis, population statistics, comparative analysis across cohorts",
          },
          {
            discipline: "Psychology",
            reveals: "Founder grief, cognitive biases, therapeutic value of structured reflection",
            questions:
              "How does failure affect founders? What interview approaches facilitate both valid data and therapeutic benefit?",
            contribution:
              "Therapeutic interview design, grief processing framework, cognitive bias mitigation",
          },
          {
            discipline: "Systems Theory",
            reveals:
              "Cascade failures, feedback loops, emergence, non-linear dynamics, tipping points",
            questions:
              "How does dysfunction spread across functions? What triggers irreversible decline?",
            contribution:
              "Multi-level analysis, temporal dynamics modeling, complexity-aware causation",
          },
          {
            discipline: "Medicine",
            reveals: "Diagnostic epistemology, pathology classification, autopsy methodology",
            questions:
              "How do we build valid diagnostic categories? What makes organizational autopsy scientifically rigorous?",
            contribution:
              "Autopsy protocols, nosology development, validity standards from clinical research",
          },
          {
            discipline: "Sociology",
            reveals:
              "Institutional legitimacy, network dynamics, power structures, qualitative methodology",
            questions:
              "How do institutional pressures affect mortality? How do we ensure rigor in qualitative data?",
            contribution:
              "Mixed methods design, institutional analysis, verification through triangulation",
          },
        ].map((d) => (
          <Card key={d.discipline} variant="dark" padding="md">
            <h4 className="font-display text-lg font-medium text-gold-400 mb-2">{d.discipline}</h4>
            <p className="text-slate-400 text-sm mb-2">
              <strong className="text-marble-100">What it reveals:</strong> {d.reveals}
            </p>
            <p className="text-slate-400 text-sm mb-2">
              <strong className="text-marble-100">Key questions:</strong> {d.questions}
            </p>
            <p className="text-slate-400 text-sm">
              <strong className="text-marble-100">Contribution:</strong> {d.contribution}
            </p>
          </Card>
        ))}
      </div>

      <SubHeading>2.3 The Twelve Lenses: Extended Analytical Framework</SubHeading>
      <Paragraph>
        The five lenses above represent Phase 1 priorities. The complete framework encompasses
        twelve perspectives, symbolized by SOIL&apos;s navigational symbol — the Roman Dodecahedron,
        an ancient artifact whose purpose remains unknown, much as organizations often die without
        understanding why.
      </Paragraph>
      <Paragraph className="text-slate-400 italic text-sm">
        <strong className="text-slate-300">A note on terminology:</strong> This list includes both
        established scientific disciplines (Biology, Psychology, Economics) and theoretical
        approaches that draw on multiple disciplines (Systems Theory, Cybernetics). We use
        &ldquo;lenses&rdquo; rather than &ldquo;disciplines&rdquo; to acknowledge this diversity —
        what unites them is their capacity to reveal different aspects of organizational mortality.
      </Paragraph>
      <DataTable
        headers={["#", "Lens", "What It Reveals"]}
        rows={[
          ["0", "Biology", "Organization as organism — birth, growth, metabolism, death"],
          ["1", "Ecology", "Populations, niches, competition, environmental fit"],
          ["2", "Economics", "Markets, incentives, efficiency, rational choice"],
          ["3", "Sociology", "Social structures, institutions, power, legitimacy"],
          ["4", "Psychology", "Behavior, motivation, cognitive limits, burnout"],
          ["5", "Political Science", "Power, conflict, coalitions, governance"],
          ["6", "Anthropology", "Culture, rituals, meaning-making, symbols"],
          ["7", "Cybernetics", "Feedback loops, control, self-regulation"],
          ["8", "Systems Theory", "Wholes and parts, emergence, complexity"],
          ["9", "Information Theory", "Communication, signals, coordination, entropy"],
          ["10", "Evolutionary Theory", "Selection, variation, adaptation, fitness"],
          ["11", "Medicine", "Diagnosis, pathology, treatment, prevention"],
        ]}
      />

      <SubHeading>2.4 Temporal Dynamics Model</SubHeading>
      <Paragraph>
        Organizational mortality is not an event but a process. Our theoretical model posits three
        distinct phases requiring different data collection approaches:
      </Paragraph>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">Phase 1: Genesis and Early Development.</strong> The
            period from founding through initial operations. Data collection focuses on founder
            characteristics, founding conditions, initial resource endowments, and early strategic
            choices.
          </span>,
          <span key="2">
            <strong className="text-marble-100">Phase 2: Peak Operations.</strong> The period when
            the organization achieved its highest functionality. This becomes our primary temporal
            anchor for comparative analysis — capturing organizational structure and health at
            maximum capability.
          </span>,
          <span key="3">
            <strong className="text-marble-100">Phase 3: Decline and Termination.</strong> The
            period from peak through closure. Data collection focuses on degradation dynamics,
            crisis events, response patterns, and terminal processes.
          </span>,
        ]}
      />
    </section>
  );
}

// ============================================================================
// SECTION 3: RESEARCH DESIGN PHILOSOPHY
// ============================================================================
function ResearchDesignSection() {
  return (
    <section>
      <SectionHeading id="research-design">3. Research Design Philosophy</SectionHeading>

      <SubHeading>3.1 Mixed Methods Integration</SubHeading>
      <Paragraph>
        SOIL employs a convergent mixed-methods design, collecting both quantitative and qualitative
        data through integrated instruments rather than parallel streams.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Quantitative Components:</strong> Structured
        organizational metrics (headcount, revenue, funding, etc.), standardized function assessment
        scales, timeline markers and durations, Likert-scale health indicators.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Qualitative Components:</strong> Open-ended narrative
        responses, critical incident descriptions, meaning-making and attribution accounts,
        contextual explanations.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Integration Strategy:</strong> Quantitative data
        provides the skeleton for systematic comparison; qualitative data provides the flesh for
        understanding mechanisms. Neither alone is sufficient.
      </Paragraph>

      <SubHeading>3.2 Retrospective Design Considerations</SubHeading>
      <Paragraph>
        Organizational autopsy is inherently retrospective — we study organizations after they have
        died. This creates well-known methodological challenges that we address through specific
        design features.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Challenge: Memory Decay and Reconstruction.</strong>{" "}
        Humans reconstruct memories rather than replay recordings. Over time, memories become
        simplified, schematized, and influenced by subsequent events and current beliefs.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Mitigations:</strong> Temporal anchoring at Peak
        Operations (a salient, typically positive memory), multiple external memory cues (documents,
        timelines, contemporaneous records), focus on structural/factual data before interpretive
        accounts, collection of supporting documentation where available, and multi-stakeholder
        verification for key facts.
      </Paragraph>

      <SubHeading>3.3 Unit of Analysis</SubHeading>
      <Paragraph>
        The primary unit of analysis is the{" "}
        <strong className="text-marble-100">organizational mortality episode</strong> — the complete
        arc from an organization&apos;s founding through its termination, as documented through
        autopsy.
      </Paragraph>
      <Paragraph>Secondary units include:</Paragraph>
      <BulletList
        items={[
          "Functional subsystems within organizations",
          "Critical events within organizational timelines",
          "Stakeholder perspectives on the same organization",
          "Environmental contexts surrounding multiple organizations",
        ]}
      />

      <SubHeading>3.4 Comparison Strategy: Survivors and Near-Death Cases</SubHeading>
      <Paragraph>
        Understanding why organizations die requires comparison with organizations that survived
        similar conditions. SOIL addresses this through a multi-pronged comparison strategy
        including near-death survivor analysis and matched comparison design.
      </Paragraph>
    </section>
  );
}

// ============================================================================
// SECTION 4: DATA COLLECTION METHODOLOGY
// ============================================================================
function DataCollectionSection() {
  return (
    <section>
      <SectionHeading id="data-collection">4. Data Collection Methodology</SectionHeading>

      <SubHeading>4.1 Sampling Strategy</SubHeading>
      <Paragraph>
        <strong className="text-marble-100">Target Population:</strong> Organizations that have
        permanently ceased operations after a period of active functioning.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Inclusion Criteria:</strong>
      </Paragraph>
      <BulletList
        items={[
          "At minimum: 2+ people involved at some point OR external stakeholders (paying customers, investors, suppliers)",
          "Clearly definable founding and termination dates",
          "Identifiable founder(s) or senior leader(s) willing to participate",
          "Sufficient documentation or verification sources",
        ]}
      />
      <Paragraph>
        <strong className="text-marble-100">Exclusion Criteria:</strong>
      </Paragraph>
      <BulletList
        items={[
          "Solo side projects without external stakeholders",
          "Organizations still operating (even if transformed)",
          "Mergers and acquisitions (unless the original entity genuinely ceased to exist)",
          "Temporary projects with predetermined endpoints",
        ]}
      />

      <SubHeading>4.2 Data Collection Instruments</SubHeading>
      <Paragraph>
        Data collection occurs through a modular wizard system, with each module capturing distinct
        aspects of organizational life and death:
      </Paragraph>

      <div className="grid gap-4 my-6">
        {[
          {
            module: "Module 1",
            title: "Founder Context",
            time: "15-20 min",
            desc: "Founder characteristics, personal dynamics, human cost",
          },
          {
            module: "Module 2",
            title: "Financial Picture",
            time: "15-20 min",
            desc: "Financial metrics and dynamics from Peak to closure",
          },
          {
            module: "Module 3",
            title: "Dynamic Picture",
            time: "20-30 min",
            desc: "Degradation trajectory, pattern-based prompting, event timeline",
          },
          {
            module: "Module 4",
            title: "Environment Analysis",
            time: "15-20 min",
            desc: "External conditions, resource assessment, environmental events",
          },
          {
            module: "Module 5",
            title: "Functional Mapping",
            time: "30-40 min",
            desc: "Comprehensive organizational structure and health at Peak Operations",
          },
          {
            module: "Module 6",
            title: "Narrative",
            time: "20-30 min",
            desc: "Founder interpretation, lessons, and meaning-making",
          },
        ].map((m) => (
          <Card key={m.module} variant="dark" padding="md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-gold-400 text-sm font-medium">{m.module}</span>
                <h4 className="font-display text-lg font-medium text-marble-100 mt-1">{m.title}</h4>
                <p className="text-slate-400 text-sm mt-2">{m.desc}</p>
              </div>
              <span className="text-slate-500 text-sm">{m.time}</span>
            </div>
          </Card>
        ))}
      </div>

      <SubHeading>4.3 Verification System</SubHeading>
      <Paragraph>
        Verification addresses a fundamental challenge in self-report research. Each cenotaph
        requires 3 confirmations from verifiers before publication.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Verifier Categories:</strong> Former employees, former
        co-founders, former customers, former suppliers, former investors, former partners.
      </Paragraph>

      <SubHeading>4.4 Data Quality Tiers</SubHeading>
      <DataTable
        headers={["Tier", "Requirements", "Research Use"]}
        rows={[
          ["Bronze", "Founder self-report only", "Pattern exploration, hypothesis generation"],
          ["Silver", "3+ external verifications", "Standard analysis, aggregation"],
          ["Gold", "Verified + documents", "High-confidence claims, validation studies"],
          [
            "Platinum",
            "Multi-stakeholder full participation",
            "Process reconstruction, deep case study",
          ],
        ]}
      />
    </section>
  );
}

// ============================================================================
// SECTION 5: VALIDITY AND RELIABILITY
// ============================================================================
function ValidityReliabilitySection() {
  return (
    <section>
      <SectionHeading id="validity-reliability">
        5. Validity and Reliability Framework
      </SectionHeading>

      <SubHeading>5.1 Construct Validity</SubHeading>
      <Paragraph>
        <strong className="text-marble-100">Challenge:</strong> Do our instruments measure what they
        purport to measure?
      </Paragraph>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">Content Validity:</strong> Instrument development
            informed by multiple organizational theory traditions, expert review, and iterative
            refinement.
          </span>,
          <span key="2">
            <strong className="text-marble-100">Convergent Validity:</strong> Multiple indicators
            for key constructs, correlation analysis, multi-stakeholder agreement.
          </span>,
          <span key="3">
            <strong className="text-marble-100">Discriminant Validity:</strong> Distinct constructs
            measured by distinct instruments, factor analysis, examination of unexpected
            correlations.
          </span>,
        ]}
      />

      <SubHeading>5.2 Internal Validity</SubHeading>
      <Paragraph>
        <strong className="text-marble-100">Challenge:</strong> Can we validly draw causal
        inferences from retrospective data?
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Approaches:</strong> Explicit temporal markers
        throughout data collection, event sequencing within and across modules, documentary evidence
        of timing where available, systematic collection of environmental factors, and pattern
        matching across cases.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Limitations Acknowledged:</strong> Retrospective design
        fundamentally limits causal inference. We frame findings as patterns and associations
        requiring prospective validation. Strong causal claims require prospective follow-up
        studies.
      </Paragraph>

      <SubHeading>5.3 External Validity</SubHeading>
      <Paragraph>
        <strong className="text-marble-100">Challenge:</strong> Do findings generalize beyond our
        sample?
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Approaches:</strong> Stratified sampling with deliberate
        inclusion across organization types, regions, sizes, and sectors. Subgroup analysis to
        examine pattern consistency. Transparent reporting of sample composition.
      </Paragraph>

      <SubHeading>5.4 Reliability</SubHeading>
      <Paragraph>
        For qualitative data coding, we employ rigorous Inter-Rater Reliability (IRR) protocols:
        Krippendorff&apos;s alpha (α ≥ 0.70 for exploratory, α ≥ 0.80 for confirmatory),
        standardized coder training, calibration checks, disagreement resolution processes, and
        drift monitoring.
      </Paragraph>
    </section>
  );
}

// ============================================================================
// SECTION 6: ANALYTICAL APPROACHES
// ============================================================================
function AnalyticalApproachesSection() {
  return (
    <section>
      <SectionHeading id="analytical-approaches">6. Analytical Approaches</SectionHeading>

      <SubHeading>6.1 Descriptive Analytics</SubHeading>
      <BulletList
        items={[
          "Mortality demographics: Distribution of deaths by organization type, region, stage, sector",
          "Functional profiles: Function presence rates, health indicator distributions, formalization patterns",
          "Financial patterns: Typical trajectories, crisis event frequency, response pattern effectiveness",
        ]}
      />

      <SubHeading>6.2 Pattern Recognition</SubHeading>
      <Paragraph>
        <strong className="text-marble-100">Failure Archetype Identification:</strong> Using cluster
        analysis and latent class methods to identify recurring mortality patterns. What
        combinations of dysfunctions commonly co-occur? What temporal sequences characterize
        different mortality pathways?
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Early Warning Signal Detection:</strong> Using sequence
        analysis and survival modeling. What observable indicators precede mortality? How much lead
        time do different indicators provide?
      </Paragraph>

      <SubHeading>6.3 Cross-Disciplinary Comparison</SubHeading>
      <Paragraph>
        The theory-neutral data collection enables systematic comparison of explanatory power
        through deriving predictions from each discipline, operationalizing predictions using
        collected data, assessing empirical support, and developing integrative synthesis where
        warranted.
      </Paragraph>

      <SubHeading>6.4 Predictive Modeling</SubHeading>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">Survival Analysis:</strong> Cox proportional hazards
            and related methods for time-to-failure prediction
          </span>,
          <span key="2">
            <strong className="text-marble-100">Machine Learning:</strong> Classification and
            regression methods for mortality probability prediction
          </span>,
          <span key="3">
            <strong className="text-marble-100">Natural Language Processing:</strong> Sentiment
            trajectories, topic modeling, linguistic marker analysis
          </span>,
        ]}
      />

      <SubHeading>6.5 Qualitative Analysis</SubHeading>
      <Paragraph>
        Thematic analysis for emergent themes, process tracing for mechanism identification, and
        case comparison for theory development through contrast.
      </Paragraph>
    </section>
  );
}

// ============================================================================
// SECTION 7: ETHICAL FRAMEWORK
// ============================================================================
function EthicalFrameworkSection() {
  return (
    <section>
      <SectionHeading id="ethical-framework">7. Ethical Framework</SectionHeading>

      <SubHeading>7.1 Core Principles</SubHeading>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">Dignity:</strong> Every founder and organization
            deserves respectful treatment. Failure is human; our methodology honors rather than
            exploits this reality.
          </span>,
          <span key="2">
            <strong className="text-marble-100">Autonomy:</strong> Participants control their data.
            Consent is informed, specific, and revocable.
          </span>,
          <span key="3">
            <strong className="text-marble-100">Beneficence:</strong> Research should benefit
            participants (through therapeutic value) and society (through knowledge generation).
          </span>,
          <span key="4">
            <strong className="text-marble-100">Non-maleficence:</strong> Research must not harm
            participants, named individuals, or the broader community.
          </span>,
          <span key="5">
            <strong className="text-marble-100">Justice:</strong> Benefits and burdens of research
            should be fairly distributed.
          </span>,
        ]}
      />

      <SubHeading>7.2 Privacy and Confidentiality</SubHeading>
      <BulletList
        items={[
          "Encryption at rest and in transit",
          "Access controls based on role",
          "Audit logging of all data access",
          "Compliance with applicable data protection regulations (GDPR, CCPA, etc.)",
          "Default anonymization in all research outputs",
        ]}
      />

      <SubHeading>7.3 Therapeutic Benefit</SubHeading>
      <Paragraph>
        SOIL explicitly designs for therapeutic benefit, not merely harm minimization:
      </Paragraph>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">Closure:</strong> The structured reflection process
            facilitates psychological closure on failure experience.
          </span>,
          <span key="2">
            <strong className="text-marble-100">Meaning-Making:</strong> Narrative modules support
            constructive interpretation of experience.
          </span>,
          <span key="3">
            <strong className="text-marble-100">Contribution:</strong> Framing participation as
            valuable contribution to knowledge provides redemption narrative.
          </span>,
          <span key="4">
            <strong className="text-marble-100">Community:</strong> Connection with others who share
            similar experiences reduces isolation.
          </span>,
          <span key="5">
            <strong className="text-marble-100">Recognition:</strong> Beautiful memorialization
            validates the effort invested.
          </span>,
        ]}
      />
    </section>
  );
}

// ============================================================================
// SECTION 8: LIMITATIONS
// ============================================================================
function LimitationsSection() {
  return (
    <section>
      <SectionHeading id="limitations">8. Limitations and Mitigation Strategies</SectionHeading>

      <div className="space-y-6">
        {[
          {
            title: "Selection Bias",
            limitation:
              "Organizations whose founders are willing and able to participate may differ systematically from those whose founders are not.",
            mitigation:
              "Multiple recruitment channels, non-response analysis, comparison with external data sources, sensitivity analysis, transparent reporting, propensity weighting.",
          },
          {
            title: "Retrospective Bias",
            limitation:
              "All data is collected after organizational death, creating risks of memory decay, reconstruction, hindsight bias, and post-hoc rationalization.",
            mitigation:
              "Temporal anchoring at salient points, document collection, multi-stakeholder triangulation, explicit questioning about surprises.",
          },
          {
            title: "Self-Report Validity",
            limitation:
              "Founders may intentionally or unintentionally misrepresent their organizations.",
            mitigation:
              "Verification requirement (3+ external confirmations), document verification, pattern analysis, quality tiers with transparent reporting.",
          },
          {
            title: "Causal Inference Limitations",
            limitation:
              "Retrospective design fundamentally limits causal inference. Association ≠ causation.",
            mitigation:
              "Cautious causal language, explicit acknowledgment of alternative explanations, pattern replication, future prospective studies.",
          },
        ].map((item, index) => (
          <Card key={index} variant="dark" padding="lg">
            <h4 className="font-display text-lg font-medium text-marble-100 mb-2">
              8.{index + 1} {item.title}
            </h4>
            <p className="text-slate-400 mb-3">
              <strong className="text-slate-300">Limitation:</strong> {item.limitation}
            </p>
            <p className="text-slate-400">
              <strong className="text-gold-400/80">Mitigation:</strong> {item.mitigation}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 9: RESEARCH AGENDA
// ============================================================================
function ResearchAgendaSection() {
  return (
    <section>
      <SectionHeading id="research-agenda">9. Research Agenda</SectionHeading>

      <div className="space-y-8">
        <div>
          <SubHeading>9.1 Phase 1: Foundation (Years 1-2)</SubHeading>
          <Paragraph>
            <strong className="text-marble-100">Objectives:</strong> Build initial case database
            (target: 500-2,000 cases), validate data collection instruments, establish baseline
            mortality patterns, develop analytical infrastructure.
          </Paragraph>
          <Paragraph>
            <strong className="text-marble-100">Outputs:</strong> Validated instrument battery,
            baseline descriptive reports, initial taxonomy of failure patterns, methodological
            publications.
          </Paragraph>
        </div>

        <div>
          <SubHeading>9.2 Phase 2: Pattern Discovery (Years 2-4)</SubHeading>
          <Paragraph>
            <strong className="text-marble-100">Objectives:</strong> Achieve statistically robust
            sample (target: 2,000-5,000 cases), identify and validate failure archetypes, detect
            early warning indicators, compare disciplinary explanatory power.
          </Paragraph>
          <Paragraph>
            <strong className="text-marble-100">Outputs:</strong> Failure archetype taxonomy with
            diagnostic criteria, early warning indicator validation studies, cross-disciplinary
            comparison meta-analysis, peer-reviewed publications.
          </Paragraph>
        </div>

        <div>
          <SubHeading>9.3 Phase 3: Prediction and Prevention (Years 4-6)</SubHeading>
          <Paragraph>
            <strong className="text-marble-100">Objectives:</strong> Develop predictive models with
            validated accuracy, create diagnostic assessment instruments, test intervention
            protocols, establish clinical applicability.
          </Paragraph>
          <Paragraph>
            <strong className="text-marble-100">Outputs:</strong> Validated predictive models,
            diagnostic assessment instruments, prevention protocols, clinical practice guidelines,
            textbook on organizational mortality.
          </Paragraph>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 10: COLLABORATION
// ============================================================================
function CollaborationSection() {
  return (
    <section>
      <SectionHeading id="collaboration">10. Invitation to Collaboration</SectionHeading>

      <SubHeading>10.1 Why Collaboration is Essential</SubHeading>
      <Paragraph>
        SOIL does not claim to have solved the methodological challenges of studying organizational
        mortality. This white paper presents our current best thinking — a foundation for critique,
        refinement, and collaborative development.
      </Paragraph>
      <Paragraph>We recognize that:</Paragraph>
      <BulletList
        items={[
          "No single team possesses all relevant expertise",
          "Methodological blind spots are inevitable without external review",
          "Scientific credibility requires community validation",
          "The field will develop faster through collaboration than competition",
        ]}
      />

      <SubHeading>10.2 Disciplinary Expertise We Seek</SubHeading>
      <Paragraph>
        SOIL&apos;s cross-disciplinary approach requires expertise we do not possess. We explicitly
        invite collaboration from researchers in our priority disciplines:
      </Paragraph>
      <div className="grid gap-4 my-6">
        {[
          {
            discipline: "Ecology",
            expertise:
              "Population-level mortality analysis, survival modeling, environmental selection studies",
          },
          {
            discipline: "Psychology",
            expertise:
              "Grief research, therapeutic methodology, retrospective validity, founder wellbeing",
          },
          {
            discipline: "Systems Theory",
            expertise: "Cascade dynamics, complexity modeling, non-linear systems analysis",
          },
          {
            discipline: "Medicine / History of Medicine",
            expertise:
              "Autopsy epistemology, diagnostic validity, pathology classification development",
          },
          {
            discipline: "Sociology",
            expertise: "Institutional analysis, qualitative methodology, mixed methods design",
          },
          {
            discipline: "Epidemiology / Biostatistics",
            expertise: "Survival analysis, hazard modeling, population-level causal inference",
          },
        ].map((d) => (
          <Card key={d.discipline} variant="dark" padding="sm">
            <span className="text-gold-400 font-medium">{d.discipline}:</span>{" "}
            <span className="text-slate-400">{d.expertise}</span>
          </Card>
        ))}
      </div>

      <SubHeading>10.3 Open Questions for Collaborative Development</SubHeading>
      <Quote>
        We explicitly invite collaboration on the following methodological challenges: Comparison
        strategy design, causal inference from retrospective data, cross-cultural validity,
        longitudinal design integration, AI/ML methodological integration, and therapeutic-research
        balance.
      </Quote>

      <SubHeading>10.4 Forms of Collaboration</SubHeading>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">Academic Partnerships:</strong> Joint research
            projects, methodological critique, instrument validation studies
          </span>,
          <span key="2">
            <strong className="text-marble-100">Data Access:</strong> Anonymized dataset access for
            hypothesis testing, collaborative analysis projects, dissertation research support
          </span>,
          <span key="3">
            <strong className="text-marble-100">Practitioner Input:</strong> Instrument validation
            from professional experience, pattern validation from advisory/VC practice
          </span>,
          <span key="4">
            <strong className="text-marble-100">Methodological Review:</strong> Expert critique of
            instruments and protocols, peer review of analytical approaches
          </span>,
        ]}
      />

      <SubHeading>10.5 How to Engage</SubHeading>
      <Paragraph>
        Researchers, practitioners, and methodologists interested in collaboration are invited to
        contact SOIL:
      </Paragraph>
      <BulletList
        items={[
          <span key="1">
            Academic partnership inquiries:{" "}
            <a href="mailto:research@soil.rip" className="text-gold-400 hover:text-gold-300">
              research@soil.rip
            </a>
          </span>,
          <span key="2">
            Methodological feedback:{" "}
            <a href="mailto:methodology@soil.rip" className="text-gold-400 hover:text-gold-300">
              methodology@soil.rip
            </a>
          </span>,
          <span key="3">
            General inquiries:{" "}
            <a href="mailto:hello@soil.rip" className="text-gold-400 hover:text-gold-300">
              hello@soil.rip
            </a>
          </span>,
        ]}
      />
    </section>
  );
}

// ============================================================================
// SECTION 11: CONCLUSION
// ============================================================================
function ConclusionSection() {
  return (
    <section>
      <SectionHeading id="conclusion">11. Conclusion</SectionHeading>

      <SubHeading>11.1 Contribution to Knowledge</SubHeading>
      <Paragraph>
        SOIL addresses a fundamental gap in organizational science: the systematic, empirical study
        of organizational mortality. By treating organizational death with the same rigor that
        medicine brings to human death, we aim to build the foundation for a new discipline —
        Organizational Medicine.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Methodological Contributions:</strong> Theory-neutral
        data collection enabling multi-disciplinary analysis through five scientific lenses,
        multi-stakeholder verification addressing self-report validity, integration of therapeutic
        and research objectives, temporal modeling distinguishing genesis, peak, and decline phases,
        and comprehensive coverage across organizational functions and dynamics.
      </Paragraph>
      <Paragraph>
        <strong className="text-marble-100">Substantive Contributions:</strong> First large-scale,
        verified database of organizational mortality, empirical basis for failure archetype
        taxonomy, identification and validation of early warning indicators, comparison of
        disciplinary and theoretical explanatory power, and foundation for predictive modeling and
        prevention.
      </Paragraph>

      <SubHeading>11.2 Practical Implications</SubHeading>
      <BulletList
        items={[
          <span key="1">
            <strong className="text-marble-100">For Founders:</strong> Therapeutic closure process,
            learning from others&apos; experiences, reduction of failure stigma, community and
            support
          </span>,
          <span key="2">
            <strong className="text-marble-100">For Practitioners:</strong> Evidence-based portfolio
            risk assessment, early warning monitoring frameworks, intervention targeting, due
            diligence enhancement
          </span>,
          <span key="3">
            <strong className="text-marble-100">For Educators:</strong> Empirically grounded case
            material, failure literacy curriculum, organizational health assessment training
          </span>,
          <span key="4">
            <strong className="text-marble-100">For Policymakers:</strong> Understanding of
            organizational mortality in different contexts, evidence for support program design,
            ecosystem health assessment frameworks
          </span>,
        ]}
      />

      <SubHeading>11.3 Closing Reflection</SubHeading>
      <Quote>
        &ldquo;Just as the systematic study of human death gave rise to modern medicine, so the
        systematic study of organizational death may give rise to organizational medicine — the
        scientific understanding, prediction, and prevention of organizational mortality.&rdquo;
      </Quote>
      <Paragraph>
        Every organizational death represents an investment of human time, energy, creativity, and
        hope. Most of this investment is currently wasted — the lessons disappear with the
        organization. SOIL aims to transform this waste into wisdom, creating a systematic
        foundation for understanding why organizations die and how we might help more of them live.
      </Paragraph>
      <Paragraph>
        The methodology presented in this white paper is not final. Science advances through
        iteration, critique, and improvement. We offer this framework as a serious beginning, not a
        definitive answer. We welcome the engagement of the scholarly community in refining these
        methods and building this new field together.
      </Paragraph>

      {/* Citation */}
      <Card variant="dark" padding="lg" className="mt-8">
        <p className="text-slate-500 text-sm mb-2">Citation:</p>
        <p className="text-slate-400 text-sm">
          SOIL Research Team. (2025). SOIL Research Methodology White Paper: A Framework for
          Systematic Study of Organizational Mortality. Studies of Organizational Illness and Loss.
        </p>
      </Card>
    </section>
  );
}

// ============================================================================
// MAIN WHITE PAPER PAGE
// ============================================================================
export default function WhitePaperPage() {
  const [activeSection, setActiveSection] = useState("abstract");
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      for (const section of sections.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Mobile TOC toggle */}
      <button
        onClick={() => setTocOpen(true)}
        className="fixed bottom-6 right-6 z-30 lg:hidden p-4 bg-gold-500 text-slate-900 rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="max-w-content mx-auto px-6">
        <div className="flex gap-12">
          {/* Table of Contents - Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents
                activeSection={activeSection}
                isOpen={tocOpen}
                onClose={() => setTocOpen(false)}
              />
            </div>
          </div>

          {/* Mobile TOC */}
          <div className="lg:hidden">
            <TableOfContents
              activeSection={activeSection}
              isOpen={tocOpen}
              onClose={() => setTocOpen(false)}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-24">
            <HeroSection />
            <AbstractSection />
            <IntroductionSection />
            <TheoreticalFoundationsSection />
            <ResearchDesignSection />
            <DataCollectionSection />
            <ValidityReliabilitySection />
            <AnalyticalApproachesSection />
            <EthicalFrameworkSection />
            <LimitationsSection />
            <ResearchAgendaSection />
            <CollaborationSection />
            <ConclusionSection />
          </main>
        </div>
      </div>
    </div>
  );
}
