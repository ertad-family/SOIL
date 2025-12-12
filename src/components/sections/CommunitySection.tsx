import { Users, Shield, Calendar } from 'lucide-react'
import { SectionLabel } from '@/components/ui/section-label'

const communityElements = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Founder Community',
    description: 'Peer support, shared experiences, and consulting from those who understand the journey.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Keepers',
    description: 'Local leaders and guardians who nurture regional communities and preserve organizational memories.',
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Day of the Dead Venture',
    description: 'Annual celebration honoring organizations that have passed, their founders, and their contributions.',
  },
]

export function CommunitySection() {
  return (
    <section className="py-20 md:py-32 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>community</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-6 text-marble-100">
            The Heart of SOIL
          </h2>
          <p className="text-lg text-marble-400 max-w-2xl mx-auto">
            Our success is measured by the strength of our community. Together, we transform individual
            experiences into collective wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {communityElements.map((element, index) => (
            <div key={index} className="text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mx-auto">
                {element.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100">{element.title}</h3>
              <p className="text-marble-400 leading-relaxed">{element.description}</p>
            </div>
          ))}
        </div>

        {/* Central message - updated quote */}
        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-6 border border-gold-500/30 rounded-sm max-w-2xl">
            <p className="font-serif text-lg md:text-xl text-gold-400 italic leading-relaxed">
              &ldquo;Failure is not the opposite of success; it is part of success. By burying our dead properly, we fertilize the soil for new growth.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
