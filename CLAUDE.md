# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SOIL (Social Organizational Intelligence Lab) is a research platform for organizational autopsy data collection. The MVP includes a website with 3D navigation, user accounts, interview wizard, cenotaph creation, and cemetery visualization.

**Call me Dima** for all communications.

## Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server

# Playwright E2E tests
npx playwright test                           # Run all tests
npx playwright test tests/visual-test.spec.ts # Run specific test
npx playwright test --headed                  # Run with visible browser
npx playwright install chromium               # Install browser if needed
```

## Architecture

### App Structure (Next.js 14+ App Router)

```
src/
├── app/                    # Pages and routes
│   ├── layout.tsx          # Root layout with fonts, metadata, AppShell
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Tailwind
│   ├── research/           # /research route
│   └── community/          # /community route
├── components/
│   ├── layout/             # Global wrappers: AppShell, Header, Footer
│   ├── layouts/            # Page-specific layouts (dashboard, wizard, auth)
│   ├── navigation/         # Navigation components
│   ├── sections/           # Page section components (Hero, About, etc.)
│   ├── three/              # React Three Fiber 3D components
│   ├── transitions/        # Page transition components
│   ├── ui/                 # Radix-based design system components
│   └── forms/              # Form components
├── contexts/               # React contexts (MenuContext)
└── lib/                    # Utilities (cn, formatNumber, etc.)
```

### Global Architecture Pattern

The app uses a single `AppShell` wrapper in `layout.tsx` that provides:
- `MenuProvider` - global menu state with route-to-section mapping
- `Header` - sticky header with menu button
- `Footer` - footer with 3D Tuscan landscape
- `MenuTransition` - single global instance for portal navigation
- `GlobalParticles` - floating visitor particles
- Dark mode state (default: dark)

### 3D Navigation System

The centerpiece is a dodecahedron portal navigation built with React Three Fiber:

**Key Files:**
- [DodecahedronScene.tsx](src/components/three/DodecahedronScene.tsx) - Main 3D scene with camera animations
- [Dodecahedron.tsx](src/components/three/Dodecahedron.tsx) - The 12-faced polyhedron with portals
- [MenuContext.tsx](src/contexts/MenuContext.tsx) - Menu state and route mapping
- [MenuTransition.tsx](src/components/transitions/MenuTransition.tsx) - Orchestrates fly-in/fly-out

**Portal Navigation Flow:**
1. User double-clicks a portal face
2. Camera flies INTO dodecahedron (`flythrough` → `fadeout` phases)
3. Fade overlay covers screen
4. Next.js navigates to new route under the overlay
5. Camera flies OUT of dodecahedron (arc trajectory)
6. Fade overlay reveals new page

**Route-Section Mapping (MenuContext):**
```typescript
'/': 'home'
'/research': 'research'
'/community': 'community'
```

### Design System

Tailwind configuration in [tailwind.config.ts](tailwind.config.ts) with Roman-inspired theme:
- **Colors:** marble (warm whites), gold (accent), terra (earth), slate (scientific/dark)
- **Fonts:** Sora (headings), Manrope (body), Cinzel (decorative/Roman)
- **Components:** Radix UI primitives in `src/components/ui/`
- **Utility:** `cn()` helper from `src/lib/utils.ts` for className merging

## Core Principles

1. **Plan before coding** - Never write code without user-approved plan
2. **Search for root causes** - Understand problems before fixing
3. **Simplify solutions** - Build MVPs with minimum required functionality
4. **Be radically honest** - Admit when something doesn't work
5. **Test thoroughly** - Check everything twice before celebrating
6. **No `as any`** - Avoid TypeScript escape hatches
7. **Real testing** - No mocking for integration/E2E tests

## Tech Stack

- **Framework:** Next.js 15.x (App Router) + React 19 + TypeScript
- **3D:** React Three Fiber + Drei + Three.js + Postprocessing
- **Styling:** Tailwind CSS 3.4
- **UI:** Radix UI primitives + custom design system
- **Testing:** Playwright (E2E)
- **Future:** Supabase (auth/database), Vercel (hosting)

## Documentation

Strategic documents are stored in a separate private repository: [SOIL-strategy](https://github.com/ertad-family/SOIL-strategy)

Local access via symlink: `docs/` → `../SOIL-strategy/` (gitignored)
