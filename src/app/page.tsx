'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox, CheckboxWithLabel } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress, CircularProgress } from '@/components/ui/progress'
import { Switch, SwitchWithLabel } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel } from '@/components/ui/radio-group'
import { Spinner, DotsSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Combobox } from '@/components/ui/combobox'
import { SectionLabel } from '@/components/ui/section-label'
import { RomanNumeral, PositionedRomanNumeral } from '@/components/ui/roman-numeral'
import { FeatureCard, FeatureCardGrid } from '@/components/ui/feature-card'
import { Search, Mail, ArrowRight, Check, Bell, Settings, User, Layers, Zap, Shield, Globe } from 'lucide-react'

// Sample data for combobox
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'be', label: 'Belgium' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'at', label: 'Austria' },
  { value: 'se', label: 'Sweden' },
  { value: 'no', label: 'Norway' },
  { value: 'dk', label: 'Denmark' },
  { value: 'fi', label: 'Finland' },
  { value: 'pl', label: 'Poland' },
  { value: 'cz', label: 'Czech Republic' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ie', label: 'Ireland' },
]

const roles = [
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'cofounder', label: 'Co-Founder' },
  { value: 'executive', label: 'Executive (C-Suite)' },
  { value: 'director', label: 'Director' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'advisor', label: 'Advisor / Board Member' },
  { value: 'investor', label: 'Investor' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'other', label: 'Other' },
]

