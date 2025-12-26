import { Metadata } from "next";
import Image from "next/image";
import {
  Pentagon,
  Sparkles,
  Library,
  Lightbulb,
  Microscope,
  Users,
  DollarSign,
  Network,
  Brain,
  Scale,
  Flame,
  Zap,
  Binary,
  Dna,
  Stethoscope,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Roman Dodecahedron - SOIL",
  description:
    "Discover why SOIL chose a mysterious 2,000-year-old artifact as its central symbol and how it embodies our multi-disciplinary approach to organizational science.",
};

const disciplines = [
  {
    face: 1,
    name: "Biology",
    description: "Organization as organism — birth, growth, metabolism, death",
    icon: Microscope,
  },
  {
    face: 2,
    name: "Ecology",
    description: "Populations, niches, competition for resources, environmental fit",
    icon: Network,
  },
  {
    face: 3,
    name: "Economics",
    description: "Markets, incentives, efficiency, rational choice, firm theory",
    icon: DollarSign,
  },
  {
    face: 4,
    name: "Sociology",
    description: "Social structures, institutions, power, networks, legitimacy",
    icon: Users,
  },
  {
    face: 5,
    name: "Psychology",
    description: "Behavior, motivation, cognitive limits, leadership, burnout",
    icon: Brain,
  },
  {
    face: 6,
    name: "Political Science",
    description: "Power, conflict, coalitions, governance, decision-making",
    icon: Scale,
  },
  {
    face: 7,
    name: "Anthropology",
    description: "Culture, rituals, meaning-making, symbols, identity",
    icon: Flame,
  },
  {
    face: 8,
    name: "Cybernetics",
    description: "Feedback loops, control, self-regulation, homeostasis",
    icon: Zap,
  },
  {
    face: 9,
    name: "Systems Theory",
    description: "Wholes and parts, emergence, boundaries, complexity",
    icon: Network,
  },
  {
    face: 10,
    name: "Information Theory",
    description: "Communication, signals, noise, coordination, entropy",
    icon: Binary,
  },
  {
    face: 11,
    name: "Evolutionary Theory",
    description: "Selection, variation, inheritance, adaptation, fitness",
    icon: Dna,
  },
  {
    face: 12,
    name: "Medicine",
    description: "Diagnosis, pathology, treatment, prevention, prognosis",
    icon: Stethoscope,
  },
];

