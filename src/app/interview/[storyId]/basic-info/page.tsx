'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useInterview } from '@/contexts/InterviewContext'
import { WizardLayout } from '@/components/layouts/wizard-layout'
import { FormField, FormSection } from '@/components/forms/form-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import type { OrganizationType, LifecycleStage, FounderRole, PublicNamingPreference } from '@/types/interview'
import { ORG_TYPE_LABELS, ORG_TYPE_DESCRIPTIONS, getBusinessModelsForOrgType, LIFECYCLE_STAGE_LABELS, LIFECYCLE_STAGE_DESCRIPTIONS } from '@/data/function-matrix'

// Wizard steps for Basic Info module
const STEPS = [
  { id: 'basics', label: 'The Basics', description: "Let's start with the essentials" },
  { id: 'timeline', label: 'Timeline', description: 'When did this story happen?' },
  { id: 'about-you', label: 'About You', description: 'And a bit about you' },
]

/**
 * Module 0: Basic Info
 * Collects organization basics, timeline, and founder role.
 */
export default function BasicInfoPage() {
  const router = useRouter()
  const {
    story,
    isLoading,
    error,
    updateBasicInfo,
    completeModule,
    saveStory,
  } = useInterview()

  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({})

  // Get business models for selected org type
  const businessModels = story?.basicInfo.organizationType
    ? getBusinessModelsForOrgType(story.basicInfo.organizationType)
    : []

  // Validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 0) {
      if (!story?.basicInfo.organizationName?.trim()) {
        errors.organizationName = 'Organization name is required'
      }
      if (!story?.basicInfo.description?.trim()) {
        errors.description = 'Please provide a brief description'
      }
      if (!story?.basicInfo.organizationType) {
        errors.organizationType = 'Please select an organization type'
      }
    }

    if (step === 1) {
      if (!story?.basicInfo.foundedDate) {
        errors.foundedDate = 'Please enter when the organization was founded'
      }
    }

    if (step === 2) {
      if (!story?.basicInfo.founderRole) {
        errors.founderRole = 'Please select your role'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setValidationErrors({})
    } else {
      router.push(`/interview/${story?.id}`)
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      setValidationErrors({})
    } else {
      // Complete the module
      setIsSubmitting(true)
      try {
        await completeModule('basic_info')
        router.push(`/interview/${story?.id}`)
      } catch (err) {
        console.error('Failed to complete module:', err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Update handlers
  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateBasicInfo({ [field]: e.target.value })
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSelectChange = (field: string) => (value: string) => {
    updateBasicInfo({ [field]: value })
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleOrgTypeChange = (value: string) => {
    updateBasicInfo({
      organizationType: value as OrganizationType,
      businessModel: null, // Reset business model when org type changes
    })
    if (validationErrors.organizationType) {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next.organizationType
        return next
      })
    }
  }

  const handleLocationChange = (field: 'country' | 'city') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!story) return
    updateBasicInfo({
      location: {
        country: story.basicInfo.location.country,
        city: story.basicInfo.location.city,
        [field]: e.target.value || null,
      },
    })
  }

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-marble-gradient flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

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
    >
      {/* Step 0: The Basics */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <FormField
            label="Organization Name"
            htmlFor="organizationName"
            required
            error={validationErrors.organizationName}
          >
            <Input
              id="organizationName"
              value={story.basicInfo.organizationName}
              onChange={handleTextChange('organizationName')}
              placeholder="What was it called?"
              error={!!validationErrors.organizationName}
            />
          </FormField>

          <FormField
            label="What did it do?"
            htmlFor="description"
            required
            error={validationErrors.description}
            hint="In one sentence, describe what the organization did"
          >
            <Textarea
              id="description"
              value={story.basicInfo.description}
              onChange={handleTextChange('description')}
              placeholder="e.g., A B2B SaaS platform that helped small businesses manage inventory"
              rows={2}
              error={!!validationErrors.description}
            />
          </FormField>

          <FormField
            label="Organization Type"
            required
            error={validationErrors.organizationType}
          >
            <RadioGroup
              value={story.basicInfo.organizationType || ''}
              onValueChange={handleOrgTypeChange}
              className="grid gap-3 sm:grid-cols-2"
            >
              {(Object.keys(ORG_TYPE_LABELS) as OrganizationType[]).map(type => (
                <div key={type} className="relative">
                  <RadioGroupItem
                    value={type}
                    id={type}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={type}
                    className="flex flex-col p-4 border rounded-lg cursor-pointer hover:border-gold-300 peer-data-[state=checked]:border-gold-500 peer-data-[state=checked]:bg-gold-50 transition-colors"
                  >
                    <span className="font-medium text-marble-900">
                      {ORG_TYPE_LABELS[type]}
                    </span>
                    <span className="text-sm text-marble-500">
                      {ORG_TYPE_DESCRIPTIONS[type]}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          {story.basicInfo.organizationType && businessModels.length > 0 && (
            <FormField
              label="Business Model"
              htmlFor="businessModel"
            >
              <Select
                value={story.basicInfo.businessModel || ''}
                onValueChange={handleSelectChange('businessModel')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                  {businessModels.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <FormField
            label="Industry"
            htmlFor="industry"
          >
            <Input
              id="industry"
              value={story.basicInfo.industry || ''}
              onChange={handleTextChange('industry')}
              placeholder="e.g., Fintech, Healthcare, Education"
            />
          </FormField>

          <FormSection title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Country" htmlFor="country">
                <Input
                  id="country"
                  value={story.basicInfo.location.country || ''}
                  onChange={handleLocationChange('country')}
                  placeholder="Country"
                />
              </FormField>
              <FormField label="City" htmlFor="city">
                <Input
                  id="city"
                  value={story.basicInfo.location.city || ''}
                  onChange={handleLocationChange('city')}
                  placeholder="City"
                />
              </FormField>
            </div>
          </FormSection>
        </div>
      )}

      {/* Step 1: Timeline */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="When was it founded?"
              htmlFor="foundedDate"
              required
              error={validationErrors.foundedDate}
            >
              <Input
                id="foundedDate"
                type="month"
                value={story.basicInfo.foundedDate || ''}
                onChange={handleTextChange('foundedDate')}
                error={!!validationErrors.foundedDate}
              />
            </FormField>

            <FormField
              label="When did it close?"
              htmlFor="closedDate"
            >
              <Input
                id="closedDate"
                type="month"
                value={story.basicInfo.closedDate || ''}
                onChange={handleTextChange('closedDate')}
              />
            </FormField>
          </div>

          <FormField
            label="What stage was it at when it closed?"
          >
            <RadioGroup
              value={story.basicInfo.stageAtClosure || ''}
              onValueChange={(value) => updateBasicInfo({ stageAtClosure: value as LifecycleStage })}
              className="grid gap-3 sm:grid-cols-2"
            >
              {(Object.keys(LIFECYCLE_STAGE_LABELS) as LifecycleStage[]).map(stage => (
                <div key={stage} className="relative">
                  <RadioGroupItem
                    value={stage}
                    id={`stage-${stage}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`stage-${stage}`}
                    className="flex flex-col p-4 border rounded-lg cursor-pointer hover:border-gold-300 peer-data-[state=checked]:border-gold-500 peer-data-[state=checked]:bg-gold-50 transition-colors"
                  >
                    <span className="font-medium text-marble-900">
                      {LIFECYCLE_STAGE_LABELS[stage]}
                    </span>
                    <span className="text-sm text-marble-500">
                      {LIFECYCLE_STAGE_DESCRIPTIONS[stage]}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          <FormField
            label="Peak team size"
            htmlFor="peakTeamSize"
            hint="How many people at its largest?"
          >
            <Input
              id="peakTeamSize"
              type="number"
              min={1}
              value={story.basicInfo.peakTeamSize || ''}
              onChange={(e) => updateBasicInfo({ peakTeamSize: parseInt(e.target.value) || null })}
              placeholder="e.g., 25"
            />
          </FormField>
        </div>
      )}

      {/* Step 2: About You */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <FormField
            label="What was your role?"
            required
            error={validationErrors.founderRole}
          >
            <RadioGroup
              value={story.basicInfo.founderRole || ''}
              onValueChange={(value) => {
                updateBasicInfo({ founderRole: value as FounderRole })
                if (validationErrors.founderRole) {
                  setValidationErrors(prev => {
                    const next = { ...prev }
                    delete next.founderRole
                    return next
                  })
                }
              }}
              className="space-y-2"
            >
              {[
                { value: 'founder', label: 'Founder' },
                { value: 'cofounder', label: 'Co-founder' },
                { value: 'ceo_non_founder', label: 'CEO (non-founder)' },
                { value: 'other', label: 'Other' },
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`role-${option.value}`} />
                  <Label htmlFor={`role-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          <FormField
            label="Are you comfortable being named publicly?"
            hint="Your story can be shared anonymously if you prefer"
          >
            <RadioGroup
              value={story.basicInfo.publicNaming || ''}
              onValueChange={(value) => updateBasicInfo({ publicNaming: value as PublicNamingPreference })}
              className="space-y-2"
            >
              {[
                { value: 'yes', label: 'Yes, I can be named' },
                { value: 'no', label: 'No, keep me anonymous' },
                { value: 'decide_later', label: "I'll decide later" },
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`naming-${option.value}`} />
                  <Label htmlFor={`naming-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          <FormField
            label="Contact email"
            htmlFor="contactEmail"
            hint="We'll only use this to contact you about your story"
          >
            <Input
              id="contactEmail"
              type="email"
              value={story.basicInfo.contactEmail || ''}
              onChange={handleTextChange('contactEmail')}
              placeholder="your@email.com"
            />
          </FormField>
        </div>
      )}
    </WizardLayout>
  )
}
