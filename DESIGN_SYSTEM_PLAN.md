# SOIL Design System - Roman Heritage Edition

**Status**: Implemented
**Date**: December 16, 2025
**Theme**: Dark Mode Only (Scientific/Research Focus)
**Concept**: Ancient Roman elegance meets modern digital design

---

## 1. Design Philosophy

### Core Concept

The SOIL design system draws inspiration from ancient Roman aesthetics - marble textures, classical typography, gold accents - while maintaining a contemporary, functional interface suitable for a modern research platform.

### Single Theme Strategy: Dark Mode

We've adopted a unified dark theme that balances:

- Scientific professionalism (slate backgrounds)
- Roman heritage warmth (gold accents, marble typography)
- Memorial dignity (cenotaph-specific components)

---

## 2. Color System

### 2.1 Background Colors - Slate

```
Slate (Primary Backgrounds)
├── slate-700:   #334155    // Elevated surfaces
├── slate-800:   #1E293B    // Cards, panels
├── slate-900:   #0F172A    // Page background (PRIMARY)
├── slate-950:   #020617    // Deepest dark
```

### 2.2 Typography Colors - Marble

```
Marble (Text & Highlights)
├── marble-50:   #FDFCFB    // Pure white highlights
├── marble-100:  #F9F7F4    // Primary headings
├── marble-200:  #F3EFE9    // Secondary text
├── marble-400:  #D4CBC0    // Muted text
├── marble-950:  #252220    // Dark text (on light surfaces)
```

**Text Color Usage:**

- Headings: `text-marble-100`
- Body text: `text-slate-400`
- Muted/caption: `text-slate-500`
- Links: `text-gold-400` (hover: `text-gold-300`)

### 2.3 Accent - Roman Gold

```
Gold (Primary Accent)
├── gold-300:   #EDCA85     // Light gold (highlights)
├── gold-400:   #E2B055     // Primary accent
├── gold-500:   #C9943D     // True Roman gold
├── gold-600:   #A67A2E     // Deep gold (hover states)
```

**Gold Usage:**

- Buttons: gold gradient backgrounds
- Accents: `gold-400` for icons, borders
- Borders: `gold-500` for emphasis
- Glow effects: `shadow-glow-gold`

### 2.4 Semantic Colors

```
Success:   #4A7052    // Muted sage green
Warning:   #C9943D    // Gold (reuse accent)
Error:     #B85450    // Pompeii red (muted)
Info:      #5B7C99    // Roman blue (muted)
```

---

## 3. Typography

### 3.1 Font Stack

| Role             | Font           | Usage                                 |
| ---------------- | -------------- | ------------------------------------- |
| **Display/Logo** | Cinzel         | Logo, Roman numerals, decorative text |
| **Headings**     | Sora           | h1-h6, section titles                 |
| **Body/UI**      | Manrope        | Body text, buttons, inputs, labels    |
| **Monospace**    | JetBrains Mono | Code, data, technical content         |

### 3.2 Typography Classes

```css
font-serif    → Cinzel (Roman heritage)
font-display  → Sora (modern headings)
font-sans     → Manrope (body text)
font-ui       → Manrope (UI elements)
font-mono     → JetBrains Mono
```

### 3.3 Text Styles

```
Display:     font-serif text-6xl font-semibold tracking-wider
Heading 1:   font-display text-5xl font-semibold
Heading 2:   font-display text-4xl font-semibold
Heading 3:   font-display text-3xl font-medium
Heading 4:   font-display text-2xl font-medium
Body XL:     text-xl text-marble-100
Body Large:  text-lg text-slate-300
Body:        text-base text-slate-400
Small:       text-sm text-slate-400
Caption:     text-xs text-slate-500
```

### 3.4 Special Text Effects

**Gold Gradient Text:**

```css
.text-gradient-gold {
  background: linear-gradient(135deg, #e2b055 0%, #c9943d 50%, #a67a2e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 4. Components

### 4.1 Buttons

| Variant          | Description                      | Use Case              |
| ---------------- | -------------------------------- | --------------------- |
| `dark-primary`   | Light marble gradient, dark text | Primary CTA           |
| `dark-secondary` | Transparent, marble border       | Secondary actions     |
| `dark-ghost`     | Transparent, underline on hover  | Tertiary/links        |
| `dark-outline`   | Transparent, solid border        | Alternative secondary |
| `marble`         | Dark stone gradient, light text  | Accent contrast       |
| `cenotaph`       | Gold gradient with glow          | Memorial CTAs         |

**Button Sizes:** sm, md, lg, xl, icon, icon-sm, icon-lg

### 4.2 Cards

| Variant         | Background | Border               | Use Case        |
| --------------- | ---------- | -------------------- | --------------- |
| `dark`          | slate-800  | slate-700            | Default cards   |
| `dark-elevated` | slate-800  | slate-700 + shadow   | Prominent cards |
| `dark-cenotaph` | slate-800  | gold-500 left accent | Memorial cards  |

**Card Props:** `interactive` adds hover effects

### 4.3 Form Inputs

All inputs use `variant="dark"`:

- Background: `slate-800`
- Border: `slate-700`
- Focus: `gold-500` ring
- Text: `marble-100`
- Placeholder: `slate-500`

**Components:** Input, Textarea, Select, Combobox, Checkbox, Radio, Switch

### 4.4 Badges

| Variant         | Use Case         |
| --------------- | ---------------- |
| `dark-marble`   | Default status   |
| `dark-outline`  | Outlined style   |
| `dark-ghost`    | Subtle indicator |
| `dark-success`  | Positive status  |
| `dark-warning`  | Warning status   |
| `dark-error`    | Error status     |
| `dark-verified` | Verified badge   |

**Badge Props:** `dot` adds status indicator dot

### 4.5 Other Components

- **Dialog:** `variant="dark"` for all parts
- **Tabs:** `variant="dark"` for TabsList, TabsTrigger, TabsContent
- **Progress:** Linear and Circular variants
- **Spinner:** Standard and DotsSpinner variants
- **Toast:** `dark`, `dark-warning` variants

---

## 5. Decorative Elements

### 5.1 Section Label

Bracketed labels for section introductions:

```tsx
<SectionLabel>how it works</SectionLabel>
```

Renders as: `[ how it works ]`

### 5.2 Roman Numerals

Decorative background numerals for wizard steps:

```tsx
<RomanNumeral value={3} size="lg" variant="dark" />
<PositionedRomanNumeral value={5} position="top-right" />
```

### 5.3 Roman Divider

Full-width decorative divider with symbol:

```html
<div class="divider-roman">
  <span class="text-gold-500 font-serif">MMXXV</span>
