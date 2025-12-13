import { SectionLabel } from '@/components/ui/section-label'
import { Card } from '@/components/ui/card'

const ecosystem = [
  {
    title: 'Research Center',
    description: 'Academic research, data analysis, and publication of findings.',
    status: 'active' as const,
  },
  {
    title: 'Cenotaphery',
    description: 'Digital memorials honoring organizations and preserving their stories.',
    status: 'active' as const,
  },
  {
    title: 'Diagnostics Center',
    description: 'Tools for organizational health assessment and early warning systems.',
    status: 'construction' as const,
  },
  {
    title: 'Learning Hub',
    description: 'Courses and resources teaching organizational resilience and recovery.',
    status: 'construction' as const,
  },
  {
    title: 'Clinic',
    description: 'Personalized consulting and intervention for struggling organizations.',
    status: 'construction' as const,
  },
]

// Label component for "under construction" status
function ConstructionLabel() {
  return (
    <span className="inline-block font-sans text-xs font-medium tracking-[0.05em] text-slate-500 lowercase before:content-['[_'] after:content-['_]']">
      under construction
    </span>
  )
}

export function ScopeSection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>ecosystem</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 text-marble-100 leading-tight max-w-xl">
            Our Projects
          </h2>
        </div>

        {/* Bento Grid: 3 columns */}
        <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
          {/* Column 1: Full height card */}
          <Card
            variant="dark-elevated"
            padding="lg"
            interactive
            className="relative flex flex-col justify-end min-h-[400px] lg:min-h-full overflow-hidden"
          >
            {/* Decorative ellipses background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {[...Array(8)].map((_, i) => (
                    <ellipse
                      key={i}
                      cx="150"
                      cy="150"
                      rx={30 + i * 20}
                      ry={15 + i * 10}
                      fill="none"
                      stroke="rgba(196,161,90,0.3)"
                      strokeWidth="1"
                      transform={`rotate(${i * 5} 150 150)`}
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-auto">
              <h3 className="font-display text-2xl md:text-3xl font-medium text-marble-100 mb-3">
                {ecosystem[0].title}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                {ecosystem[0].description}
              </p>
            </div>
          </Card>

          {/* Column 2: 2 cards (top larger) */}
          <div className="flex flex-col gap-6">
            {/* Top card - larger, featured */}
            <Card
              variant="dark-elevated"
              padding="lg"
              interactive
              className="relative flex flex-col justify-between flex-[2] min-h-[280px] overflow-hidden"
            >
              {/* Decorative X pattern */}
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {[...Array(3)].map((_, i) => (
                    <g key={i} transform={`translate(${20 + i * 25}, ${20 + i * 25})`}>
                      <path d="M0 0 L20 20 M20 0 L0 20" stroke="rgba(196,161,90,0.5)" strokeWidth="3" fill="none" />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="font-display text-xl md:text-2xl font-medium text-marble-100 mb-2">
                  {ecosystem[1].title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {ecosystem[1].description}
                </p>
              </div>
            </Card>

            {/* Bottom card - smaller */}
            <Card
              variant="dark"
              padding="md"
              interactive
              className="relative flex flex-col justify-end flex-1 min-h-[180px]"
            >
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 opacity-40 pointer-events-none">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  {[...Array(4)].map((_, i) => (
                    <circle
                      key={i}
                      cx="40"
                      cy="40"
                      r={10 + i * 8}
                      fill="none"
                      stroke="rgba(196,161,90,0.3)"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
              </div>

              <div className="relative z-10">
                <ConstructionLabel />
                <h3 className="font-display text-xl font-medium text-marble-100 mb-1 mt-2">
                  {ecosystem[2].title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  {ecosystem[2].description}
                </p>
              </div>
            </Card>
          </div>

          {/* Column 3: 2 cards (top smaller) */}
          <div className="flex flex-col gap-6">
            {/* Top card - smaller */}
            <Card
              variant="dark"
              padding="md"
              interactive
              className="relative flex flex-col justify-end flex-1 min-h-[180px]"
            >
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 opacity-40 pointer-events-none">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  {[...Array(4)].map((_, i) => (
                    <circle
                      key={i}
                      cx="40"
                      cy="40"
                      r={10 + i * 8}
                      fill="none"
                      stroke="rgba(196,161,90,0.3)"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
              </div>

              <div className="relative z-10">
                <ConstructionLabel />
                <h3 className="font-display text-xl font-medium text-marble-100 mb-1 mt-2">
                  {ecosystem[3].title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  {ecosystem[3].description}
                </p>
              </div>
            </Card>

            {/* Bottom card - larger */}
            <Card
              variant="dark-elevated"
              padding="lg"
              interactive
              className="relative flex flex-col justify-end flex-[2] min-h-[280px] overflow-hidden"
            >
              {/* Decorative ellipses */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {[...Array(5)].map((_, i) => (
                    <ellipse
                      key={i}
                      cx="70"
                      cy="30"
                      rx={15 + i * 10}
                      ry={8 + i * 5}
                      fill="none"
                      stroke="rgba(196,161,90,0.4)"
                      strokeWidth="1"
                      transform={`rotate(${-15 + i * 3} 70 30)`}
                    />
                  ))}
                </svg>
              </div>

              <div className="relative z-10">
                <ConstructionLabel />
                <h3 className="font-display text-xl md:text-2xl font-medium text-marble-100 mb-2 mt-2">
                  {ecosystem[4].title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {ecosystem[4].description}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