export default function DesignSystemDemo() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [progressValue, setProgressValue] = useState(65)
  const { toast } = useToast()

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Toaster />
      <div className="min-h-screen bg-marble-50 dark:bg-slate-900 text-marble-950 dark:text-marble-100 transition-colors">
        {/* Header - Glassmorphic with subtle blur */}
        <header className="sticky top-0 z-50 border-b border-marble-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
          <div className="max-w-content mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-semibold tracking-wider animate-fade-in-up">
                S<span className="text-gold-500">·</span>O<span className="text-gold-500">·</span>I<span className="text-gold-500">·</span>L
              </h1>
              <div className="flex items-center gap-4 animate-fade-in-up stagger-1">
                <span className="text-sm text-marble-600 dark:text-slate-400 font-ui uppercase tracking-wide">Theme:</span>
                <Button
                  variant={isDarkMode ? 'dark-secondary' : 'light-secondary'}
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? 'Dark (Scientific)' : 'Light (Cenotaphery)'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-content mx-auto px-6 py-12 space-y-20">
          {/* Hero - Dramatic with atmospheric glow */}
          <section className="relative text-center py-16 overflow-hidden">
            {/* Background glow effect */}
            <div className="hero-glow"></div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="font-serif text-6xl md:text-7xl font-semibold tracking-wider mb-6 animate-fade-in-up">
                <span className="text-gradient-gold">Roman Heritage</span>
                <br />
                <span className="text-marble-950 dark:text-marble-100">Design System</span>
              </h2>
              <p className="text-xl text-marble-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-1">
                Ancient elegance meets modern functionality. A design system inspired by
                Roman aesthetics — marble textures, classical typography, and gold accents.
              </p>
              <div className="flex justify-center gap-4 mt-8 animate-fade-in-up stagger-2">
                <Button variant={isDarkMode ? 'dark-primary' : 'light-primary'} size="lg">
                  Explore Components
                </Button>
                <Button variant={isDarkMode ? 'dark-secondary' : 'light-secondary'} size="lg">
                  View Source
                </Button>
              </div>
            </div>

            {/* Decorative element */}
            <div className="divider-roman mt-12 animate-fade-in-up stagger-3">
              <span className="text-gold-500 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
            </div>
          </section>

          {/* Colors */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Color Palette
            </h2>

            <div className="space-y-8">
              {/* Marble - explicit classes for Tailwind JIT */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">
                  Marble (Primary)
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-50 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">50</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-100 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">100</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-200 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">200</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-300 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">300</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-400 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">400</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-500 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">500</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-600 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">600</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-700 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">700</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-800 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">800</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-900 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">900</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-950 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">950</span>
                  </div>
                </div>
              </div>

              {/* Gold - explicit classes for Tailwind JIT */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">
                  Gold (Accent)
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-50 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">50</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-100 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">100</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-200 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">200</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-300 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">300</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-400 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">400</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-500 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">500</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-600 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">600</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-700 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">700</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-800 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">800</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-900 border border-marble-300 dark:border-slate-600" />
                    <span className="text-xs text-marble-500 mt-1 block">900</span>
                  </div>
                </div>
              </div>

              {/* Semantic */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">
                  Semantic
                </h3>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-success-500" />
                    <span className="text-xs text-marble-500 mt-1 block">Success</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-warning-500" />
                    <span className="text-xs text-marble-500 mt-1 block">Warning</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-error-500" />
                    <span className="text-xs text-marble-500 mt-1 block">Error</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-info-500" />
                    <span className="text-xs text-marble-500 mt-1 block">Info</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Typography
            </h2>
            <div className="space-y-4">
              <div className="font-serif text-display font-semibold tracking-wide">Display (Cinzel)</div>
              <div className="font-serif text-5xl font-semibold tracking-wide">Heading 1</div>
              <div className="font-serif text-4xl font-semibold tracking-wide">Heading 2</div>
              <div className="font-serif text-3xl font-medium tracking-wide">Heading 3</div>
              <div className="font-serif text-2xl font-medium tracking-wide">Heading 4</div>
              <div className="text-xl">Body XL (Source Sans 3)</div>
              <div className="text-lg">Body Large</div>
              <div className="text-base">Body Base - The quick brown fox jumps over the lazy dog.</div>
              <div className="text-sm text-marble-600 dark:text-slate-400">Body Small</div>
              <div className="text-xs text-marble-500 dark:text-slate-500">Caption</div>
            </div>
          </section>

          {/* Buttons */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Buttons
            </h2>

            <div className="space-y-8">
              {/* Light mode variants (new marble style) */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  Light Mode Variants (Marble)
                </h3>
                <div className="flex flex-wrap gap-4 p-6 bg-marble-100 rounded-md">
                  <Button variant="light-primary">Primary</Button>
                  <Button variant="light-secondary">Secondary</Button>
                </div>
              </div>

              {/* Dark mode variants */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  Dark Mode Variants
                </h3>
                <div className="flex flex-wrap gap-4 p-6 bg-slate-800 rounded-md">
                  <Button variant="dark-primary">Primary</Button>
                  <Button variant="dark-secondary">Secondary</Button>
                  <Button variant="dark-ghost">Ghost</Button>
                  <Button variant="dark-outline">Outline</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  Sizes
                </h3>
                <div className="flex flex-wrap items-center gap-4 p-6 bg-marble-100 rounded-md">
                  <Button variant="light-primary" size="sm">Small</Button>
                  <Button variant="light-primary" size="md">Medium</Button>
                  <Button variant="light-primary" size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  States
                </h3>
                <div className="flex flex-wrap items-center gap-4 p-6 bg-marble-100 rounded-md">
                  <Button variant="light-primary" isLoading>Loading</Button>
                  <Button variant="light-primary" disabled>Disabled</Button>
                  <Button variant="light-primary" rightIcon={<ArrowRight className="h-4 w-4" />}>With Icon</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Form Inputs */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Form Inputs
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Light mode inputs */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Light Theme Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Text Input</Label>
                    <Input placeholder="Enter text..." variant={isDarkMode ? 'dark' : 'default'} />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>With Icon</Label>
                    <Input
                      placeholder="Search..."
                      leftIcon={<Search className="h-4 w-4" />}
                      variant={isDarkMode ? 'dark' : 'default'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'} required>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      leftIcon={<Mail className="h-4 w-4" />}
                      variant={isDarkMode ? 'dark' : 'default'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Error State</Label>
                    <Input placeholder="Error input" error variant={isDarkMode ? 'dark' : 'default'} />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Textarea</Label>
                    <Textarea
                      placeholder="Write something..."
                      showCount
                      maxLength={500}
                      variant={isDarkMode ? 'dark' : 'default'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Select</Label>
                    <Select>
                      <SelectTrigger variant={isDarkMode ? 'dark' : 'default'}>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent variant={isDarkMode ? 'dark' : 'default'}>
                        <SelectItem value="opt1" variant={isDarkMode ? 'dark' : 'default'}>Option 1</SelectItem>
                        <SelectItem value="opt2" variant={isDarkMode ? 'dark' : 'default'}>Option 2</SelectItem>
                        <SelectItem value="opt3" variant={isDarkMode ? 'dark' : 'default'}>Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Checkboxes */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Selection Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CheckboxWithLabel
                    label="Default checkbox"
                    description="With a description"
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <CheckboxWithLabel
                    label="Checked"
                    checked={true}
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <CheckboxWithLabel
                    label="Indeterminate"
                    indeterminate
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <CheckboxWithLabel
                    label="Disabled"
                    disabled
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Badges */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Badges
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">
                  {isDarkMode ? 'Dark Mode Variants' : 'Light Mode Variants'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant={isDarkMode ? 'dark' : 'default'}>Default</Badge>
                  <Badge variant={isDarkMode ? 'dark-gold' : 'gold'}>Gold</Badge>
                  <Badge variant={isDarkMode ? 'dark-success' : 'success'}>Success</Badge>
                  <Badge variant={isDarkMode ? 'dark-warning' : 'warning'}>Warning</Badge>
                  <Badge variant={isDarkMode ? 'dark-error' : 'error'}>Error</Badge>
                  <Badge variant={isDarkMode ? 'dark-info' : 'info'}>Info</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">Solid Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant={isDarkMode ? 'dark-solid-gold' : 'solid-gold'}>Solid Gold</Badge>
                  <Badge variant="solid-success">Solid Success</Badge>
                  <Badge variant="solid-error">Solid Error</Badge>
                  <Badge variant="verified">Verified</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={isDarkMode ? 'dark' : 'default'} size="sm">Small</Badge>
                  <Badge variant={isDarkMode ? 'dark' : 'default'} size="md">Medium</Badge>
                  <Badge variant={isDarkMode ? 'dark' : 'default'} size="lg">Large</Badge>
                  <Badge variant={isDarkMode ? 'dark-gold' : 'gold'} dot>With Dot</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Cards
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Default Card</CardTitle>
                  <CardDescription variant={isDarkMode ? 'dark' : undefined}>
                    Card description goes here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-marble-600 dark:text-slate-400">Card content area</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant={isDarkMode ? 'dark-primary' : 'light-primary'}>Action</Button>
                </CardFooter>
              </Card>

              <Card variant={isDarkMode ? 'dark-elevated' : 'elevated'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Elevated Card</CardTitle>
                  <CardDescription variant={isDarkMode ? 'dark' : undefined}>
                    With shadow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-marble-600 dark:text-slate-400">More prominent</p>
                </CardContent>
              </Card>

              <Card variant={isDarkMode ? 'dark-cenotaph' : 'cenotaph'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Cenotaph Card</CardTitle>
                  <CardDescription variant={isDarkMode ? 'dark' : undefined}>With gold accent border</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-marble-600 dark:text-slate-400">Special memorial styling</p>
                </CardContent>
              </Card>

              <Card variant={isDarkMode ? 'dark' : 'default'} interactive>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Interactive</CardTitle>
                  <CardDescription variant={isDarkMode ? 'dark' : undefined}>Hover me</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-marble-600 dark:text-slate-400">Clickable card</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dialog */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Dialog / Modal
            </h2>

            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={isDarkMode ? 'dark-primary' : 'light-primary'}>Open Light Dialog</Button>
                </DialogTrigger>
                <DialogContent variant="default">
                  <DialogHeader>
                    <DialogTitle variant="default">Dialog Title</DialogTitle>
                    <DialogDescription variant="default">
                      This is a dialog description with Roman heritage styling.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-marble-600">Dialog content goes here.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="light-secondary">Cancel</Button>
                    <Button variant="light-primary">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={isDarkMode ? 'dark-secondary' : 'light-secondary'}>Open Dark Dialog</Button>
                </DialogTrigger>
                <DialogContent variant="dark">
                  <DialogHeader>
                    <DialogTitle variant="dark">Dark Dialog</DialogTitle>
                    <DialogDescription variant="dark">
                      This is the dark mode variant for SOIL Scientific.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-slate-400">Dialog content goes here.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="dark-secondary">Cancel</Button>
                    <Button variant="dark-primary">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          {/* Tabs */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Tabs
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Light Tabs */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Light Mode Tabs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="tab1">
                    <TabsList variant="default">
                      <TabsTrigger value="tab1" variant="default">Account</TabsTrigger>
                      <TabsTrigger value="tab2" variant="default">Security</TabsTrigger>
                      <TabsTrigger value="tab3" variant="default">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" variant="default">
                      <p className="text-marble-600">Manage your account settings and preferences.</p>
                    </TabsContent>
                    <TabsContent value="tab2" variant="default">
                      <p className="text-marble-600">Configure security and privacy options.</p>
                    </TabsContent>
                    <TabsContent value="tab3" variant="default">
                      <p className="text-marble-600">Set up your notification preferences.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Dark Tabs */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Dark Mode Tabs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="tab1">
                    <TabsList variant="dark">
                      <TabsTrigger value="tab1" variant="dark">Account</TabsTrigger>
                      <TabsTrigger value="tab2" variant="dark">Security</TabsTrigger>
                      <TabsTrigger value="tab3" variant="dark">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" variant="dark">
                      <p className="text-slate-400">Manage your account settings and preferences.</p>
                    </TabsContent>
                    <TabsContent value="tab2" variant="dark">
                      <p className="text-slate-400">Configure security and privacy options.</p>
                    </TabsContent>
                    <TabsContent value="tab3" variant="dark">
                      <p className="text-slate-400">Set up your notification preferences.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Select / Dropdown */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Select / Dropdown
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Light Select */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Light Mode Select</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Organization Type</Label>
                    <Select>
                      <SelectTrigger variant="default">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent variant="default">
                        <SelectItem value="startup" variant="default">Startup</SelectItem>
                        <SelectItem value="scaleup" variant="default">Scale-up</SelectItem>
                        <SelectItem value="enterprise" variant="default">Enterprise</SelectItem>
                        <SelectItem value="nonprofit" variant="default">Non-profit</SelectItem>
                        <SelectItem value="government" variant="default">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Industry</Label>
                    <Select defaultValue="tech">
                      <SelectTrigger variant="default">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent variant="default">
                        <SelectItem value="tech" variant="default">Technology</SelectItem>
                        <SelectItem value="finance" variant="default">Finance</SelectItem>
                        <SelectItem value="healthcare" variant="default">Healthcare</SelectItem>
                        <SelectItem value="retail" variant="default">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Dark Select */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Dark Mode Select</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant="dark">Organization Type</Label>
                    <Select>
                      <SelectTrigger variant="dark">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent variant="dark">
                        <SelectItem value="startup" variant="dark">Startup</SelectItem>
                        <SelectItem value="scaleup" variant="dark">Scale-up</SelectItem>
                        <SelectItem value="enterprise" variant="dark">Enterprise</SelectItem>
                        <SelectItem value="nonprofit" variant="dark">Non-profit</SelectItem>
                        <SelectItem value="government" variant="dark">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Industry</Label>
                    <Select defaultValue="tech">
                      <SelectTrigger variant="dark">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent variant="dark">
                        <SelectItem value="tech" variant="dark">Technology</SelectItem>
                        <SelectItem value="finance" variant="dark">Finance</SelectItem>
                        <SelectItem value="healthcare" variant="dark">Healthcare</SelectItem>
                        <SelectItem value="retail" variant="dark">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Searchable Combobox */}
            <h3 className="text-xl font-serif font-medium mt-12 mb-6 flex items-center gap-3">
              <span className="w-4 h-[2px] bg-gold-400"></span>
              Searchable Combobox
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Light Combobox */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Light Mode Combobox</CardTitle>
                  <CardDescription variant={isDarkMode ? 'dark' : undefined}>
                    Searchable dropdown with filtering
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Country</Label>
                    <Combobox
                      options={countries}
                      placeholder="Select country..."
                      searchPlaceholder="Search countries..."
                      emptyText="No country found."
                      variant="default"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Your Role</Label>
                    <Combobox
                      options={roles}
                      placeholder="Select your role..."
                      searchPlaceholder="Search roles..."
                      emptyText="No role found."
                      variant="default"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dark Combobox */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Dark Mode Combobox</CardTitle>
                  <CardDescription variant="dark">
                    Searchable dropdown with filtering
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant="dark">Country</Label>
                    <Combobox
                      options={countries}
                      placeholder="Select country..."
                      searchPlaceholder="Search countries..."
                      emptyText="No country found."
                      variant="dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Your Role</Label>
                    <Combobox
                      options={roles}
                      placeholder="Select your role..."
                      searchPlaceholder="Search roles..."
                      emptyText="No role found."
                      variant="dark"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Progress */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Progress
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Linear Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Default ({progressValue}%)</Label>
                    <Progress value={progressValue} variant={isDarkMode ? 'dark' : 'default'} />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>With Value Display</Label>
                    <Progress value={75} variant={isDarkMode ? 'dark' : 'default'} showValue />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Success</Label>
                    <Progress value={100} variant={isDarkMode ? 'dark' : 'default'} color="success" />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Warning</Label>
                    <Progress value={45} variant={isDarkMode ? 'dark' : 'default'} color="warning" />
                  </div>
                  <div className="space-y-2">
                    <Label variant={isDarkMode ? 'dark' : 'default'}>Error</Label>
                    <Progress value={20} variant={isDarkMode ? 'dark' : 'default'} color="error" />
                  </div>
                </CardContent>
              </Card>

              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Circular Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <CircularProgress size="sm" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">Small</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress size="md" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">Medium</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress size="lg" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">Large</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress size="md" value={75} variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">75%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Switch & Radio */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Switch & Radio
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Switches */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Switches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Switch variant={isDarkMode ? 'dark' : 'default'} size="sm" />
                    <span className="text-sm text-marble-600 dark:text-slate-400">Small</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch variant={isDarkMode ? 'dark' : 'default'} size="md" defaultChecked />
                    <span className="text-sm text-marble-600 dark:text-slate-400">Medium (checked)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch variant={isDarkMode ? 'dark' : 'default'} size="lg" />
                    <span className="text-sm text-marble-600 dark:text-slate-400">Large</span>
                  </div>
                  <SwitchWithLabel
                    label="Email notifications"
                    description="Receive updates via email"
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <SwitchWithLabel
                    label="Marketing emails"
                    description="Receive promotional content"
                    variant={isDarkMode ? 'dark' : 'default'}
                    defaultChecked
                  />
                </CardContent>
              </Card>

              {/* Radio Groups */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Radio Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup defaultValue="option1">
                    <RadioGroupItemWithLabel
                      value="option1"
                      label="Option 1"
                      description="First option description"
                      variant={isDarkMode ? 'dark' : 'default'}
                    />
                    <RadioGroupItemWithLabel
                      value="option2"
                      label="Option 2"
                      description="Second option description"
                      variant={isDarkMode ? 'dark' : 'default'}
                    />
                    <RadioGroupItemWithLabel
                      value="option3"
                      label="Option 3"
                      description="Third option description"
                      variant={isDarkMode ? 'dark' : 'default'}
                    />
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Spinners & Toast */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Spinners & Toast
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Spinners */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Spinners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Spinner size="xs" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">XS</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="sm" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">SM</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="md" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">MD</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="lg" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">LG</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="xl" variant={isDarkMode ? 'dark' : 'default'} />
                      <p className="text-xs text-marble-500 mt-2">XL</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-3">Dots Spinner</h4>
                    <div className="flex items-center gap-6">
                      <DotsSpinner size="sm" variant={isDarkMode ? 'dark' : 'default'} />
                      <DotsSpinner size="md" variant={isDarkMode ? 'dark' : 'default'} />
                      <DotsSpinner size="lg" variant={isDarkMode ? 'dark' : 'default'} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Toast */}
              <Card variant={isDarkMode ? 'dark' : 'default'}>
                <CardHeader>
                  <CardTitle variant={isDarkMode ? 'dark' : undefined}>Toast Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant={isDarkMode ? 'dark-primary' : 'light-primary'}
                    onClick={() => toast({
                      title: 'Success!',
                      description: 'Your action was completed successfully.',
                      variant: isDarkMode ? 'dark' : 'default',
                    })}
                  >
                    Show Default Toast
                  </Button>
                  <Button
                    variant={isDarkMode ? 'dark-secondary' : 'light-secondary'}
                    onClick={() => toast({
                      title: 'Warning',
                      description: 'Please review your input before continuing.',
                      variant: isDarkMode ? 'dark-warning' : 'warning',
                    })}
                  >
                    Show Warning Toast
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* New Components: Section Labels, Roman Numerals, Feature Cards */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              New Components
            </h2>

            <div className="space-y-12">
              {/* Section Labels */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  Bracketed Section Labels
                </h3>
                <div className="space-y-4 p-6 bg-marble-100 dark:bg-slate-800 rounded-md">
                  <div className="space-y-2">
                    <SectionLabel>how it works</SectionLabel>
                    <h3 className="font-serif text-2xl font-medium text-marble-950 dark:text-marble-100">
                      Building the Future
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>about soil</SectionLabel>
                    <h3 className="font-serif text-2xl font-medium text-marble-950 dark:text-marble-100">
                      Our Mission
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>step iii</SectionLabel>
                    <h3 className="font-serif text-2xl font-medium text-marble-950 dark:text-marble-100">
                      Financial Analysis
                    </h3>
                  </div>
                </div>
              </div>

              {/* Roman Numerals */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  Decorative Roman Numerals
                </h3>
                <div className="flex flex-wrap gap-8 items-end p-6 bg-marble-100 dark:bg-slate-800 rounded-md">
                  <div className="text-center">
                    <RomanNumeral value={1} size="sm" variant={isDarkMode ? 'dark' : 'default'} />
                    <p className="text-xs text-marble-500 mt-2">Small (I)</p>
                  </div>
                  <div className="text-center">
                    <RomanNumeral value={2} size="md" variant={isDarkMode ? 'dark' : 'default'} />
                    <p className="text-xs text-marble-500 mt-2">Medium (II)</p>
                  </div>
                  <div className="text-center">
                    <RomanNumeral value={3} size="lg" variant={isDarkMode ? 'dark' : 'default'} />
                    <p className="text-xs text-marble-500 mt-2">Large (III)</p>
                  </div>
                  <div className="text-center">
                    <RomanNumeral value={4} size="xl" variant={isDarkMode ? 'dark' : 'default'} />
                    <p className="text-xs text-marble-500 mt-2">XL (IV)</p>
                  </div>
                </div>
                {/* Example with positioned numeral */}
                <div className="relative mt-6 p-8 bg-marble-50 dark:bg-slate-900 rounded-md overflow-hidden border border-marble-200 dark:border-slate-700">
                  <PositionedRomanNumeral
                    value={5}
                    size="xl"
                    position="top-right"
                    variant={isDarkMode ? 'dark' : 'default'}
                    className="opacity-50 -mr-4 -mt-4"
                  />
                  <div className="relative z-10">
                    <SectionLabel>step v</SectionLabel>
                    <h3 className="font-serif text-2xl font-medium mt-2 text-marble-950 dark:text-marble-100">
                      Environmental Context
                    </h3>
                    <p className="text-marble-600 dark:text-slate-400 mt-2">
                      Roman numeral as background decoration for wizard steps
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">
                  Feature Cards
                </h3>
                <FeatureCardGrid columns={4}>
                  <FeatureCard
                    icon={<Layers className="w-8 h-8" />}
                    title="Data Collection"
                    description="Structured interviews capture organizational knowledge before it's lost."
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <FeatureCard
                    icon={<Zap className="w-8 h-8" />}
                    title="AI Analysis"
                    description="Advanced pattern recognition identifies common failure modes."
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <FeatureCard
                    icon={<Shield className="w-8 h-8" />}
                    title="Privacy First"
                    description="Your data remains private. Only share what you choose."
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                  <FeatureCard
                    icon={<Globe className="w-8 h-8" />}
                    title="Global Research"
                    description="Contributing to worldwide organizational science research."
                    variant={isDarkMode ? 'dark' : 'default'}
                  />
                </FeatureCardGrid>

                {/* Highlighted variants */}
                <h4 className="text-xs font-medium text-marble-500 dark:text-slate-500 mt-8 mb-4 uppercase tracking-wide">
                  Highlighted Variant
                </h4>
                <FeatureCardGrid columns={2}>
                  <FeatureCard
                    icon={<Layers className="w-8 h-8" />}
                    title="Cenotaphery"
                    description="A digital memorial for organizations that have passed. Preserve their legacy, learn from their journey."
                    variant={isDarkMode ? 'dark-highlighted' : 'highlighted'}
                  />
                  <FeatureCard
                    icon={<Zap className="w-8 h-8" />}
                    title="Research Platform"
                    description="Access anonymized data and insights from thousands of organizational autopsies."
                    variant={isDarkMode ? 'dark-highlighted' : 'highlighted'}
                  />
                </FeatureCardGrid>
              </div>
            </div>
          </section>

          {/* Divider Demo */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Special Elements
            </h2>

            <div className="space-y-8">
              {/* Roman Divider */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">Roman Divider</h3>
                <div className="divider-roman">
                  <span className="text-gold-500 font-serif text-lg px-4">SPQR</span>
                </div>
              </div>

              {/* Gold Accent */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">Gold Accent Border</h3>
                <div className="gold-accent-left p-4 bg-marble-100 dark:bg-slate-800 rounded-r-md">
                  <p className="text-marble-700 dark:text-marble-200">
                    Content with gold accent border on the left side.
                  </p>
                </div>
              </div>

              {/* Text Gradient */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">Gold Text Gradient</h3>
                <p className="font-serif text-4xl font-semibold text-gradient-gold">
                  Building the future of organizational science
                </p>
              </div>

              {/* Glow Effect */}
              <div>
                <h3 className="text-sm font-medium text-marble-600 dark:text-slate-400 mb-4">Gold Glow</h3>
                <div className="inline-block p-4 bg-gold-500 rounded-md shadow-glow-gold">
                  <span className="text-marble-950 font-medium">Glowing Element</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-marble-300/50 dark:border-slate-700/50 mt-20 bg-gradient-to-b from-transparent to-marble-100/50 dark:to-slate-800/50">
          <div className="max-w-content mx-auto px-6 py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="font-serif text-xl tracking-wider text-marble-600 dark:text-slate-400">
                S<span className="text-gold-500">·</span>O<span className="text-gold-500">·</span>I<span className="text-gold-500">·</span>L
              </div>
              <p className="font-ui text-sm uppercase tracking-widest text-marble-500 dark:text-slate-500">
                Roman Heritage Design System v3.0
              </p>
              <p className="text-xs text-marble-400 dark:text-slate-600">
                Modernized with carved stone buttons, layered shadows & atmospheric effects
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
