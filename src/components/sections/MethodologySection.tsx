import { SectionLabel } from '@/components/ui/section-label'

const steps = [
  {
    title: 'Data Collection',
    description: 'Our interview framework captures comprehensive organizational data through guided conversations with founders.',
  },
  {
    title: 'Anonymization',
    description: 'Privacy by default. All sensitive information is protected, ensuring safe participation for every contributor.',
  },
  {
    title: 'Pattern Emergence',
    description: 'Framework-agnostic analysis lets the data speak. We avoid imposing theories, allowing patterns to emerge naturally.',
  },
  {
    title: 'Open Research',
    description: 'Anonymized datasets available to researchers worldwide, enabling collaborative advancement of organizational science.',
  },
  {
    title: 'Machine Learning',
    description: 'Building specialized AI models trained on organizational data for future diagnostic and analytical tools.',
  },
]

export function MethodologySection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>methodology</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          How We Work
        </h2>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
            >
              {/* Step number */}
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-display font-semibold text-lg mb-4">
                {index + 1}
              </div>

              <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
