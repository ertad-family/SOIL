import { SectionLabel } from '@/components/ui/section-label'

const principles = [
  { label: 'Dignity', description: 'Every organization and founder deserves respect' },
  { label: 'Truth', description: 'Let data reveal patterns, not preconceptions' },
  { label: 'Service', description: 'Research that serves the community first' },
  { label: 'Rigor', description: 'Scientific standards in everything we do' },
]

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
            what we can learn from their journeys. We believe that every closure holds lessons that can
            help future founders, researchers, and society at large.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-xl font-medium text-gold-400 mb-2">{principle.label}</div>
                <p className="text-sm text-slate-500">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
