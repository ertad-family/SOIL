# SOIL Design System - Roman Heritage Edition

**Status**: Awaiting Approval
**Date**: December 10, 2025
**Concept**: Ancient Roman elegance meets modern digital design

---

## 1. Design Philosophy

### Core Concept
The SOIL design system draws inspiration from ancient Roman aesthetics - marble textures, classical typography, gold accents - while maintaining a contemporary, functional interface suitable for a modern research platform.

### Two Aesthetic Modes

**SOIL Core (Research/Scientific)**
- Tilts toward modernity
- Clean, data-focused interfaces
- Roman heritage as subtle undertone
- Professional, authoritative feel

**Cenotaphery (Memorial/Therapeutic)**
- Embraces classical warmth more fully
- Marble textures, warmer tones
- Gold accents more prominent
- Dignified, peaceful, healing atmosphere

---

## 2. Color System

### 2.1 Primary Palette - Marble & Stone

```
Marble (Primary Backgrounds)
├── marble-50:   #FDFCFB    // Pure marble white
├── marble-100:  #F9F7F4    // Warm white
├── marble-200:  #F3EFE9    // Light cream
├── marble-300:  #E8E2D9    // Soft stone
├── marble-400:  #D4CBC0    // Weathered marble
├── marble-500:  #B8ADA0    // Medium stone
├── marble-600:  #9A8D7F    // Aged marble
├── marble-700:  #7A6E62    // Dark stone
├── marble-800:  #5A5048    // Deep earth
├── marble-900:  #3D3632    // Charcoal brown
├── marble-950:  #252220    // Near black (text)
```

### 2.2 Accent - Roman Gold

```
Gold (Primary Accent)
├── gold-50:    #FDF9EF     // Lightest gold tint
├── gold-100:   #FBF0D9     // Pale gold
├── gold-200:   #F6DFB3     // Light gold
├── gold-300:   #EDCA85     // Soft gold
├── gold-400:   #E2B055     // Medium gold
├── gold-500:   #C9943D     // True Roman gold (primary)
├── gold-600:   #A67A2E     // Deep gold
├── gold-700:   #845F23     // Bronze gold
├── gold-800:   #6B4C1C     // Dark bronze
├── gold-900:   #563D17     // Deepest bronze
```

### 2.3 Supporting Colors

```
Terra (Earth Tones - Secondary)
├── terra-400:  #C4A484     // Light terracotta
├── terra-500:  #A68968     // Terracotta
├── terra-600:  #8B6F4E     // Deep terra

Slate (Cool Neutral - SOIL Scientific)
├── slate-400:  #94A3B8     // Light slate
├── slate-500:  #64748B     // Medium slate
├── slate-600:  #475569     // Dark slate
├── slate-800:  #1E293B     // Deep slate (dark mode bg)
├── slate-900:  #0F172A     // Darkest slate
```

### 2.4 Semantic Colors

```
Success:   #5D8A66    // Muted sage green (Roman garden)
Warning:   #C9943D    // Gold (reuse accent)
Error:     #B85450    // Pompeii red (muted)
Info:      #5B7C99    // Roman blue (muted)
```

### 2.5 Theme Strategy

**Light Mode (Cenotaphery Default)**
- Background: marble-50 to marble-200
- Text: marble-950, marble-800
- Accents: gold-500, gold-600

**Dark Mode (SOIL Scientific Default)**
- Background: slate-900, slate-800
- Text: marble-100, marble-200
- Accents: gold-400, gold-500

---

## 3. Typography

### 3.1 Font Stack

**Headings: Cinzel**
- Free Google Font, inspired by Roman inscriptions
- Elegant serifs, classical proportions
- Use: All headings (h1-h6), logo text, important labels

**Body: Source Sans 3** (or Raleway)
- Clean, highly readable sans-serif
- Modern feel that complements Cinzel
- Use: Body text, UI elements, forms

**Monospace: JetBrains Mono**
- For code, data, technical content
- Clean and readable

### 3.2 Typography Scale

```
Display:   72px / 1.0   (Cinzel, 600)     // Hero headlines
H1:        48px / 1.1   (Cinzel, 600)     // Page titles
H2:        36px / 1.2   (Cinzel, 600)     // Section headers
H3:        28px / 1.3   (Cinzel, 500)     // Subsections
H4:        22px / 1.4   (Cinzel, 500)     // Card titles
H5:        18px / 1.4   (Cinzel, 500)     // Small headers
H6:        16px / 1.5   (Cinzel, 500)     // Labels

Body XL:   20px / 1.6   (Source Sans, 400)
Body LG:   18px / 1.6   (Source Sans, 400)
Body:      16px / 1.6   (Source Sans, 400) // Default
Body SM:   14px / 1.5   (Source Sans, 400)
Caption:   12px / 1.4   (Source Sans, 400)
```