export default function DodecahedronPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-6">
            <Pentagon className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-marble-100 mb-4">
            The Roman Dodecahedron
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-4">
            A 2,000-year-old mystery — and SOIL&apos;s central symbol
          </p>
          <p className="text-slate-500 text-sm italic">
            &quot;Like the Roman craftsman who made these objects for purposes we can only guess,
            organizations die and take their knowledge with them.&quot;
          </p>
        </div>
      </section>

      {/* Historical Context */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-6">The Artifact</h2>
          <div className="space-y-4 text-slate-400">
            <p>
              The Roman Dodecahedron is a small hollow bronze artifact, typically 4-11 cm in
              diameter, dating to the 2nd-4th century AD. Approximately 130 specimens have been
              discovered, primarily in the northwestern provinces of the Roman Empire (Gaul,
              Britain, Germania).
            </p>
            <div className="my-8 flex justify-center">
              <div className="relative w-full max-w-2xl aspect-[4/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-800/30">
                <Image
                  src="/roman-dodecahedron.webp"
                  alt="Roman Dodecahedron - Ancient bronze artifact with 12 pentagonal faces"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 my-6">
              <h3 className="font-medium text-marble-100 mb-3">Distinctive Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <span>12 pentagonal faces, each with a circular hole</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <span>Holes of varying diameters (no two the same size)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <span>20 vertices, each topped with a small sphere (knob)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <span>Hollow interior, made of bronze or stone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <span>Patinated surface showing centuries of age</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Mystery */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-6">The Mystery</h2>
          <div className="space-y-4 text-slate-400">
            <p>
              Despite over a century of archaeological study,{" "}
              <strong className="text-marble-200">no Roman text mentions these objects</strong>.
              Their purpose remains unknown. Over 50 theories have been proposed — astronomical
              instrument, religious object, candleholder, military decoration, children&apos;s toy,
              knitting tool, divination device.
            </p>
            <p className="text-lg text-marble-200 font-medium">The mystery endures.</p>
            <p>
              This is one of archaeology&apos;s most famous unsolved puzzles — a sophisticated
              artifact whose meaning was lost with its makers. Many dodecahedra have been found in
              burial contexts or ritual deposits, suggesting they held significant meaning to their
              owners — important enough to accompany them in death or to be offered to the gods.
            </p>
          </div>
        </div>
      </section>

      {/* Lost Knowledge Parallel */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-6">Why This Symbol</h2>
          <div className="space-y-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-medium text-marble-100 mb-2">Lost Knowledge</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    The Roman Dodecahedron represents knowledge that was lost — sophisticated,
                    meaningful, carefully crafted, yet ultimately forgotten. This is precisely what
                    SOIL fights against: the loss of organizational knowledge when ventures die.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/20 border border-slate-700/30 rounded p-4">
                <p className="text-gold-400 font-medium mb-1">No written records survive</p>
                <p className="text-slate-500">
                  → Institutional knowledge disappears with organizations
                </p>
              </div>
              <div className="bg-slate-800/20 border border-slate-700/30 rounded p-4">
                <p className="text-gold-400 font-medium mb-1">Purpose forgotten</p>
                <p className="text-slate-500">
                  → Lessons of failure rarely systematically preserved
                </p>
              </div>
              <div className="bg-slate-800/20 border border-slate-700/30 rounded p-4">
                <p className="text-gold-400 font-medium mb-1">Found in burial contexts</p>
                <p className="text-slate-500">→ We study organizational &quot;death&quot;</p>
              </div>
              <div className="bg-slate-800/20 border border-slate-700/30 rounded p-4">
                <p className="text-gold-400 font-medium mb-1">Sophisticated craftsmanship</p>
                <p className="text-slate-500">→ Organizations represent years of human effort</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Twelve Lenses */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-display text-marble-100 mb-3">The Twelve Lenses</h2>
            <p className="text-slate-400">
              Each of the 12 pentagonal faces represents a fundamental scientific discipline that
              contributes to understanding organizational health and mortality.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplines.map((discipline) => {
              const Icon = discipline.icon;
              return (
                <div
                  key={discipline.face}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm text-slate-600 font-mono">
                          Face {discipline.face}
                        </span>
                        <h3 className="font-medium text-marble-100 text-base">{discipline.name}</h3>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {discipline.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Lens Metaphor */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-marble-100 mb-6">The Lens Metaphor</h2>
          <div className="space-y-6">
            <div className="text-slate-400 space-y-4">
              <p>
                The circular holes in the Roman Dodecahedron are not merely decorative — they are{" "}
                <strong className="text-marble-200">apertures of varying focal lengths</strong>.
                Each hole offers a different view of what lies within.
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <p className="text-center text-marble-200 font-medium mb-4">
                  Same data. Multiple lenses. Multiple truths.
                </p>
                <p className="text-sm text-slate-400 text-center">
                  SOIL collects data in a lens-neutral format. The same organizational death can
                  then be examined through any of the 12 lenses, revealing different aspects of the
                  same reality.
                </p>
              </div>
              <p>
                This lens metaphor directly supports SOIL&apos;s core methodological commitment: we
                do not impose a single theoretical framework. We collect data neutrally and apply
                multiple lenses post-hoc, testing which frameworks best explain and predict
                organizational mortality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 text-center">
            <Library className="w-10 h-10 text-gold-400 mx-auto mb-4" />
            <h2 className="text-xl font-display text-marble-100 mb-3">Explore the Methodology</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Learn more about how SOIL applies this framework-agnostic approach to organizational
              research and what makes our data collection unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/research"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-gold-500/20 border border-gold-500/30 text-gold-400 hover:bg-gold-500/30 transition-colors text-sm font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                Research Center
              </a>
              <a
                href="/glossary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-slate-700 text-slate-400 hover:text-marble-100 hover:border-slate-600 transition-colors text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Glossary
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
