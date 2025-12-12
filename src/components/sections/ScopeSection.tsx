import {
  Users,
  FlaskConical,
  Landmark,
  Stethoscope,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react'
import { SectionLabel } from '@/components/ui/section-label'
import { FeatureCard, FeatureCardGrid } from '@/components/ui/feature-card'
import { Badge } from '@/components/ui/badge'

const ecosystem = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Community',
    description: 'The heart of SOIL — founders supporting founders through shared experience.',
    status: 'active' as const,
  },
  {
    icon: <FlaskConical className="w-8 h-8" />,
    title: 'Research Center',
    description: 'Academic research, data analysis, and publication of findings.',
    status: 'active' as const,
  },
  {
    icon: <Landmark className="w-8 h-8" />,
    title: 'Cenotaphery',
    description: 'Digital memorials honoring organizations and preserving their stories.',
    status: 'active' as const,
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: 'Diagnostics Center',
    description: 'Tools for organizational health assessment and early warning systems.',
    status: 'construction' as const,
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Educational Institute',
    description: 'Courses and resources teaching organizational resilience and recovery.',
    status: 'construction' as const,
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: 'Clinic',
    description: 'Personalized consulting and intervention for struggling organizations.',
    status: 'construction' as const,
  },
]

export function ScopeSection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>ecosystem</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          What We&apos;re Building
        </h2>

        <FeatureCardGrid columns={3}>
          {ecosystem.map((item, index) => (
            <div key={index} className="relative">
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                variant="dark"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  variant={item.status === 'active' ? 'dark-success' : 'dark-warning'}
                  size="sm"
                >
                  {item.status === 'active' ? 'Active' : 'Under Construction'}
                </Badge>
              </div>
            </div>
          ))}
        </FeatureCardGrid>
      </div>
    </section>
  )
}