### 3.3 Font Weights
- Cinzel: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Source Sans 3: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)

---

## 4. Visual Elements

### 4.1 Subtle Textures (CSS/SVG)

**Marble Veining**
- Very subtle, low-opacity background pattern
- Used sparingly: hero sections, special cards, cenotaph pages
- Implementation: CSS gradient or subtle SVG pattern

**Paper/Parchment**
- Warm, organic texture for Cenotaphery sections
- Subtle noise overlay
- Light mode only

### 4.2 Borders & Dividers

```
Border Widths:
├── thin:   1px
├── medium: 2px
├── thick:  3px

Border Colors:
├── default:  marble-300 (light) / slate-700 (dark)
├── subtle:   marble-200 (light) / slate-800 (dark)
├── accent:   gold-500 (both modes)
```

### 4.3 Border Radius

```
none:   0
sm:     4px     // Buttons, inputs (subtle, Roman-inspired squareness)
md:     6px     // Cards
lg:     8px     // Modals, larger containers
xl:     12px    // Special elements
full:   9999px  // Pills, avatars
```

*Note: Keep radius subtle - Roman aesthetics favor cleaner lines*

### 4.4 Shadows (Elevation)

```
sm:     0 1px 2px rgba(61, 54, 50, 0.06)
md:     0 2px 4px rgba(61, 54, 50, 0.08), 0 1px 2px rgba(61, 54, 50, 0.04)
lg:     0 4px 8px rgba(61, 54, 50, 0.10), 0 2px 4px rgba(61, 54, 50, 0.06)
xl:     0 8px 16px rgba(61, 54, 50, 0.12), 0 4px 8px rgba(61, 54, 50, 0.08)
2xl:    0 16px 32px rgba(61, 54, 50, 0.14), 0 8px 16px rgba(61, 54, 50, 0.10)

glow-gold:  0 0 20px rgba(201, 148, 61, 0.25)  // For gold accents
```

---

## 5. Spacing System

### 5.1 Base Unit: 4px

```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
5:    20px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
24:   96px
32:   128px
```

### 5.2 Layout Widths

```
Prose:      65ch        // Optimal reading width
Content:    1200px      // Main content max-width
Wide:       1440px      // Full-width sections
```

---

## 6. Animation & Transitions

### 6.1 Timing

```
fast:     150ms
default:  250ms
slow:     400ms
slower:   600ms
```

### 6.2 Easing

```
ease-out:     cubic-bezier(0.0, 0.0, 0.2, 1)
ease-in-out:  cubic-bezier(0.4, 0.0, 0.2, 1)
spring:       cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 6.3 Standard Animations

- **fade-in**: Opacity 0 → 1
- **slide-up**: translateY(10px) → 0 + fade
- **scale-in**: scale(0.95) → 1 + fade
- **shimmer**: For loading states (gold tint)

*Animation philosophy: Subtle and refined, never flashy*

---

## 7. Component Specifications

### 7.1 Bracketed Section Labels

Inspired by modern tech aesthetics - a distinctive typographic treatment for section introductions.

```
Pattern: [ section name ]

Styling:
├── Font: Source Sans 3, 14px
├── Weight: 500 (Medium)
├── Color: gold-500 (both modes)
├── Letter-spacing: 0.05em
├── Text-transform: lowercase
├── Brackets: included with inner spacing

Usage:
├── Above main section headings
├── Card category labels
├── Navigation breadcrumbs
├── Step indicators in wizard
```

**Example HTML/CSS:**
```css
.section-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--gold-500);
  text-transform: lowercase;
}
.section-label::before { content: '[ '; }
.section-label::after { content: ' ]'; }
```

**Usage examples:**
- `[ how it works ]`
- `[ about soil ]`
- `[ cenotaphery ]`
- `[ step iii ]`

---

### 7.2 Decorative Roman Numerals

Large outline numerals as visual anchors - reinforces our Roman heritage theme.

```
Style:
├── Font: Cinzel, Display size (72-120px)
├── Weight: 400 (Regular)
├── Color: transparent fill, gold-500/20 stroke (subtle)
├── Stroke-width: 1-2px
├── Position: Background decorative element

Numerals:
├── I, II, III, IV, V, VI (for 6-step wizard)
├── Can extend to X, L, C for larger numbers

