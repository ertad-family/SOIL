'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { WizardLayout } from '@/components/layouts/wizard-layout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react'
import type { DesignOption, DesignStatus, OrganizationContext } from '@/types/cenotaph'
import { cn } from '@/lib/utils'

interface MemorialData {
  id: string
  slug: string
  organization_name: string
  organization_type: string | null
  epitaph: string | null
  design_status: DesignStatus
  cenotaph_design: {
    options: DesignOption[]
    selectedId: string | null
  } | null
  cenotaph_image_url: string | null
  organization?: {
    name: string
    organization_type: string | null
    industry: string | null
    founded_date: string | null
    closed_date: string | null
    peak_team_size: number | null
    location_country: string | null
    location_city: string | null
  } | null
}

const WIZARD_STEPS = [
  { id: 'review', label: 'Review', description: 'Review your organization details' },
  { id: 'customize', label: 'Customize', description: 'Add your design preferences' },
  { id: 'generate', label: 'Generate', description: 'AI creates design options' },
  { id: 'select', label: 'Select', description: 'Choose your cenotaph design' },
]

export default function CenotaphWizardPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const memorialId = params.memorialId as string

  const [memorial, setMemorial] = useState<MemorialData | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [userPrompt, setUserPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch memorial data
  useEffect(() => {
    async function fetchMemorial() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('memorials')
          .select(`
            id,
            slug,
            organization_name,
            organization_type,
            epitaph,
            design_status,
            cenotaph_design,
            cenotaph_image_url,
            organization:organizations (
              name,
              organization_type,
              industry,
              founded_date,
              closed_date,
              peak_team_size,
              location_country,
              location_city
            )
          `)
          .eq('id', memorialId)
          .single()

        if (error) throw error
        setMemorial(data as unknown as MemorialData)

        // Set initial step based on current status
        if (data?.design_status === 'options_ready') {
          setCurrentStep(3) // Go to select step
        } else if (data?.design_status === 'completed') {
          setCurrentStep(3) // Show completed state
          setSelectedDesignId(data.cenotaph_design?.selectedId || null)
        }
      } catch (err) {
        console.error('Failed to fetch memorial:', err)
        setError('Failed to load memorial data')
      } finally {
        setIsLoading(false)
      }
    }

    if (memorialId) {
      fetchMemorial()
    }
  }, [memorialId, supabase])

  // Generate designs
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/cenotaph/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorialId,
          userPrompt
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Generation failed')
      }

      // Update local state with new options
      setMemorial(prev => prev ? {
        ...prev,
        design_status: 'options_ready',
        cenotaph_design: {
          options: result.options,
          selectedId: null
        }
      } : null)

      setCurrentStep(3) // Move to select step
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate designs')
    } finally {
      setIsGenerating(false)
    }
  }, [memorialId, userPrompt])

  // Select design
  const handleSelect = useCallback(async () => {
    if (!selectedDesignId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/cenotaph/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorialId,
          selectedDesignId
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Selection failed')
      }

      // Update local state
      setMemorial(prev => prev ? {
        ...prev,
        design_status: 'completed',
        cenotaph_image_url: result.imageUrl,
        cenotaph_design: prev.cenotaph_design ? {
          ...prev.cenotaph_design,
          selectedId: selectedDesignId
        } : null
      } : null)

      // Redirect to memorial page
      router.push(`/memorials/${memorial?.slug}`)
    } catch (err) {
      console.error('Selection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save selection')
    } finally {
      setIsLoading(false)
    }
  }, [memorialId, selectedDesignId, memorial?.slug, router])

  const handleNext = () => {
    if (currentStep === 1) {
      // Move to generate step and start generation
      setCurrentStep(2)
      handleGenerate()
    } else if (currentStep === 3) {
      // Final selection
      handleSelect()
    } else {
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  if (isLoading && !memorial) {
    return (
      <div className="min-h-screen bg-slate-gradient flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-slate-gradient flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl text-marble-100">Memorial not found</h1>
        </div>
      </div>
    )
  }

  const org = memorial.organization || {
    name: memorial.organization_name,
    organization_type: memorial.organization_type,
    industry: null,
    founded_date: null,
    closed_date: null,
    peak_team_size: null,
    location_country: null,
    location_city: null
  }

  return (
    <WizardLayout
      variant="dark"
      steps={WIZARD_STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      title={WIZARD_STEPS[currentStep].label}
      subtitle={WIZARD_STEPS[currentStep].description}
      cancelHref={`/organization/${memorial.organization_name}`}
      isLoading={isLoading || isGenerating}
      canGoBack={currentStep > 0 && currentStep !== 2 && !isGenerating}
      canGoNext={
        (currentStep === 0) ||
        (currentStep === 1 && !isGenerating) ||
        (currentStep === 3 && !!selectedDesignId && memorial.design_status !== 'completed')
      }
      nextLabel={
        currentStep === 1 ? 'Generate Designs' :
        currentStep === 3 ? 'Confirm Selection' :
        'Continue'
      }
    >
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Step 1: Review */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <p className="text-slate-300">
            Review your organization details. This information will guide the AI in creating a unique memorial design.
          </p>

          <div className="grid gap-4">
            <div className="p-4 bg-slate-700/50 rounded-md">
              <label className="text-sm text-slate-400">Organization Name</label>
              <p className="text-lg text-marble-100 font-medium">{org.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Industry</label>
                <p className="text-marble-100">{org.industry || org.organization_type || 'Not specified'}</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Peak Team Size</label>
                <p className="text-marble-100">{org.peak_team_size ? `${org.peak_team_size} people` : 'Not specified'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Founded</label>
                <p className="text-marble-100">{org.founded_date || 'Not specified'}</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Closed</label>
                <p className="text-marble-100">{org.closed_date || 'Not specified'}</p>
              </div>
            </div>

            {memorial.epitaph && (
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Epitaph</label>
                <p className="text-marble-100 italic">&ldquo;{memorial.epitaph}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Customize */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <p className="text-slate-300">
            Share your vision for the memorial. Describe any specific elements, styles, or symbolism you&apos;d like to see.
          </p>

          <div>
            <label className="block text-sm font-medium text-marble-200 mb-2">
              Your Design Wishes (optional)
            </label>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Example: I'd like a monument that incorporates books or knowledge symbols, representing our educational mission. Warm colors would be nice, perhaps with some green elements representing growth..."
              className="min-h-[150px] bg-slate-700 border-slate-600 text-marble-100 placeholder:text-slate-500"
              maxLength={2000}
            />
            <p className="mt-2 text-sm text-slate-400">
              {userPrompt.length}/2000 characters
            </p>
          </div>

          <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-md">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <p className="text-gold-300 font-medium">AI Design Process</p>
                <p className="text-slate-300 text-sm mt-1">
                  Our AI will create 3 unique design options based on your organization&apos;s story and your preferences. You can regenerate options if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generate (loading state) */}
      {currentStep === 2 && (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
          <h3 className="text-xl text-marble-100 font-medium mb-2">
            Creating Your Cenotaph Designs
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Our AI is crafting 3 unique memorial designs based on your organization&apos;s legacy. This may take a minute...
          </p>
        </div>
      )}

      {/* Step 4: Select */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {memorial.design_status === 'completed' ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl text-marble-100 font-medium mb-2">
                Design Complete
              </h3>
              <p className="text-slate-400 mb-6">
                Your cenotaph design has been saved.
              </p>
              {memorial.cenotaph_image_url && (
                <div className="max-w-sm mx-auto rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={memorial.cenotaph_image_url}
                    alt="Your cenotaph design"
                    className="w-full h-auto"
                  />
                </div>
              )}
              <Button
                variant="dark-primary"
                className="mt-6"
                onClick={() => router.push(`/memorials/${memorial.slug}`)}
              >
                View Memorial
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-slate-300">
                  Select your preferred design for the cenotaph.
                </p>
                <Button
                  variant="dark-ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedDesignId(null)
                  }}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {memorial.cenotaph_design?.options?.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDesignId(option.id)}
                    className={cn(
                      'relative rounded-lg overflow-hidden border-2 transition-all',
                      selectedDesignId === option.id
                        ? 'border-gold-500 ring-2 ring-gold-500/50'
                        : 'border-slate-600 hover:border-slate-500'
                    )}
                  >
                    <img
                      src={option.url}
                      alt={`Design option ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    {selectedDesignId === option.id && (
                      <div className="absolute top-2 right-2 bg-gold-500 rounded-full p-1">
                        <CheckCircle2 className="h-5 w-5 text-slate-900" />
                      </div>
                    )}
                    <div className="p-3 bg-slate-800/90">
                      <p className="text-sm text-marble-100 font-medium">
                        Option {index + 1}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {(!memorial.cenotaph_design?.options || memorial.cenotaph_design.options.length === 0) && (
                <div className="text-center py-8 text-slate-400">
                  No designs available. Please go back and generate designs.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </WizardLayout>
  )
}
