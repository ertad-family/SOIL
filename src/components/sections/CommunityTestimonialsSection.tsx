import { SectionLabel } from '@/components/ui/section-label'

interface Testimonial {
  name: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'alex_founder',
    quote:
      'Finally, a place where my experience matters. Sharing my story helped me process what happened and maybe help someone avoid the same mistakes.',
  },
  {
    name: 'maria_ceo',
    quote:
      'The interview process was surprisingly therapeutic. I expected it to be painful, but it felt more like closure. The framework really guides you through reflection.',
  },
  {
    name: 'david_tech',
    quote:
      'As a researcher, the data quality here is remarkable. Real founders, real stories, structured in a way that actually enables pattern discovery.',
  },
  {
    name: 'sarah_ventures',
    quote:
      'I wish this existed when I was starting out. Learning from others\' failures is just as important as learning from successes.',
  },
  {
    name: 'james_serial',
    quote:
      'Three startups, three different endings. SOIL helped me see the common threads I was blind to. Invaluable for my next venture.',
  },
  {
    name: 'nina_advisor',
    quote:
      'The anonymization gave me confidence to be completely honest. No judgment, just contribution to collective knowledge.',
  },
  {
    name: 'chen_founder',
    quote:
      'Building something and watching it end is lonely. Here, I found a community that understands. We\'re not failures — we\'re data points for progress.',
  },
  {
    name: 'marcus_ops',
    quote:
      'Quick process, thoughtful questions. The team clearly understands what founders go through.',
  },
  {
    name: 'elena_startup',
    quote:
      'The cenotaph concept is beautiful. My company deserves to be remembered, not just forgotten. This gives it dignity.',
  },
  {
    name: 'tom_investor',
    quote:
      'I recommend SOIL to every founder in my portfolio who\'s winding down. It\'s part of a healthy closure process.',
  },
]

function StarRating() {
  return (
    <div className="flex gap-1 text-gold-500 text-xl mb-3">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          ✦
        </span>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 break-inside-avoid mb-4">
      <p className="text-marble-100 font-medium mb-2">{testimonial.name}</p>
      <StarRating />
      <p className="text-slate-400 text-sm leading-relaxed">{testimonial.quote}</p>
    </div>
  )
}

export function CommunityTestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-2 text-gold-500 text-3xl mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                ✦
              </span>
            ))}
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-marble-100 leading-tight">
            Community voices: hear from founders
            <br />
            who shared their stories
          </h2>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
