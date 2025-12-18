'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useInterview } from '@/contexts/InterviewContext'
import { WizardLayout } from '@/components/layouts/wizard-layout'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/forms/form-field'
import { cn } from '@/lib/utils'
import {
  Plus,
  Trash2,
  User,
  Check,
} from 'lucide-react'
import type {
  PersonalEvent,
  PersonalEventCategory,
  FounderBackground,
  LifecycleStage,
} from '@/types/interview'

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  { id: 'before', label: 'Before It Began', description: 'Your background and readiness' },
  { id: 'beginning', label: 'The Beginning', description: 'How you started' },
  { id: 'journey', label: 'The Journey', description: 'How it evolved' },
  { id: 'cost', label: 'The Cost', description: 'Personal impact' },
  { id: 'now', label: 'Now', description: 'Where you are today' },
  { id: 'events', label: 'Personal Events', description: 'Life events that shaped your journey' },
]

// =============================================================================
// CONSTANTS
// =============================================================================

const PRIOR_EXPERIENCE_OPTIONS: Array<{ value: NonNullable<FounderBackground['priorExperience']>; label: string }> = [
  { value: 'first_time', label: 'This was my first time' },
  { value: 'tried_before', label: 'I had tried before but never succeeded' },
  { value: 'done_before', label: 'I had done this successfully before' },
]

const DOMAIN_KNOWLEDGE_OPTIONS: Array<{ value: NonNullable<FounderBackground['domainKnowledge']>; label: string }> = [
  { value: 'learning', label: 'I was learning as I went' },
  { value: 'knew_basics', label: 'I knew the basics' },
  { value: 'deep_expertise', label: 'I had deep expertise' },
]

const LIFE_SITUATION_OPTIONS: Array<{ value: NonNullable<FounderBackground['lifeSituation']>; label: string }> = [
  { value: 'stable', label: 'Stable - leaving a secure position' },
  { value: 'in_transition', label: 'In transition - between things anyway' },
  { value: 'ready_for_leap', label: 'Ready for a leap - nothing to lose' },
]

const COMMITMENT_OPTIONS: Array<{ value: NonNullable<FounderBackground['commitment']>; label: string }> = [
  { value: 'full_time', label: 'I went full-time from day one' },
  { value: 'eased_in', label: 'I eased into it gradually' },
  { value: 'never_full_time', label: 'I never went full-time' },
]

const STARTED_WITH_OPTIONS: Array<{ value: NonNullable<FounderBackground['startedWith']>; label: string }> = [
  { value: 'solo', label: 'Solo' },
  { value: 'one_other', label: 'With one other person' },
  { value: 'team', label: 'With a team' },
]

const ROLE_CLARITY_OPTIONS: Array<{ value: NonNullable<FounderBackground['roleClarity']>; label: string }> = [
  { value: 'crystal_clear', label: 'Crystal clear from the start' },
  { value: 'figured_out', label: 'We figured it out along the way' },
  { value: 'always_fuzzy', label: 'It was always a bit fuzzy' },
]

const MOTIVATION_OPTIONS: Array<{ value: NonNullable<FounderBackground['motivationEvolution']>; label: string }> = [
  { value: 'grew_stronger', label: 'It grew stronger over time' },
  { value: 'stayed_steady', label: 'It stayed steady throughout' },
  { value: 'started_fading', label: 'It started to fade at some point' },
]

const COFOUNDER_RELATIONSHIP_OPTIONS: Array<{ value: NonNullable<FounderBackground['cofounderRelationship']>; label: string }> = [
  { value: 'got_closer', label: 'We got closer over time' },
  { value: 'stayed_solid', label: 'We stayed solid throughout' },
  { value: 'got_hard', label: 'Things got hard between us' },
  { value: 'split', label: 'We split apart' },
]

const INVESTMENT_LEVEL_OPTIONS: Array<{ value: NonNullable<FounderBackground['investmentLevel']>; label: string }> = [
  { value: 'yes_everything', label: 'Yes, I gave everything' },
  { value: 'kept_boundaries', label: 'I tried to keep some boundaries' },
  { value: 'pulled_back', label: 'I pulled back at some point' },
]

const IMPACT_OPTIONS: Array<{ value: NonNullable<FounderBackground['healthImpact']>; label: string }> = [
  { value: 'no', label: 'No' },
  { value: 'a_little', label: 'A little' },
  { value: 'significantly', label: 'Significantly' },
]

