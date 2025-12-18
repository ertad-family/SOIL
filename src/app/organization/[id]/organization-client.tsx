'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SwitchWithLabel } from '@/components/ui/switch'
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Plus,
  CheckCircle2,
  Landmark,
  Eye,
  Heart,
  ChevronRight,
  Settings,
  Trash2,
  Pencil,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  Mail,
  Clock,
  XCircle,
  Send,
  Loader2,
} from 'lucide-react'
import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
} from '@/types/interview'
import { MODULES } from '@/types/interview'

interface OrganizationData {
  id: string
  slug: string
  name: string
  organization_type: OrganizationType | null
  business_model: string | null
  industry: string | null
  description: string | null
  location_country: string | null
  location_city: string | null
  founded_date: string | null
  closed_date: string | null
  stage_at_closure: LifecycleStage | null
  peak_team_size: number | null
  verification_status: VerificationStatus
  verification_count: number
  is_public: boolean
  created_by: string
  created_at: string
  updated_at: string
}

interface StoryData {
  id: string
  user_id: string
  status: StoryStatus
  current_module: ModuleId
  completed_modules: ModuleId[]
  coined_at: string | null
  created_at: string
  updated_at: string
  profile: {
    display_name: string | null
  } | null
}

interface MemorialData {
  id: string
  slug: string
  epitaph: string | null
  tombstone_style: string
  tombstone_color: string
  views_count: number
  respects_count: number
}

type VerificationRelationship = 'colleague' | 'customer' | 'supplier' | 'partner' | 'investor' | 'other'
type VerificationRequestStatus = 'pending' | 'confirmed' | 'declined' | 'expired'

interface VerificationRequest {
  id: string
  verifier_email: string
  verifier_name: string | null
  relationship: VerificationRelationship
  status: VerificationRequestStatus
  created_at: string
  expires_at: string
  responded_at: string | null
}

const RELATIONSHIP_LABELS: Record<VerificationRelationship, string> = {
  colleague: 'Ex-Colleague',
  customer: 'Ex-Customer',
  supplier: 'Ex-Supplier',
  partner: 'Ex-Partner',
  investor: 'Ex-Investor',
  other: 'Other',
}

interface OrganizationClientProps {
  organization: OrganizationData
  stories: StoryData[]
  memorial: MemorialData | null
  currentUserId: string
  isOwner: boolean
}

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  tech_product: 'Tech Product',
  services: 'Services',
  ecommerce: 'E-commerce',
  manufacturing: 'Manufacturing',
  ngo: 'NGO',
  media: 'Media',
}

const STAGE_LABELS: Record<LifecycleStage, string> = {
  formation: 'Formation',
  establishment: 'Establishment',
  growth: 'Growth',
  maturity: 'Maturity',
}

