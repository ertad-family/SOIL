import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[3fr_1fr] gap-12 lg:gap-16 items-end">
          {/* Left: Headline */}
          <div className="animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl lg:text-[100px] font-semibold leading-[1.1] text-marble-100">
              <span className="text-gradient-gold">Advancing Organizations Theory </span>
              <span className="text-marble-100">with the Power of Community and AI</span>
            </h1>
          </div>

          {/* Right: Description and CTAs */}
          <div className="animate-fade-in-up stagger-1">
            <p className="text-slate-400 leading-relaxed mb-8">
              Join a pioneering research initiative transforming how we understand organizations.
              Your experience becomes part of a growing body of knowledge that will help future generations of founders
              navigate their journeys with greater insight.
            </p>

            <div className="flex flex-col gap-4">
              <Button
                variant="dark-primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                }
              >
                Coin Your Story
              </Button>
              <Button variant="dark-secondary" size="lg" className="w-full sm:w-auto">
                Explore the Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width decorative divider under entire section */}
      <div className="divider-roman mt-24 md:mt-32 animate-fade-in-up stagger-3">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  )
}
