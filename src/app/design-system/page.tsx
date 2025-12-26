"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { Switch, SwitchWithLabel } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItemWithLabel } from "@/components/ui/radio-group";
import { Spinner, DotsSpinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Combobox } from "@/components/ui/combobox";
import { SectionLabel } from "@/components/ui/section-label";
import { RomanNumeral, PositionedRomanNumeral } from "@/components/ui/roman-numeral";
import { FeatureCard, FeatureCardGrid } from "@/components/ui/feature-card";
import { Search, Mail, ArrowRight, Layers, Zap, Shield, Globe, Share2 } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";

// Sample data for combobox
const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "nl", label: "Netherlands" },
  { value: "be", label: "Belgium" },
  { value: "ch", label: "Switzerland" },
  { value: "at", label: "Austria" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "pl", label: "Poland" },
  { value: "cz", label: "Czech Republic" },
  { value: "pt", label: "Portugal" },
  { value: "ie", label: "Ireland" },
];

const roles = [
  { value: "founder", label: "Founder / CEO" },
  { value: "cofounder", label: "Co-Founder" },
  { value: "executive", label: "Executive (C-Suite)" },
  { value: "director", label: "Director" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "advisor", label: "Advisor / Board Member" },
  { value: "investor", label: "Investor" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" },
];

export default function DesignSystemDemo() {
  const [progressValue] = useState(65);
  const { toast } = useToast();

  return (
    <div className="dark">
      <Toaster />
      <div className="min-h-screen bg-slate-900 text-marble-100">
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
                <span className="text-marble-100">Design System</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-1">
                Ancient elegance meets modern functionality. A dark-first design system inspired by
                Roman aesthetics - marble textures, classical typography, and gold accents.
              </p>
              <div className="flex justify-center gap-4 mt-8 animate-fade-in-up stagger-2">
                <Button variant="dark-primary" size="lg">
                  Explore Components
                </Button>
                <Button variant="dark-secondary" size="lg">
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
              {/* Slate - Primary dark background */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Slate (Background)</h3>
                <div className="flex gap-2 flex-wrap">
                  {[700, 800, 900, 950].map((shade) => (
                    <div key={shade} className="text-center">
                      <div
                        className={`w-14 h-14 rounded-sm bg-slate-${shade} border border-slate-600`}
                      />
                      <span className="text-xs text-slate-500 mt-1 block">{shade}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Primary: slate-900 (page bg), slate-800 (cards)
                </p>
              </div>

              {/* Marble - Typography */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Marble (Typography)</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-50 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">50</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-100 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">100</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-200 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">200</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-400 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">400</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-marble-950 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">950</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Primary: marble-100 (headings), slate-400 (body text)
                </p>
              </div>

              {/* Gold - Accent */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Gold (Accent)</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-300 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">300</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-400 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">400</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-500 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">500</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-gold-600 border border-slate-600" />
                    <span className="text-xs text-slate-500 mt-1 block">600</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Primary: gold-400 (buttons, accents), gold-500 (borders)
                </p>
              </div>

              {/* Semantic */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Semantic</h3>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-success-500" />
                    <span className="text-xs text-slate-500 mt-1 block">Success</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-warning-500" />
                    <span className="text-xs text-slate-500 mt-1 block">Warning</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-error-500" />
                    <span className="text-xs text-slate-500 mt-1 block">Error</span>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-sm bg-info-500" />
                    <span className="text-xs text-slate-500 mt-1 block">Info</span>
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
              <div className="font-serif text-display font-semibold tracking-wide text-marble-100">
                Display (Cinzel)
              </div>
              <div className="font-display text-5xl font-semibold text-marble-100">
                Heading 1 (Sora)
              </div>
              <div className="font-display text-4xl font-semibold text-marble-100">Heading 2</div>
              <div className="font-display text-3xl font-medium text-marble-100">Heading 3</div>
              <div className="font-display text-2xl font-medium text-marble-100">Heading 4</div>
              <div className="text-xl text-marble-100">Body XL (Manrope)</div>
              <div className="text-lg text-slate-300">Body Large</div>
              <div className="text-base text-slate-400">
                Body Base - The quick brown fox jumps over the lazy dog.
              </div>
              <div className="text-sm text-slate-400">Body Small</div>
              <div className="text-xs text-slate-500">Caption</div>
            </div>

            {/* Gradient Text */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Gradient Text</h3>
              <p className="font-display text-4xl font-semibold text-gradient-gold">
                Gold Gradient Headline
              </p>
            </div>
          </section>

          {/* Buttons */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Buttons
            </h2>

            <div className="space-y-8">
              {/* Primary & Secondary */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4 p-6 bg-slate-800 rounded-xl">
                  <Button variant="dark-primary">Primary</Button>
                  <Button variant="dark-secondary">Secondary</Button>
                  <Button variant="marble">Marble</Button>
                  <Button variant="dark-ghost">Ghost</Button>
                  <Button variant="dark-outline">Outline</Button>
                </div>
              </div>

              {/* Marble Button - Special Accent */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">
                  Marble Button (Dark Stone Accent)
                </h3>
                <div className="flex flex-wrap items-center gap-4 p-6 bg-slate-800 rounded-xl">
                  <Button variant="marble" size="sm">
                    Small
                  </Button>
                  <Button variant="marble" size="md">
                    Medium
                  </Button>
                  <Button variant="marble" size="lg">
                    Large
                  </Button>
                  <Button variant="marble" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    With Icon
                  </Button>
                  <ShareButton
                    url="https://soil.rip"
                    title="SOIL - Where founders share their stories for science"
                    description="Help build the future of organizational research"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Dark polished stone button with shine effect. Used for accent contrast in cards or
                  sections. ShareButton uses buttonVariants({`{variant: "marble", size: "sm"}`}) for
                  consistent styling with hover animation revealing social icons.
                </p>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4 p-6 bg-slate-800 rounded-xl">
                  <Button variant="dark-primary" size="sm">
                    Small
                  </Button>
                  <Button variant="dark-primary" size="md">
                    Medium
                  </Button>
                  <Button variant="dark-primary" size="lg">
                    Large
                  </Button>
                  <Button variant="dark-primary" size="xl">
                    Extra Large
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">States</h3>
                <div className="flex flex-wrap items-center gap-4 p-6 bg-slate-800 rounded-xl">
                  <Button variant="dark-primary" isLoading>
                    Loading
                  </Button>
                  <Button variant="dark-primary" disabled>
                    Disabled
                  </Button>
                  <Button variant="dark-primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    With Icon
                  </Button>
                </div>
              </div>

              {/* Secondary Variants */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Secondary States</h3>
                <div className="flex flex-wrap items-center gap-4 p-6 bg-slate-800 rounded-xl">
                  <Button variant="dark-secondary" size="lg">
                    Secondary Large
                  </Button>
                  <Button
                    variant="dark-secondary"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    With Icon
                  </Button>
                  <Button variant="dark-secondary" disabled>
                    Disabled
                  </Button>
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
              {/* Text Inputs */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Text Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant="dark">Text Input</Label>
                    <Input placeholder="Enter text..." variant="dark" />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">With Icon</Label>
                    <Input
                      placeholder="Search..."
                      leftIcon={<Search className="h-4 w-4" />}
                      variant="dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark" required>
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      leftIcon={<Mail className="h-4 w-4" />}
                      variant="dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Error State</Label>
                    <Input placeholder="Error input" error variant="dark" />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Textarea</Label>
                    <Textarea
                      placeholder="Write something..."
                      showCount
                      maxLength={500}
                      variant="dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Select</Label>
                    <Select>
                      <SelectTrigger variant="dark">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent variant="dark">
                        <SelectItem value="opt1" variant="dark">
                          Option 1
                        </SelectItem>
                        <SelectItem value="opt2" variant="dark">
                          Option 2
                        </SelectItem>
                        <SelectItem value="opt3" variant="dark">
                          Option 3
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Selection Controls */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Selection Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CheckboxWithLabel
                    label="Default checkbox"
                    description="With a description"
                    variant="dark"
                  />
                  <CheckboxWithLabel label="Checked" checked={true} variant="dark" />
                  <CheckboxWithLabel label="Indeterminate" indeterminate variant="dark" />
                  <CheckboxWithLabel label="Disabled" disabled variant="dark" />
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

            <div className="space-y-8">
              {/* Variants */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Variants</h3>
                <div className="flex flex-wrap gap-3 p-6 bg-slate-800 rounded-xl">
                  <Badge variant="dark-marble">Default</Badge>
                  <Badge variant="dark-outline">Outline</Badge>
                  <Badge variant="dark-ghost">Ghost</Badge>
                </div>
              </div>

              {/* Semantic */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Semantic</h3>
                <div className="flex flex-wrap gap-3 p-6 bg-slate-800 rounded-xl">
                  <Badge variant="dark-success">Success</Badge>
                  <Badge variant="dark-warning">Warning</Badge>
                  <Badge variant="dark-error">Error</Badge>
                  <Badge variant="dark-verified">Verified</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3 p-6 bg-slate-800 rounded-xl">
                  <Badge variant="dark-marble" size="sm">
                    Small
                  </Badge>
                  <Badge variant="dark-marble" size="md">
                    Medium
                  </Badge>
                  <Badge variant="dark-marble" size="lg">
                    Large
                  </Badge>
                </div>
              </div>

              {/* With Dot */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">With Dot Indicator</h3>
                <div className="flex flex-wrap items-center gap-3 p-6 bg-slate-800 rounded-xl">
                  <Badge variant="dark-marble" dot>
                    Active
                  </Badge>
                  <Badge variant="dark-success" dot>
                    Online
                  </Badge>
                  <Badge variant="dark-warning" dot>
                    Pending
                  </Badge>
                  <Badge variant="dark-error" dot>
                    Offline
                  </Badge>
                </div>
              </div>

              {/* Button + Badge alignment demo */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">
                  Button + Badge Alignment
                </h3>
                <div className="p-6 bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Button variant="dark-primary" size="sm">
                      Action
                    </Button>
                    <Badge variant="dark-marble">Status</Badge>
                    <Badge variant="dark-verified">Verified</Badge>
                  </div>
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
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Default Card</CardTitle>
                  <CardDescription variant="dark">Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">Card content area</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="dark-primary">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="dark-elevated">
                <CardHeader>
                  <CardTitle variant="dark">Elevated Card</CardTitle>
                  <CardDescription variant="dark">With shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">More prominent</p>
                </CardContent>
              </Card>

              <Card variant="dark-cenotaph">
                <CardHeader>
                  <CardTitle variant="dark">Cenotaph Card</CardTitle>
                  <CardDescription variant="dark">With gold accent border</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">Special memorial styling</p>
                </CardContent>
              </Card>

              <Card variant="dark" interactive>
                <CardHeader>
                  <CardTitle variant="dark">Interactive</CardTitle>
                  <CardDescription variant="dark">Hover me</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">Clickable card</p>
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
                  <Button variant="dark-primary">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent variant="dark">
                  <DialogHeader>
                    <DialogTitle variant="dark">Dialog Title</DialogTitle>
                    <DialogDescription variant="dark">
                      This is a dialog description with Roman heritage styling.
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

            <Card variant="dark">
              <CardHeader>
                <CardTitle variant="dark">Tabs Component</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tab1">
                  <TabsList variant="dark">
                    <TabsTrigger value="tab1" variant="dark">
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="tab2" variant="dark">
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="tab3" variant="dark">
                      Notifications
                    </TabsTrigger>
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
          </section>

          {/* Select / Dropdown */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Select / Dropdown
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Select */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Select Component</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label variant="dark">Organization Type</Label>
                    <Select>
                      <SelectTrigger variant="dark">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent variant="dark">
                        <SelectItem value="startup" variant="dark">
                          Startup
                        </SelectItem>
                        <SelectItem value="scaleup" variant="dark">
                          Scale-up
                        </SelectItem>
                        <SelectItem value="enterprise" variant="dark">
                          Enterprise
                        </SelectItem>
                        <SelectItem value="nonprofit" variant="dark">
                          Non-profit
                        </SelectItem>
                        <SelectItem value="government" variant="dark">
                          Government
                        </SelectItem>
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
                        <SelectItem value="tech" variant="dark">
                          Technology
                        </SelectItem>
                        <SelectItem value="finance" variant="dark">
                          Finance
                        </SelectItem>
                        <SelectItem value="healthcare" variant="dark">
                          Healthcare
                        </SelectItem>
                        <SelectItem value="retail" variant="dark">
                          Retail
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Searchable Combobox */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Searchable Combobox</CardTitle>
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
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Linear Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label variant="dark">Default ({progressValue}%)</Label>
                    <Progress value={progressValue} variant="dark" />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">With Value Display</Label>
                    <Progress value={75} variant="dark" showValue />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Success</Label>
                    <Progress value={100} variant="dark" color="success" />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Warning</Label>
                    <Progress value={45} variant="dark" color="warning" />
                  </div>
                  <div className="space-y-2">
                    <Label variant="dark">Error</Label>
                    <Progress value={20} variant="dark" color="error" />
                  </div>
                </CardContent>
              </Card>

              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Circular Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <CircularProgress size="sm" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">Small</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress size="md" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">Medium</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress size="lg" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">Large</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress size="md" value={75} variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">75%</p>
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
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Switches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Switch variant="dark" size="sm" />
                    <span className="text-sm text-slate-400">Small</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch variant="dark" size="md" defaultChecked />
                    <span className="text-sm text-slate-400">Medium (checked)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch variant="dark" size="lg" />
                    <span className="text-sm text-slate-400">Large</span>
                  </div>
                  <SwitchWithLabel
                    label="Email notifications"
                    description="Receive updates via email"
                    variant="dark"
                  />
                  <SwitchWithLabel
                    label="Marketing emails"
                    description="Receive promotional content"
                    variant="dark"
                    defaultChecked
                  />
                </CardContent>
              </Card>

              {/* Radio Groups */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Radio Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup defaultValue="option1">
                    <RadioGroupItemWithLabel
                      value="option1"
                      label="Option 1"
                      description="First option description"
                      variant="dark"
                    />
                    <RadioGroupItemWithLabel
                      value="option2"
                      label="Option 2"
                      description="Second option description"
                      variant="dark"
                    />
                    <RadioGroupItemWithLabel
                      value="option3"
                      label="Option 3"
                      description="Third option description"
                      variant="dark"
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
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Spinners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Spinner size="xs" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">XS</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="sm" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">SM</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="md" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">MD</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="lg" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">LG</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="xl" variant="dark" />
                      <p className="text-xs text-slate-500 mt-2">XL</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Dots Spinner</h4>
                    <div className="flex items-center gap-6">
                      <DotsSpinner size="sm" variant="dark" />
                      <DotsSpinner size="md" variant="dark" />
                      <DotsSpinner size="lg" variant="dark" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Toast */}
              <Card variant="dark">
                <CardHeader>
                  <CardTitle variant="dark">Toast Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="dark-primary"
                    onClick={() =>
                      toast({
                        title: "Success!",
                        description: "Your action was completed successfully.",
                        variant: "dark",
                      })
                    }
                  >
                    Show Default Toast
                  </Button>
                  <Button
                    variant="dark-secondary"
                    onClick={() =>
                      toast({
                        title: "Warning",
                        description: "Please review your input before continuing.",
                        variant: "dark-warning",
                      })
                    }
                  >
                    Show Warning Toast
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section Labels & Roman Numerals */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Section Labels & Roman Numerals
            </h2>

            <div className="space-y-12">
              {/* Section Labels */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">
                  Bracketed Section Labels
                </h3>
                <div className="space-y-4 p-6 bg-slate-800 rounded-xl">
                  <div className="space-y-2">
                    <SectionLabel>how it works</SectionLabel>
                    <h3 className="font-display text-2xl font-medium text-marble-100">
                      Building the Future
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>about soil</SectionLabel>
                    <h3 className="font-display text-2xl font-medium text-marble-100">
                      Our Mission
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>step iii</SectionLabel>
                    <h3 className="font-display text-2xl font-medium text-marble-100">
                      Financial Analysis
                    </h3>
                  </div>
                </div>
              </div>

              {/* Roman Numerals */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">
                  Decorative Roman Numerals
                </h3>
                <div className="flex flex-wrap gap-8 items-end p-6 bg-slate-800 rounded-xl">
                  <div className="text-center">
                    <RomanNumeral value={1} size="sm" variant="dark" />
                    <p className="text-xs text-slate-500 mt-2">Small (I)</p>
                  </div>
                  <div className="text-center">
                    <RomanNumeral value={2} size="md" variant="dark" />
                    <p className="text-xs text-slate-500 mt-2">Medium (II)</p>
                  </div>
                  <div className="text-center">
                    <RomanNumeral value={3} size="lg" variant="dark" />
                    <p className="text-xs text-slate-500 mt-2">Large (III)</p>
                  </div>
                  <div className="text-center">
                    <RomanNumeral value={4} size="xl" variant="dark" />
                    <p className="text-xs text-slate-500 mt-2">XL (IV)</p>
                  </div>
                </div>
                {/* Example with positioned numeral */}
                <div className="relative mt-6 p-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                  <PositionedRomanNumeral
                    value={5}
                    size="xl"
                    position="top-right"
                    variant="dark"
                    className="opacity-50 -mr-4 -mt-4"
                  />
                  <div className="relative z-10">
                    <SectionLabel>step v</SectionLabel>
                    <h3 className="font-display text-2xl font-medium mt-2 text-marble-100">
                      Environmental Context
                    </h3>
                    <p className="text-slate-400 mt-2">
                      Roman numeral as background decoration for wizard steps
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Feature Cards</h3>
                <FeatureCardGrid columns={4}>
                  <FeatureCard
                    icon={<Layers className="w-8 h-8" />}
                    title="Data Collection"
                    description="Structured interviews capture organizational knowledge before it's lost."
                    variant="dark"
                  />
                  <FeatureCard
                    icon={<Zap className="w-8 h-8" />}
                    title="AI Analysis"
                    description="Advanced pattern recognition identifies common failure modes."
                    variant="dark"
                  />
                  <FeatureCard
                    icon={<Shield className="w-8 h-8" />}
                    title="Privacy First"
                    description="Your data remains private. Only share what you choose."
                    variant="dark"
                  />
                  <FeatureCard
                    icon={<Globe className="w-8 h-8" />}
                    title="Global Research"
                    description="Contributing to worldwide organizational science research."
                    variant="dark"
                  />
                </FeatureCardGrid>

                {/* Highlighted variants */}
                <h4 className="text-xs font-medium text-slate-500 mt-8 mb-4 uppercase tracking-wide">
                  Highlighted Variant (with gold border)
                </h4>
                <FeatureCardGrid columns={2}>
                  <FeatureCard
                    icon={<Layers className="w-8 h-8" />}
                    title="Cenotaphery"
                    description="A digital memorial for organizations that have passed. Preserve their legacy, learn from their journey."
                    variant="dark-highlighted"
                  />
                  <FeatureCard
                    icon={<Zap className="w-8 h-8" />}
                    title="Research Platform"
                    description="Access anonymized data and insights from thousands of organizational autopsies."
                    variant="dark-highlighted"
                  />
                </FeatureCardGrid>
              </div>
            </div>
          </section>

          {/* Decorative Elements */}
          <section className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-medium mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold-500"></span>
              Decorative Elements
            </h2>

            <div className="space-y-8">
              {/* Roman Divider */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Roman Divider</h3>
                <div className="divider-roman">
                  <span className="text-gold-500 font-serif text-lg px-4">SPQR</span>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Used between sections with decorative symbol (✦, MMXXV, etc.)
                </p>
              </div>

              {/* Gold Accent Border */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Gold Accent Border</h3>
                <div className="gold-accent-left p-4 bg-slate-800 rounded-r-xl">
                  <p className="text-marble-200">
                    Content with gold accent border on the left side.
                  </p>
                </div>
              </div>

              {/* Icon Container */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Icon Containers</h3>
                <div className="flex gap-4 p-6 bg-slate-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    <Shield className="w-8 h-8" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Pattern: bg-gold-500/20 + text-gold-400
                </p>
              </div>

              {/* Gold Bullet Points */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Gold Bullet Points</h3>
                <div className="p-6 bg-slate-800 rounded-xl">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      First bullet point with gold dot indicator
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Second bullet point with gold dot indicator
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="text-gold-500 mt-1.5">•</span>
                      <span>Alternative: using text gold bullet</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Gradient Transitions */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Gradient Transitions</h3>
                <div className="rounded-xl overflow-hidden">
                  <div className="h-24 bg-slate-900 flex items-center justify-center">
                    <span className="text-slate-500">slate-900 (page bg)</span>
                  </div>
                  <div className="h-12 bg-gradient-to-b from-slate-900 to-marble-950" />
                  <div className="h-24 bg-marble-950 flex items-center justify-center">
                    <span className="text-slate-500">marble-950 (section bg)</span>
                  </div>
                  <div className="h-12 bg-gradient-to-b from-marble-950 to-slate-900" />
                  <div className="h-24 bg-slate-900 flex items-center justify-center">
                    <span className="text-slate-500">slate-900 (page bg)</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Used to transition between different background sections
                </p>
              </div>

              {/* Gold Glow Effect */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Gold Glow Effects</h3>
                <div className="flex gap-6 p-6 bg-slate-800 rounded-xl">
                  <div className="p-4 bg-gold-500 rounded-md shadow-glow-gold-sm">
                    <span className="text-marble-950 font-medium text-sm">Small</span>
                  </div>
                  <div className="p-4 bg-gold-500 rounded-md shadow-glow-gold">
                    <span className="text-marble-950 font-medium text-sm">Default</span>
                  </div>
                  <div className="p-4 bg-gold-500 rounded-md shadow-glow-gold-lg">
                    <span className="text-marble-950 font-medium text-sm">Large</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
