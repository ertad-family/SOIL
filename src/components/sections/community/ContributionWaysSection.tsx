'use client'

import { SectionLabel } from '@/components/ui/section-label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Users,
  Clock,
  Brain,
  DollarSign,
  Share2,
  UserPlus,
  Mail,
  Handshake,
  Lightbulb,
  Briefcase,
  MessageSquare,
  BarChart3,
  GraduationCap,
  Heart,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react'

interface ContributionOption {
  icon: React.ReactNode
  title: string
  description: string
  cta: string
  href: string
  external?: boolean
}

const tabsData = {
  social: {
    label: 'Invest Social',
    icon: <Users className="w-4 h-4" />,
    color: 'gold',
    options: [
      {
        icon: <Share2 className="w-6 h-6" />,
        title: 'Spread the Word',
        description: 'Share SOIL with your professional network. Help founders discover a community that understands.',
        cta: 'Share on Social',
        href: '#share',
      },
      {
        icon: <UserPlus className="w-6 h-6" />,
        title: 'Refer Talent & Support',
        description: 'Know potential team members, advisors, researchers, or investors? Introduce them to SOIL.',
        cta: 'Make Introduction',
        href: '/recommend',
      },
      {
        icon: <Mail className="w-6 h-6" />,
        title: 'Join Our Community',
        description: 'Subscribe to newsletter and follow us on social media to stay connected with updates.',
        cta: 'Subscribe',
        href: '#newsletter',
      },
    ] as ContributionOption[],
  },
  time: {
    label: 'Invest Time',
    icon: <Clock className="w-4 h-4" />,
    color: 'purple',
    options: [
      {
        icon: <Handshake className="w-6 h-6" />,
        title: 'Volunteer',
        description: 'Contribute your skills as a content reviewer, event organizer, translation helper, or community moderator.',
        cta: 'View Opportunities',
        href: '/volunteer',
      },
      {
        icon: <Lightbulb className="w-6 h-6" />,
        title: 'Help Solve Challenges',
        description: 'We have business and technical challenges we need help with. Browse open problems and propose solutions.',
        cta: 'View Challenges',
        href: '/challenges',
      },
      {
        icon: <Briefcase className="w-6 h-6" />,
        title: 'Join Our Team',
        description: 'Explore full-time and part-time positions. We\'re building something meaningful together.',
        cta: 'See Openings',
        href: '/careers',
      },
    ] as ContributionOption[],
  },
  knowledge: {
    label: 'Invest Knowledge',
    icon: <Brain className="w-4 h-4" />,
    color: 'emerald',
    options: [
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: 'Give Feedback',
        description: 'Share thoughts on platform, UX, content. Your perspective shapes our development priorities.',
        cta: 'Provide Feedback',
        href: '/feedback',
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Help with Analysis',
        description: 'Know competitors, similar projects, or adjacent research? Help us understand the landscape.',
        cta: 'Contribute Insights',
        href: '/analysis',
      },
      {
        icon: <GraduationCap className="w-6 h-6" />,
        title: 'Become Advisor/Mentor',
        description: 'Share your expertise in entrepreneurship, research methodology, community building, or technology.',
        cta: 'Apply',
        href: '/advisors',
      },
    ] as ContributionOption[],
  },
  money: {
    label: 'Invest Money',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'orange',
    options: [
      {
        icon: <Heart className="w-6 h-6" />,
        title: 'Donate',
        description: 'Support platform development with one-time or recurring donation via Patreon or direct transfer.',
        cta: 'Donate on Patreon',
        href: 'https://patreon.com/soil',
        external: true,
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'Become an Investor',
        description: 'SOIL is seeking strategic investors who believe in preserving organizational knowledge. Get our pitch deck.',
        cta: 'Request Pitch Deck',
        href: '/investors',
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: 'Sponsor Features',
        description: 'Sponsor specific features, research projects, or regional cenotapheries. Your name immortalized in the platform.',
        cta: 'Learn More',
        href: '/sponsors',
      },
    ] as ContributionOption[],
  },
}

const colorClasses = {
  gold: {
    iconBg: 'bg-gold-500/20',
    iconText: 'text-gold-400',
  },
  purple: {
    iconBg: 'bg-purple-500/20',
    iconText: 'text-purple-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/20',
    iconText: 'text-emerald-400',
  },
  orange: {
    iconBg: 'bg-orange-500/20',
    iconText: 'text-orange-400',
  },
}

function ContributionCard({ option, color }: { option: ContributionOption; color: string }) {
  const colors = colorClasses[color as keyof typeof colorClasses]

  return (
    <Card variant="dark" padding="lg" className="h-full flex flex-col">
      <CardHeader>
        <div className={`w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center ${colors.iconText} mb-2`}>
          {option.icon}
        </div>
        <CardTitle variant="dark">{option.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
          {option.description}
        </p>
        {option.external ? (
          <a href={option.href} target="_blank" rel="noopener noreferrer">
            <Button
              variant="dark-secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        ) : (
          <a href={option.href}>
            <Button
              variant="dark-secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  )
}

export function ContributionWaysSection() {
  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-16 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section id="contribution" className="py-16 md:py-24 bg-marble-950">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>all ways to contribute</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Support SOIL Your Way
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Every contribution matters. Whether you invest social capital, time, knowledge, or money —
              you help preserve organizational wisdom for future generations.
            </p>
          </div>

          <Tabs defaultValue="social" className="w-full">
            <TabsList variant="dark" className="w-full grid grid-cols-2 md:grid-cols-4 h-auto p-1.5 mb-8">
              {Object.entries(tabsData).map(([key, tab]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  variant="dark"
                  className="flex items-center gap-2 py-3"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(tabsData).map(([key, tab]) => (
              <TabsContent key={key} value={key} variant="dark">
                <div className="grid md:grid-cols-3 gap-6">
                  {tab.options.map((option, index) => (
                    <ContributionCard
                      key={index}
                      option={option}
                      color={tab.color}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-16 bg-gradient-to-b from-marble-950 to-slate-900" />

      {/* Decorative divider */}
      <div className="divider-roman py-8">
        <span className="text-gold-400 text-lg px-6">✦</span>
      </div>
    </>
  )
}