Usage:
├── Interview wizard steps
├── Feature section numbering
├── Timeline markers
├── Process flow indicators
```

**Example CSS:**
```css
.roman-numeral {
  font-family: 'Cinzel', serif;
  font-size: 96px;
  font-weight: 400;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(201, 148, 61, 0.2);
  position: absolute;
  user-select: none;
  pointer-events: none;
}
```

---

### 7.3 Feature Cards

Icon + title + description pattern for showcasing features, services, or concepts.

```
Structure:
├── Icon/Visual (48-64px, top-aligned)
├── Title (H4, Cinzel)
├── Description (Body, Source Sans 3)
├── Optional: Link/CTA

Spacing:
├── Icon to title: 16px
├── Title to description: 8px
├── Card padding: 24-32px
├── Between cards: 24px (grid gap)

Grid Layout:
├── Desktop: 4 columns
├── Tablet: 2 columns
├── Mobile: 1 column
```

**Variants:**

**Default Feature Card**
- Background: transparent or marble-50 (light) / slate-800 (dark)
- Border: none or 1px subtle
- Icon: Abstract shape or simple line icon

**Highlighted Feature Card**
- Background: subtle gradient or marble-100
- Border: 1px gold-500/30 (left accent)
- Icon: Gold-tinted

**Example structure:**
```html
<div class="feature-card">
  <div class="feature-icon">{icon}</div>
  <h4 class="feature-title">Feature Name</h4>
  <p class="feature-description">
    Brief description of the feature or concept.
  </p>
</div>
```

---

### 7.4 Buttons

**Primary** (Gold)
- Background: gold-500
- Text: marble-950
- Hover: gold-600
- Border-radius: sm (4px)

**Secondary** (Outlined)
- Border: 2px marble-400
- Text: marble-700
- Hover: marble-100 bg

**Ghost** (Text only)
- Text: gold-600
- Hover: gold-50 bg

**Sizes**: sm (32px), md (40px), lg (48px)

### 7.2 Form Inputs

- Background: marble-50 (light) / slate-800 (dark)
- Border: 1px marble-400
- Focus: gold-500 border, subtle gold glow
- Border-radius: sm (4px)
- Height: 44px (touch-friendly)

### 7.3 Cards

- Background: white (light) / slate-800 (dark)
- Border: 1px marble-300 (light) / slate-700 (dark)
- Border-radius: md (6px)
- Shadow: md on hover

### 7.4 Special: Cenotaph Card

- Subtle marble texture background
- Gold accent border (top or left)
- Warm shadow with slight gold tint

---

## 8. Implementation Checklist

### Phase 1: Foundation
- [ ] Configure Tailwind with color tokens
- [ ] Set up Google Fonts (Cinzel, Source Sans 3)
- [ ] Create globals.css with CSS variables
- [ ] Create utility classes (cn helper, etc.)

### Phase 2: Base Components
- [ ] Button (all variants)
- [ ] Input, Textarea
- [ ] Select
- [ ] Checkbox, Radio, Switch
- [ ] Label

### Phase 3: Complex Components
- [ ] Section Label (bracketed `[ label ]` pattern)
- [ ] Roman Numeral decorator
- [ ] Feature Card (icon + title + description)
- [ ] Card (default, cenotaph variant)
- [ ] Dialog/Modal
- [ ] Toast notifications
- [ ] Tabs
- [ ] Progress bar
- [ ] Spinner/Loader
- [ ] Badge

### Phase 4: Layout & Navigation
- [ ] Header/Navbar
- [ ] Footer
- [ ] Sidebar
- [ ] Page layouts (main, auth, dashboard, wizard)

### Phase 5: Special Components
- [ ] Cenotaph preview card
- [ ] Step indicator (wizard)
- [ ] Data visualization components

---

## 9. File Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind + CSS variables
│   └── fonts.ts             # Font configuration
├── components/
│   ├── ui/                  # Base components
│   ├── forms/               # Form components
│   ├── navigation/          # Nav components
│   └── layouts/             # Layout components
├── lib/
│   └── utils.ts             # cn() helper, etc.
└── tailwind.config.ts       # Design tokens
```

---

## 10. Questions for Approval

1. **Color Palette**: Does the marble/stone + gold combination feel right for SOIL's brand?

2. **Typography**: Cinzel for headings + Source Sans 3 for body - approved?

3. **Texture Usage**: Subtle marble veining for Cenotaphery sections - yes/no?

4. **Border Radius**: Keeping it subtle (4-8px max) for Roman-inspired clean lines?

5. **Any adjustments** to the overall direction before I proceed?

---

## Sources

Typography research:
- [Google Fonts Similar to Trajan](https://similarfont.io/2-google-fonts-similar-to-trajan)
- [Fonts Similar to Cinzel & Pairings](https://design.tutsplus.com/articles/fonts-similar-to-cinzel-what-font-goes-well-with-cinzel--cms-108526)
- [Cinzel Font Pairings](https://maxibestof.one/typefaces/cinzel)

---

**Awaiting your approval, Dima.**