const RECOVERY_TIME_OPTIONS: Array<{ value: NonNullable<FounderBackground['recoveryTime']>; label: string }> = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'still_working', label: 'Still working on it' },
]

const CURRENT_FEELING_OPTIONS: Array<{ value: NonNullable<FounderBackground['currentFeeling']>; label: string }> = [
  { value: 'distressed', label: 'Distressed' },
  { value: 'worried', label: 'Worried' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'hopeful', label: 'Hopeful' },
  { value: 'content', label: 'Content' },
]

const WOULD_DO_AGAIN_OPTIONS: Array<{ value: NonNullable<FounderBackground['wouldDoAgain']>; label: string }> = [
  { value: 'yes_no_hesitation', label: 'Yes, without hesitation' },
  { value: 'yes_differently', label: 'Yes, but I would do it differently' },
  { value: 'probably_not', label: 'Probably not' },
  { value: 'definitely_not', label: 'Definitely not' },
]

const LIFECYCLE_STAGES: Array<{ value: LifecycleStage; label: string }> = [
  { value: 'formation', label: 'Formation (<10 people)' },
  { value: 'establishment', label: 'Establishment (10-30 people)' },
  { value: 'growth', label: 'Growth (30-100 people)' },
  { value: 'maturity', label: 'Maturity (100+ people)' },
]

const EVENT_CATEGORIES: Array<{ value: PersonalEventCategory; label: string; description: string }> = [
  { value: 'health', label: 'Health', description: 'Physical or mental health events' },
  { value: 'family', label: 'Family', description: 'Family changes or crises' },
  { value: 'life_changes', label: 'Life Changes', description: 'Major life transitions' },
  { value: 'other_commitments', label: 'Other Commitments', description: 'Other demands on your time' },
  { value: 'positive_shifts', label: 'Positive Shifts', description: 'Positive personal developments' },
]

const EVENT_SUBTYPES: Record<PersonalEventCategory, string[]> = {
  health: [
    'Burnout',
    'Physical illness',
    'Mental health crisis',
    'Injury',
    'Recovery/healing',
    'Other',
  ],
  family: [
    'Birth of child',
    'Family illness',
    'Family death',
    'Divorce/separation',
    'Family conflict',
    'Caregiving responsibility',
    'Other',
  ],
  life_changes: [
    'Relocation',
    'New relationship',
    'Relationship ending',
    'Financial event',
    'Crisis of meaning',
    'Other',
  ],
  other_commitments: [
    'Another job/project',
    'Education',
    'Community involvement',
    'Personal project',
    'Other',
  ],
  positive_shifts: [
    'Personal breakthrough',
    'New perspective',
    'Improved health',
    'Better support system',
    'Other',
  ],
}

const CAPACITY_IMPACT_OPTIONS: Array<{ value: NonNullable<PersonalEvent['capacityImpact']>; label: string }> = [
  { value: 'couldnt_focus', label: "I couldn't focus at all" },
  { value: 'significantly_reduced', label: 'My capacity was significantly reduced' },
  { value: 'somewhat_reduced', label: 'It was somewhat reduced' },
  { value: 'maintained', label: 'I maintained my capacity' },
  { value: 'actually_helped', label: 'It actually helped me' },
]

const ORGANIZATION_ADAPTED_OPTIONS: Array<{ value: NonNullable<PersonalEvent['organizationAdapted']>; label: string }> = [
  { value: 'others_stepped_up', label: 'Others stepped up' },
  { value: 'tried_but_struggled', label: 'They tried but struggled' },
  { value: 'suffered', label: 'The organization suffered' },
  { value: 'no_one_else', label: 'There was no one else' },
]

const LOOKING_BACK_OPTIONS: Array<{ value: NonNullable<PersonalEvent['lookingBack']>; label: string }> = [
  { value: 'wish_asked_help', label: 'I wish I had asked for more help' },
  { value: 'wish_stepped_away', label: 'I wish I had stepped away' },
  { value: 'proud', label: "I'm proud of how I handled it" },
  { value: 'impossible_either_way', label: 'It was impossible either way' },
]

// =============================================================================
// HELPER: Create empty event
// =============================================================================

