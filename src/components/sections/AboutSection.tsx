import { SectionLabel } from "@/components/ui/section-label";

const principles = [
  {
    label: "Dignity",
    description: "Every founder and organization deserves respectful remembrance",
  },
  { label: "Truth", description: "Honest, systematic understanding of why organizations die" },
  { label: "Service", description: "Data serves the ecosystem, not just profit" },
  { label: "Beauty", description: "Excellence in design honors the effort founders invested" },
  { label: "Community", description: "Founders supporting founders through shared vulnerability" },
  { label: "Rigor", description: "Scientific standards for research and analysis" },
  { label: "Transparency", description: "Clear about how data is used and how revenue flows" },
];

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>about soil</SectionLabel>

          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Social Organizational Intelligence Lab
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed mb-12">
            S.O.I.L. is a research initiative dedicated to understanding how organizations end — and
            what we can learn from their journeys. We believe that every closure holds lessons that
            can help future founders, researchers, and society at large.
          </p>

          {/* Principles */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="text-center w-[calc(50%-12px)] md:w-[calc(25%-24px)] lg:w-auto lg:min-w-[140px]"
              >
                <div className="font-serif text-xl font-medium text-gold-400 mb-2">
                  {principle.label}
                </div>
                <p className="text-sm text-slate-500">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