</div>
```

### 5.4 Icon Containers

Circular gold-tinted icon backgrounds:

```tsx
<div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
  <Icon className="w-8 h-8" />
</div>
```

### 5.5 Gold Accent Border

Left border accent for quotes/highlights:

```html
<div class="gold-accent-left p-4 bg-slate-800">Content with gold accent</div>
```

### 5.6 Gradient Transitions

Smooth transitions between sections:

```tsx
// Page bg → Section bg
<div className="h-12 bg-gradient-to-b from-slate-900 to-marble-950" />

// Section bg → Page bg
<div className="h-12 bg-gradient-to-b from-marble-950 to-slate-900" />
```

### 5.7 Gold Glow Effects

Box shadows for gold elements:

```css
shadow-glow-gold-sm: 0 0 10px rgba(201, 148, 61, 0.20)
shadow-glow-gold:    0 0 20px rgba(201, 148, 61, 0.25)
shadow-glow-gold-lg: 0 0 40px rgba(201, 148, 61, 0.30)
```

---

## 6. Spacing & Layout

### 6.1 Spacing Scale (4px base)

```
0:   0px      6:   24px     16:  64px
1:   4px      7:   28px     18:  72px
2:   8px      8:   32px     20:  80px
3:   12px     10:  40px     24:  96px
4:   16px     12:  48px     32:  128px
5:   20px     14:  56px
```

### 6.2 Layout Widths

```
prose:    65ch      // Optimal reading width
content:  1440px    // Main content max-width
wide:     1840px    // Full-width sections
```

### 6.3 Border Radius

```
none:     0         lg:   20px
sm:       8px       xl:   25px
DEFAULT:  12px      2xl:  32px
md:       16px      full: 9999px
```

---

## 7. Animations

### 7.1 Timing

```
fast:     150ms
DEFAULT:  250ms
slow:     400ms
slower:   600ms
```

### 7.2 Standard Animations

```css
animate-fade-in       // Opacity 0 → 1
animate-fade-out      // Opacity 1 → 0
animate-slide-up      // translateY + fade
animate-slide-down    // translateY + fade
animate-scale-in      // scale + fade
animate-shimmer-gold  // Gold shimmer effect
animate-pulse-subtle  // Subtle opacity pulse
```

### 7.3 Stagger Classes

For cascading animations:

```css
.stagger-1  // delay: 100ms
.stagger-2  // delay: 200ms
.stagger-3  // delay: 300ms
```

---

## 8. File Structure

```
src/
├── app/
│   ├── globals.css           # Tailwind + CSS variables + animations
│   ├── layout.tsx            # Root layout with fonts
│   └── design-system/        # Design system showcase
├── components/
│   ├── ui/                   # Base components (Button, Card, Input...)
│   ├── sections/             # Page sections
│   └── layout/               # AppShell, Header, Footer
├── lib/
│   └── utils.ts              # cn() helper
└── tailwind.config.ts        # Design tokens
```

---

## 9. Usage Examples

### Hero Section

```tsx
<section className="py-20 md:py-32">
  <h1 className="font-display text-4xl md:text-6xl font-semibold text-marble-100">
    <span className="text-gradient-gold">Golden Headline</span>
  </h1>
  <p className="text-slate-400 leading-relaxed">Description text here</p>
  <div className="flex gap-4">
    <Button variant="dark-primary" size="lg">
      Primary CTA
    </Button>
    <Button variant="dark-secondary" size="lg">
      Secondary CTA
    </Button>
  </div>
</section>
```

### Feature Card Grid

```tsx
<div className="grid md:grid-cols-3 gap-6">
  <Card variant="dark-elevated">
    <CardHeader>
      <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <CardTitle variant="dark">Title</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-400">Description</p>
    </CardContent>
  </Card>
</div>
```

### Form Section

```tsx
<Card variant="dark">
  <CardHeader>
    <CardTitle variant="dark">Form Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label variant="dark">Email</Label>
      <Input placeholder="you@example.com" variant="dark" />
    </div>
    <Button variant="dark-primary" className="w-full">
      Submit
    </Button>
  </CardContent>
</Card>
```

---

## 10. Design System Page

View the complete component showcase at:
**`/design-system`**

This page demonstrates all components, colors, typography, and patterns documented above.

---

**Last Updated:** December 16, 2025