export function OrganizationClient({
  organization,
  stories,
  memorial,
  currentUserId,
  isOwner,
}: OrganizationClientProps) {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(organization.is_public)
  const [isSaving, setIsSaving] = useState(false)

  // Verification state
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false)

  // Fetch verification requests
  const fetchVerificationRequests = useCallback(async () => {
    if (!isOwner) return

    setIsLoadingRequests(true)
    try {
      const res = await fetch(`/api/verification/request?organizationId=${organization.id}`)
      if (res.ok) {
        const data = await res.json()
        setVerificationRequests(data.requests || [])
      }
    } catch (err) {
      console.error('Failed to fetch verification requests:', err)
    } finally {
      setIsLoadingRequests(false)
    }
  }, [organization.id, isOwner])

  useEffect(() => {
    fetchVerificationRequests()
  }, [fetchVerificationRequests])

  // Calculate verification progress
  const confirmedCount = verificationRequests.filter(r => r.status === 'confirmed').length
  const pendingCount = verificationRequests.filter(r => r.status === 'pending').length

  // My story (if I have one)
  const myStory = stories.find(s => s.user_id === currentUserId)
  const otherStories = stories.filter(s => s.user_id !== currentUserId)

  // Format dates
  const formatDate = (date: string | null) => {
    if (!date) return null
    return date.replace('-', '.')
  }

  const lifespan = organization.founded_date && organization.closed_date
    ? `${formatDate(organization.founded_date)} — ${formatDate(organization.closed_date)}`
    : null

  const location = [organization.location_city, organization.location_country]
    .filter(Boolean)
    .join(', ')

  // Toggle visibility via API
  const handleVisibilityChange = async (checked: boolean) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/organization/${organization.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: checked }),
      })

      if (!res.ok) {
        throw new Error('Failed to update visibility')
      }

      setIsPublic(checked)
    } catch (err) {
      console.error('Failed to update visibility:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete organization via API
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/organization/${organization.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete organization')
      }

      router.push('/account')
    } catch (err) {
      console.error('Failed to delete organization:', err)
      alert('Failed to delete organization')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout
      variant="dark"
      pageTitle={organization.name}
      pageDescription="Organization profile"
      pageActions={
        <a href="/account">
          <Button variant="dark-ghost" size="sm">
            ← Back to Account
          </Button>
        </a>
      }
    >
      {/* Main Content: Info + Cenotaph Avatar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Organization Info (Left Columns) */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
          {/* General Information Card */}
          <Card variant="dark">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle variant="dark">General Information</CardTitle>
                  {organization.description && (
                    <CardDescription variant="dark" className="mt-2">
                      {organization.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isPublic && (
                    <Badge variant="dark-outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Organization Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {organization.organization_type && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-4 h-4" />
                    <span>{ORG_TYPE_LABELS[organization.organization_type]}</span>
                  </div>
                )}
                {lifespan && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{lifespan}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {organization.peak_team_size && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>Peak team: {organization.peak_team_size}</span>
                  </div>
                )}
                {organization.industry && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">Industry:</span>
                    <span>{organization.industry}</span>
                  </div>
                )}
                {organization.stage_at_closure && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">Stage at closure:</span>
                    <span>{STAGE_LABELS[organization.stage_at_closure]}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Card */}
          <Card variant="dark">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {organization.verification_status === 'verified' ? (
                    <ShieldCheck className="w-5 h-5 text-gold-400" />
                  ) : organization.verification_status === 'pending' ? (
                    <ShieldQuestion className="w-5 h-5 text-gold-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-slate-500" />
                  )}
                  <CardTitle variant="dark" className="text-base">Verification</CardTitle>
                </div>
                <Badge
                  variant={
                    organization.verification_status === 'verified'
                      ? 'dark-verified'
                      : organization.verification_status === 'pending'
                      ? 'dark-warning'
                      : 'dark-error'
                  }
                  size="sm"
                >
                  {organization.verification_status === 'verified' && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  {confirmedCount}/3 verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        confirmedCount >= 3 ? 'bg-gold-500' : 'bg-gold-500/60'
                      }`}
                      style={{ width: `${Math.min((confirmedCount / 3) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {confirmedCount >= 3
                    ? 'Organization verified!'
                    : `${3 - confirmedCount} more confirmation${3 - confirmedCount !== 1 ? 's' : ''} needed`}
                  {pendingCount > 0 && ` (${pendingCount} pending)`}
                </p>
              </div>

              {/* Verification steps */}
              {isOwner && organization.verification_status !== 'verified' && (
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    How to verify
                  </h4>
                  <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                    <li>Invite ex-colleagues, customers, or partners</li>
                    <li>They confirm the organization existed</li>
                    <li>After 3 confirmations, you&apos;re verified</li>
                  </ol>
                  <Button
                    variant="dark-primary"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => setShowVerificationForm(true)}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Invite Verifiers
                  </Button>
                </div>
              )}

              {/* Verification requests list */}
              {isOwner && verificationRequests.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Verification Requests
                  </h4>
                  {isLoadingRequests ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {verificationRequests.map((request) => (
                        <VerificationRequestItem key={request.id} request={request} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Form Modal */}
          {showVerificationForm && (
            <VerificationFormModal
              organizationId={organization.id}
              organizationName={organization.name}
              onClose={() => setShowVerificationForm(false)}
              onSuccess={() => {
                setShowVerificationForm(false)
                fetchVerificationRequests()
              }}
            />
          )}
        </div>

        {/* Cenotaph Avatar (Right Column) */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <CenotaphAvatar
            memorial={memorial}
            organizationId={organization.id}
            isOwner={isOwner}
          />
        </div>
      </div>

      {/* Stories/Perspectives Section */}
      <Card variant="dark" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle variant="dark">Perspectives</CardTitle>
              <CardDescription variant="dark">
                Stories told about this organization
              </CardDescription>
            </div>
            {isOwner && !myStory && (
              <a href={`/interview?org=${organization.id}`}>
                <Button variant="dark-primary" size="sm" rightIcon={<Plus className="w-4 h-4" />}>
                  Add Your Story
                </Button>
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No stories yet</p>
              {isOwner && (
                <a href={`/interview?org=${organization.id}`}>
                  <Button variant="dark-primary" rightIcon={<Plus className="w-4 h-4" />}>
                    Share Your Story
                  </Button>
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* My Story First */}
              {myStory && (
                <StoryCard
                  story={myStory}
                  isOwn={true}
                  authorName="You"
                />
              )}
              {/* Other Stories */}
              {otherStories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isOwn={false}
                  authorName={story.profile?.display_name || 'Anonymous'}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Section (Owner Only) */}
      {isOwner && (
        <Card variant="dark">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <CardTitle variant="dark">Settings</CardTitle>
                <CardDescription variant="dark">
                  Manage this organization
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Visibility Toggle */}
              <SwitchWithLabel
                variant="dark"
                label="Public profile"
                description="Allow others to see this organization's profile and cenotaph"
                checked={isPublic}
                onCheckedChange={handleVisibilityChange}
                disabled={isSaving}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Button
                  variant="dark-ghost"
                  size="sm"
                  leftIcon={<Pencil className="w-4 h-4" />}
                  disabled
                >
                  Edit Details
                </Button>
                <Button
                  variant="dark-ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-error-400 hover:text-error-300"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  Delete Organization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

// Roman marble frame styles
const marbleFrameStyles = `
  relative
  aspect-[3/4]
  rounded-sm
  bg-gradient-to-b from-marble-100 via-marble-200 to-marble-300
  p-[3px]
  shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)]
  before:absolute before:inset-[3px] before:rounded-sm
  before:border before:border-marble-400/30
  before:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
`

const marbleFrameEmptyStyles = `
  relative
  aspect-[3/4]
  rounded-sm
  bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900
  p-[3px]
  shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
  border border-dashed border-slate-600
`

// Cenotaph Avatar Component
function CenotaphAvatar({
  memorial,
  organizationId,
  isOwner,
}: {
  memorial: MemorialData | null
  organizationId: string
  isOwner: boolean
}) {
  if (memorial) {
    return (
      <a href={`/memorials/${memorial.slug}`} className="block group">
        {/* Roman Marble Frame */}
        <div className={marbleFrameStyles}>
          {/* Inner content */}
          <div
            className="relative w-full h-full rounded-sm overflow-hidden transition-all"
            style={{ backgroundColor: memorial.tombstone_color || '#1e293b' }}
          >
            {/* Decorative corner ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold-400/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold-400/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold-400/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold-400/40" />

            {/* Tombstone Preview */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Landmark className="w-10 h-10 text-marble-300/80 mb-3" />
              <p className="text-marble-200 font-serif text-sm italic line-clamp-3 px-2">
                {memorial.epitaph || 'In memoriam'}
              </p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="dark-primary" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                View Cenotaph
              </Button>
            </div>

            {/* Stats */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {memorial.views_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {memorial.respects_count}
              </span>
            </div>
          </div>
        </div>
      </a>
    )
  }

  // No cenotaph - show invitation with Roman frame style
  return (
    <div className={marbleFrameEmptyStyles}>
      <div className="relative w-full h-full rounded-sm bg-slate-800/50 flex flex-col items-center justify-center p-6 text-center">
        {/* Decorative corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-slate-500/50" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-slate-500/50" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-slate-500/50" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-slate-500/50" />

        <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-3 border border-slate-600">
          <Landmark className="w-7 h-7 text-slate-500" />
        </div>
        <h3 className="font-display text-base text-marble-300 mb-2">
          No Cenotaph Yet
        </h3>
        <p className="text-slate-500 text-xs mb-4 px-2">
          Create a memorial to preserve this legacy
        </p>
        {isOwner && (
          <a href={`/create?org=${organizationId}`}>
            <Button variant="dark-primary" size="sm" rightIcon={<Plus className="w-4 h-4" />}>
              Create Cenotaph
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

// Story Card Component
function StoryCard({
  story,
  isOwn,
  authorName,
}: {
  story: StoryData
  isOwn: boolean
  authorName: string
}) {
  const progress = Math.round((story.completed_modules.length / MODULES.length) * 100)
  const isCoined = story.status === 'coined'

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-marble-200">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-marble-100 font-medium">
              {authorName}
              {isOwn && <span className="text-slate-500 ml-2">(you)</span>}
            </p>
            <div className="flex items-center gap-2">
              {isCoined ? (
                <Badge variant="dark-success" size="sm">
                  Coined
                </Badge>
              ) : (
                <Badge variant="dark-outline" size="sm">
                  {progress}% complete
                </Badge>
              )}
              {story.coined_at && (
                <span className="text-xs text-slate-500">
                  {new Date(story.coined_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwn && (
          <a href={`/interview/${story.id}`}>
            <Button variant="dark-ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              {isCoined ? 'View' : 'Continue'}
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

// Verification Request Item Component
function VerificationRequestItem({ request }: { request: VerificationRequest }) {
  const statusIcons = {
    pending: <Clock className="w-3.5 h-3.5 text-gold-400" />,
    confirmed: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
    declined: <XCircle className="w-3.5 h-3.5 text-red-400" />,
    expired: <Clock className="w-3.5 h-3.5 text-slate-500" />,
  }

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    declined: 'Declined',
    expired: 'Expired',
  }

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-800/50 text-xs">
      <div className="flex items-center gap-2 min-w-0">
        <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span className="text-slate-300 truncate">
          {request.verifier_name || request.verifier_email}
        </span>
        <span className="text-slate-500 flex-shrink-0">
          ({RELATIONSHIP_LABELS[request.relationship]})
        </span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {statusIcons[request.status]}
        <span className={`${
          request.status === 'confirmed' ? 'text-green-400' :
          request.status === 'declined' ? 'text-red-400' :
          request.status === 'pending' ? 'text-gold-400' :
          'text-slate-500'
        }`}>
          {statusLabels[request.status]}
        </span>
      </div>
    </div>
  )
}

// Verification Form Modal Component
function VerificationFormModal({
  organizationId,
  organizationName,
  onClose,
  onSuccess,
}: {
  organizationId: string
  organizationName: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [contacts, setContacts] = useState<Array<{
    email: string
    name: string
    relationship: VerificationRelationship
  }>>([{ email: '', name: '', relationship: 'colleague' }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addContact = () => {
    if (contacts.length < 10) {
      setContacts([...contacts, { email: '', name: '', relationship: 'colleague' }])
    }
  }

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index))
    }
  }

  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setContacts(newContacts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate
    const validContacts = contacts.filter(c => c.email.trim())
    if (validContacts.length === 0) {
      setError('Please add at least one contact')
      return
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const contact of validContacts) {
      if (!emailRegex.test(contact.email)) {
        setError(`Invalid email format: ${contact.email}`)
        return
      }
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/verification/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          contacts: validContacts.map(c => ({
            email: c.email.trim(),
            name: c.name.trim() || undefined,
            relationship: c.relationship,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send verification requests')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send requests')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">
              Invite Verifiers
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Invite people who can confirm that <strong className="text-marble-200">{organizationName}</strong> existed.
            They will receive an email with a verification link.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-4">
              {contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="email"
                      placeholder="Email *"
                      value={contact.email}
                      onChange={(e) => updateContact(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Name (optional)"
                        value={contact.name}
                        onChange={(e) => updateContact(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                      />
                      <select
                        value={contact.relationship}
                        onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                      >
                        <option value="colleague">Ex-Colleague</option>
                        <option value="customer">Ex-Customer</option>
                        <option value="supplier">Ex-Supplier</option>
                        <option value="partner">Ex-Partner</option>
                        <option value="investor">Ex-Investor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {contacts.length < 10 && (
              <button
                type="button"
                onClick={addContact}
                className="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 mb-4"
              >
                <Plus className="w-4 h-4" />
                Add another contact
              </button>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              >
                {isSubmitting ? 'Sending...' : 'Send Invitations'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
