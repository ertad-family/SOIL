import { SectionLabel } from "@/components/ui/section-label";

const missions = [
  {
    numeral: "I",
    title: "Scientific Rigor",
    description:
      "We apply systematic, evidence-based methodology to data collection and analysis. From structured interviews to emerging patterns, we let the data speak - no preconceptions, no shortcuts.",
  },
  {
    numeral: "II",
    title: "Founder Healing",
    description:
      "Providing founders with closure and dignity after the end of their ventures. Through structured storytelling, we transform painful experiences into meaningful contributions.",
  },
  {
    numeral: "III",
    title: "Respect",
    description:
      "Entrepreneurs are undervalued by society despite their sacrifices and contributions. We work to restore the recognition they deserve - from communities, institutions, and governments.",
  },
];

export function MissionsSection() {
  return (
    <section className="pt-0 pb-20 md:pb-32 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our mission</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-16 text-marble-100">
          Three Pillars of Change
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/80 border-l-[3px] border-l-gold-500 rounded-xl p-8 md:p-10 min-h-[400px] flex flex-col overflow-hidden"
            >
              {/* Large Roman numeral as background pillar */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none">
                <span
                  className="font-serif text-[180px] md:text-[260px] font-bold leading-none"
                  style={{
                    WebkitTextStroke: "3px rgba(201, 148, 61, 0.2)",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {mission.numeral}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-marble-100 mb-6 max-w-[70%]">
                  {mission.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg max-w-[85%]">
                  {mission.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