function createEmptyEvent(): PersonalEvent {
  return {
    id: crypto.randomUUID(),
    date: '',
    category: 'health',
    subType: '',
    capacityImpact: null,
    organizationAdapted: null,
    lookingBack: null,
    details: null,
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FounderPage() {
  const router = useRouter()
  const {
    story,
    isLoading,
    updateFounderContext,
    completeModule,
  } = useInterview()

  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null)

  // Get data from story
  const background = story?.founderContext.background
  const events = story?.founderContext.events ?? []

  // ==========================================================================
  // BACKGROUND HANDLERS
  // ==========================================================================

  const updateBackground = <K extends keyof FounderBackground>(
    field: K,
    value: FounderBackground[K]
  ) => {
    if (!story || !background) return
    updateFounderContext({
      background: { ...background, [field]: value },
    })
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const addEvent = () => {
    if (!story) return
    const newEvent = createEmptyEvent()
    updateFounderContext({ events: [...events, newEvent] })
    setExpandedEventId(newEvent.id)
  }

  const updateEvent = (eventId: string, updates: Partial<PersonalEvent>) => {
    if (!story) return
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, ...updates } : e
    )
    updateFounderContext({ events: updatedEvents })
  }

  const removeEvent = (eventId: string) => {
    if (!story) return
    updateFounderContext({ events: events.filter(e => e.id !== eventId) })
    if (expandedEventId === eventId) {
      setExpandedEventId(null)
    }
  }

  // ==========================================================================
  // NAVIGATION HANDLERS
  // ==========================================================================

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push(`/interview/${story?.id}`)
    }
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsSubmitting(true)
      try {
        await completeModule('founder')
        router.push(`/interview/${story?.id}`)
      } catch (err) {
        console.error('Failed to complete module:', err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading || !story || !background) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // ==========================================================================
  // STEP 1: BEFORE IT BEGAN
  // ==========================================================================

  const renderBefore = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Help us understand where you were when you started this organization.
      </p>

      <FormField variant="dark" label="Prior startup/business experience" htmlFor="prior-experience">
        <div className="space-y-2">
          {PRIOR_EXPERIENCE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('priorExperience', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.priorExperience === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="Domain/industry knowledge" htmlFor="domain-knowledge">
        <div className="space-y-2">
          {DOMAIN_KNOWLEDGE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('domainKnowledge', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.domainKnowledge === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="Your life situation at the time" htmlFor="life-situation">
        <div className="space-y-2">
          {LIFE_SITUATION_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('lifeSituation', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.lifeSituation === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )

  // ==========================================================================
  // STEP 2: THE BEGINNING
  // ==========================================================================

  const renderBeginning = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        How did you start this journey?
      </p>

      <FormField variant="dark" label="Your commitment level" htmlFor="commitment">
        <div className="space-y-2">
          {COMMITMENT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('commitment', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.commitment === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="Who did you start with?" htmlFor="started-with">
        <div className="space-y-2">
          {STARTED_WITH_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('startedWith', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.startedWith === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      {background.startedWith && background.startedWith !== 'solo' && (
        <FormField variant="dark" label="How did you find your co-founder(s)?" htmlFor="how-found" hint="Optional">
          <Textarea
            variant="dark"
            id="how-found"
            value={background.howFoundCoFounders || ''}
            onChange={(e) => updateBackground('howFoundCoFounders', e.target.value || null)}
            placeholder="e.g., old friends, met at work, through an accelerator..."
            rows={2}
          />
        </FormField>
      )}

      {background.startedWith && background.startedWith !== 'solo' && (
        <FormField variant="dark" label="How clear were the roles between you?" htmlFor="role-clarity">
          <div className="space-y-2">
            {ROLE_CLARITY_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => updateBackground('roleClarity', option.value)}
                className={cn(
                  'w-full p-3 rounded-md border text-sm text-left transition-colors',
                  background.roleClarity === option.value
                    ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>
      )}
    </div>
  )

  // ==========================================================================
  // STEP 3: THE JOURNEY
  // ==========================================================================

  const renderJourney = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        How did things evolve along the way?
      </p>

      <FormField variant="dark" label="How did your motivation evolve?" htmlFor="motivation">
        <div className="space-y-2">
          {MOTIVATION_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('motivationEvolution', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.motivationEvolution === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      {background.motivationEvolution === 'started_fading' && (
        <FormField variant="dark" label="When did you first notice the fading?" htmlFor="fading-stage">
          <div className="flex flex-wrap gap-2">
            {LIFECYCLE_STAGES.map(option => (
              <button
                key={option.value}
                onClick={() => updateBackground('fadingNoticedAt', option.value)}
                className={cn(
                  'px-3 py-2 rounded text-sm transition-colors',
                  background.fadingNoticedAt === option.value
                    ? 'bg-gold-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>
      )}

      {background.startedWith && background.startedWith !== 'solo' && (
        <FormField variant="dark" label="How did your co-founder relationship evolve?" htmlFor="cofounder-relationship">
          <div className="space-y-2">
            {COFOUNDER_RELATIONSHIP_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => updateBackground('cofounderRelationship', option.value)}
                className={cn(
                  'w-full p-3 rounded-md border text-sm text-left transition-colors',
                  background.cofounderRelationship === option.value
                    ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>
      )}

      <FormField variant="dark" label="Did this become your whole life?" htmlFor="investment-level">
        <div className="space-y-2">
          {INVESTMENT_LEVEL_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('investmentLevel', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.investmentLevel === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )

  // ==========================================================================
  // STEP 4: THE COST
  // ==========================================================================

  const renderCost = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        This journey affects us deeply. How did it affect you?
      </p>

      <FormField variant="dark" label="Did your health suffer?" htmlFor="health-impact">
        <div className="flex gap-2">
          {IMPACT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('healthImpact', option.value)}
              className={cn(
                'flex-1 p-3 rounded-md border text-sm transition-colors',
                background.healthImpact === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="Did your personal relationships suffer?" htmlFor="relationship-impact">
        <div className="flex gap-2">
          {IMPACT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('relationshipImpact', option.value)}
              className={cn(
                'flex-1 p-3 rounded-md border text-sm transition-colors',
                background.relationshipImpact === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="Did your finances suffer?" htmlFor="finance-impact">
        <div className="flex gap-2">
          {IMPACT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('financeImpact', option.value)}
              className={cn(
                'flex-1 p-3 rounded-md border text-sm transition-colors',
                background.financeImpact === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="How long did it take to recover after it ended?" htmlFor="recovery-time">
        <div className="flex flex-wrap gap-2">
          {RECOVERY_TIME_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('recoveryTime', option.value)}
              className={cn(
                'px-4 py-2 rounded text-sm transition-colors',
                background.recoveryTime === option.value
                  ? 'bg-gold-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )

  // ==========================================================================
  // STEP 5: NOW
  // ==========================================================================

  const renderNow = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Where are you now in processing this experience?
      </p>

      <FormField variant="dark" label="How long since it ended?" htmlFor="time-since-end" hint="Optional">
        <Input
          variant="dark"
          id="time-since-end"
          type="text"
          value={background.timeSinceEnd || ''}
          onChange={(e) => updateBackground('timeSinceEnd', e.target.value || null)}
          placeholder="e.g., 3 months, 2 years..."
        />
      </FormField>

      <FormField variant="dark" label="How do you feel about it now?" htmlFor="current-feeling">
        <div className="flex flex-wrap gap-2">
          {CURRENT_FEELING_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('currentFeeling', option.value)}
              className={cn(
                'px-4 py-2 rounded text-sm transition-colors',
                background.currentFeeling === option.value
                  ? 'bg-gold-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField variant="dark" label="What has helped you process this experience?" htmlFor="what-helped" hint="Optional">
        <Textarea
          variant="dark"
          id="what-helped"
          value={background.whatHelpedProcess || ''}
          onChange={(e) => updateBackground('whatHelpedProcess', e.target.value || null)}
          placeholder="e.g., talking to others, therapy, time, new projects..."
          rows={3}
        />
      </FormField>

      <FormField variant="dark" label="Knowing what you know now, would you do it again?" htmlFor="would-do-again">
        <div className="space-y-2">
          {WOULD_DO_AGAIN_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => updateBackground('wouldDoAgain', option.value)}
              className={cn(
                'w-full p-3 rounded-md border text-sm text-left transition-colors',
                background.wouldDoAgain === option.value
                  ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )

  // ==========================================================================
  // STEP 6: EVENTS
  // ==========================================================================

  const renderEvents = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Add significant personal events during your organization&apos;s life that affected your ability to lead.
      </p>

      {/* Events list */}
      <div className="space-y-4">
        {events.map((event) => {
          const isExpanded = expandedEventId === event.id
          const categoryInfo = EVENT_CATEGORIES.find(c => c.value === event.category)

          return (
            <div key={event.id} className="border border-slate-600 rounded-lg overflow-hidden">
              {/* Event header */}
              <button
                onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-marble-100">
                    {event.date || 'No date'} - {event.subType || categoryInfo?.label || 'New Event'}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeEvent(event.id)
                  }}
                  className="text-slate-500 hover:text-error-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </button>

              {/* Event details */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField variant="dark" label="Date" htmlFor={`date-${event.id}`}>
                      <Input
                        variant="dark"
                        id={`date-${event.id}`}
                        type="month"
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                      />
                    </FormField>

                    <FormField variant="dark" label="Category" htmlFor={`category-${event.id}`}>
                      <select
                        id={`category-${event.id}`}
                        value={event.category}
                        onChange={(e) => updateEvent(event.id, {
                          category: e.target.value as PersonalEventCategory,
                          subType: '',
                        })}
                        className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                      >
                        {EVENT_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField variant="dark" label="What happened?" htmlFor={`subtype-${event.id}`}>
                    <select
                      id={`subtype-${event.id}`}
                      value={event.subType}
                      onChange={(e) => updateEvent(event.id, { subType: e.target.value })}
                      className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                    >
                      <option value="">Select...</option>
                      {EVENT_SUBTYPES[event.category].map(subtype => (
                        <option key={subtype} value={subtype}>
                          {subtype}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField variant="dark" label="How did this affect your capacity?" htmlFor={`capacity-${event.id}`}>
                    <div className="space-y-2">
                      {CAPACITY_IMPACT_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          onClick={() => updateEvent(event.id, { capacityImpact: option.value })}
                          className={cn(
                            'w-full p-3 rounded-md border text-sm text-left transition-colors',
                            event.capacityImpact === option.value
                              ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField variant="dark" label="How did the organization adapt?" htmlFor={`adapted-${event.id}`}>
                    <div className="space-y-2">
                      {ORGANIZATION_ADAPTED_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          onClick={() => updateEvent(event.id, { organizationAdapted: option.value })}
                          className={cn(
                            'w-full p-3 rounded-md border text-sm text-left transition-colors',
                            event.organizationAdapted === option.value
                              ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField variant="dark" label="Looking back..." htmlFor={`looking-back-${event.id}`}>
                    <div className="space-y-2">
                      {LOOKING_BACK_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          onClick={() => updateEvent(event.id, { lookingBack: option.value })}
                          className={cn(
                            'w-full p-3 rounded-md border text-sm text-left transition-colors',
                            event.lookingBack === option.value
                              ? 'bg-gold-900/30 border-gold-500 text-marble-100'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField variant="dark" label="Additional details" htmlFor={`details-${event.id}`} hint="Optional">
                    <Textarea
                      variant="dark"
                      id={`details-${event.id}`}
                      value={event.details || ''}
                      onChange={(e) => updateEvent(event.id, { details: e.target.value || null })}
                      placeholder="Any additional context..."
                      rows={2}
                    />
                  </FormField>

                  {/* Done button */}
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="dark-secondary"
                      size="sm"
                      onClick={() => setExpandedEventId(null)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {events.length === 0 && (
          <div className="text-center py-8 border border-dashed border-slate-600 rounded-lg">
            <p className="text-slate-400 mb-4">No personal events added yet</p>
            <p className="text-xs text-slate-500">This section is optional but helps us understand the full picture</p>
          </div>
        )}
      </div>

      {/* Add event button */}
      <Button
        variant="dark-secondary"
        onClick={addEvent}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Personal Event
      </Button>
    </div>
  )

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      nextLabel={currentStep === STEPS.length - 1 ? 'Complete' : 'Continue'}
      title="Your Story"
      subtitle="The human behind the organization"
    >
      {currentStep === 0 && renderBefore()}
      {currentStep === 1 && renderBeginning()}
      {currentStep === 2 && renderJourney()}
      {currentStep === 3 && renderCost()}
      {currentStep === 4 && renderNow()}
      {currentStep === 5 && renderEvents()}
    </WizardLayout>
  )
}
