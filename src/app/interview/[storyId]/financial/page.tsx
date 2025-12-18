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
  DollarSign,
  Upload,
  FileText,
  X,
  Check,
} from 'lucide-react'
import type {
  FinancialEvent,
  FinancialEventCategory,
  UploadedFile,
  ImpactSeverity,
} from '@/types/interview'

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  { id: 'events', label: 'Financial Events', description: 'Significant financial moments' },
  { id: 'documents', label: 'Documents', description: 'Upload supporting documents (optional)' },
]

// =============================================================================
// CONSTANTS
// =============================================================================

const EVENT_CATEGORIES: Array<{ value: FinancialEventCategory; label: string; description: string }> = [
  { value: 'funding', label: 'Funding', description: 'Investment rounds, loans, grants' },
  { value: 'revenue', label: 'Revenue', description: 'Revenue milestones, contracts' },
  { value: 'cash', label: 'Cash', description: 'Cash flow and runway events' },
  { value: 'costs', label: 'Costs', description: 'Major expenses, cost cutting' },
  { value: 'profitability', label: 'Profitability', description: 'Profit/loss milestones' },
]

const EVENT_SUBTYPES: Record<FinancialEventCategory, string[]> = {
  funding: ['Seed round', 'Series A', 'Series B+', 'Angel investment', 'Loan', 'Grant', 'Revenue-based financing', 'Failed to close', 'Other'],
  revenue: ['First revenue', 'Major contract', 'Lost major customer', 'Revenue milestone', 'Recurring revenue achieved', 'Other'],
  cash: ['Extended runway', 'Runway shortened', 'Reached critical low', 'Cash crisis', 'Other'],
  costs: ['Major hire/expense', 'Cost cutting round', 'Office/infrastructure', 'Unexpected expense', 'Other'],
  profitability: ['First profit', 'Break even', 'Return to loss', 'Margin improvement', 'Other'],
}

const SEVERITY_OPTIONS: Array<{ value: ImpactSeverity; label: string }> = [
  { value: 'minor', label: 'Minor - We adapted' },
  { value: 'significant', label: 'Significant - Changed our trajectory' },
  { value: 'critical', label: 'Critical - Existential threat' },
]

const LOOKING_BACK_OPTIONS: Array<{ value: NonNullable<FinancialEvent['lookingBack']>; label: string }> = [
  { value: 'caught_in_time', label: 'We caught this in time' },
  { value: 'too_late', label: 'We realized too late' },
  { value: 'nothing_could_do', label: 'Nothing we could do' },
  { value: 'made_worse', label: 'We made it worse' },
]

// =============================================================================
// HELPER: Create empty event
// =============================================================================

function createEmptyEvent(): FinancialEvent {
  return {
    id: crypto.randomUUID(),
    date: '',
    category: 'funding',
    subType: '',
    severity: null,
    responses: [],
    lookingBack: null,
    details: null,
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FinancialPage() {
  const router = useRouter()
  const {
    story,
    isLoading,
    updateFinancialPicture,
    completeModule,
  } = useInterview()

  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null)

  // Get data from story
  const events = story?.financialPicture.events ?? []
  const uploadedFiles = story?.financialPicture.uploadedFiles ?? []

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const addEvent = () => {
    if (!story) return
    const newEvent = createEmptyEvent()
    updateFinancialPicture({ events: [...events, newEvent] })
    setExpandedEventId(newEvent.id)
  }

  const updateEvent = (eventId: string, updates: Partial<FinancialEvent>) => {
    if (!story) return
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, ...updates } : e
    )
    updateFinancialPicture({ events: updatedEvents })
  }

  const removeEvent = (eventId: string) => {
    if (!story) return
    updateFinancialPicture({ events: events.filter(e => e.id !== eventId) })
    if (expandedEventId === eventId) {
      setExpandedEventId(null)
    }
  }

  // ==========================================================================
  // FILE HANDLERS (simplified for MVP - actual upload will be implemented later)
  // ==========================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!story || !e.target.files) return

    const files = Array.from(e.target.files)
    const newFiles: UploadedFile[] = files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      storagePath: '', // Will be set after actual upload
    }))

    // For MVP, just store the file metadata
    // Actual upload to Supabase Storage will be implemented later
    updateFinancialPicture({ uploadedFiles: [...uploadedFiles, ...newFiles] })

    // Reset the input
    e.target.value = ''
  }

  const removeFile = (fileId: string) => {
    if (!story) return
    updateFinancialPicture({ uploadedFiles: uploadedFiles.filter(f => f.id !== fileId) })
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
        await completeModule('financial')
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

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // ==========================================================================
  // STEP 1: EVENTS
  // ==========================================================================

  const renderEvents = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Add significant financial events during your organization&apos;s life.
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
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-marble-100">
                    {event.date || 'No date'} - {event.subType || categoryInfo?.label || 'New Event'}
                    {event.severity && ` (${event.severity})`}
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
                <div className="p-4 space-y-4 bg-slate-800/50">
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
                          category: e.target.value as FinancialEventCategory,
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

                  <FormField variant="dark" label="How severe was this event?" htmlFor={`severity-${event.id}`}>
                    <div className="flex flex-wrap gap-2">
                      {SEVERITY_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          onClick={() => updateEvent(event.id, { severity: option.value })}
                          className={cn(
                            'px-3 py-1.5 rounded text-sm transition-colors',
                            event.severity === option.value
                              ? 'bg-gold-500 text-slate-900'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
                          onClick={() => updateEvent(event.id, { lookingBack: option.value as FinancialEvent['lookingBack'] })}
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

                  <FormField variant="dark" label="Details" htmlFor={`details-${event.id}`} hint="Optional">
                    <Textarea
                      variant="dark"
                      id={`details-${event.id}`}
                      value={event.details || ''}
                      onChange={(e) => updateEvent(event.id, { details: e.target.value || null })}
                      placeholder="Any additional context..."
                      rows={3}
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
            <p className="text-slate-400 mb-4">No financial events added yet</p>
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
        Add Financial Event
      </Button>
    </div>
  )

  // ==========================================================================
  // STEP 3: DOCUMENTS
  // ==========================================================================

  const renderDocuments = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        If you have financial documents you&apos;d like to include (P&amp;L, cap table, etc.), you can upload them here. This is optional and all documents are kept confidential.
      </p>

      {/* Upload area */}
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-400 mb-2">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Supported formats: PDF, CSV, XLS, XLSX (max 10MB each)
        </p>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.csv,.xls,.xlsx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="dark-secondary" asChild>
            <span>Select Files</span>
          </Button>
        </label>
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">Uploaded Files</h3>
          {uploadedFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-md"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-marble-100">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-slate-500 hover:text-error-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Privacy note */}
      <div className="p-4 bg-gold-900/30 border border-gold-700 rounded-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-gold-400">Privacy note:</strong> All financial documents are encrypted and stored securely.
          They will only be used for research purposes and will never be shared publicly
          without your explicit consent.
        </p>
      </div>
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
      title="Financial Picture"
      subtitle="Your organization&apos;s financial journey"
    >
      {currentStep === 0 && renderEvents()}
      {currentStep === 1 && renderDocuments()}
    </WizardLayout>
  )
}
