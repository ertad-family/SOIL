import { BookOpen, Globe, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SectionLabel } from '@/components/ui/section-label'

const audiences = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'For Founders',
    description:
      'Coin your story and transform your experience into knowledge that helps others. Become a volunteer, mentor, or community keeper.',
    cta: 'Coin Your Story',
    buttonVariant: 'dark-primary' as const,
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'For Business Community',
    description:
      'Support groundbreaking research, join our advisory board, or sponsor initiatives that advance organizational science and help future founders.',
    cta: 'Support Research',
    buttonVariant: 'light-primary' as const,
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'For Researchers',
    description:
      'Access anonymized datasets, collaborate on publications, and join our research network. We welcome partnerships with academic institutions worldwide.',
    cta: 'Partner With Us',
    buttonVariant: 'dark-primary' as const,
  },
]

export function GetInvolvedSection() {
  return (
    <section className="py-16 md:py-24 pb-32 animate-fade-in-up relative overflow-hidden bg-slate-900">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>get involved</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          Join the Movement
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <Card key={index} variant="dark-elevated" className="h-full flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                  {audience.icon}
                </div>
                <CardTitle variant="dark">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-slate-400 leading-relaxed flex-1">{audience.description}</p>
                <div className="mt-6">
                  <Button variant={audience.buttonVariant} size="lg" className="w-full">
                    {audience.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
