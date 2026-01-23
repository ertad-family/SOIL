# SOIL — Studies of Organizational Illness and Loss

**Building the foundation for organizational medicine.**

## Vision

SOIL is a research-first platform devoted to collecting organizational autopsy data at scale to ignite a completely new scientific field: **Organizational Biology, Health, and Medicine**.

Just as pioneers centuries ago began systematically documenting human deaths and conducting autopsies — eventually giving rise to modern medicine, pathology, and healthcare — SOIL's mission is to do exactly the same for organizations.

## Mission

_Transform organizational failure from wasted potential into collective wisdom._

## What SOIL Does

- **Cenotaphery** — A digital cemetery where organizations are memorialized through structured data collection
- **Interview Wizard** — Guided organizational autopsy interviews capturing failure patterns
- **Research Center** — Academic research infrastructure built on collected data
- **3D Navigation** — Immersive dodecahedron portal navigation between platform sections
- **Community** — Contributors, keepers, and researchers collaborating on organizational health

## Project Status

**Phase: MVP Development** — Core platform for data intake, cenotaph creation, and research infrastructure.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **3D:** React Three Fiber + Drei + Three.js
- **Styling:** Tailwind CSS 3.4 + Radix UI primitives
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel
- **Testing:** Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/ertad-family/SOIL.git
cd SOIL

# Install dependencies
npm install

# Copy environment template and fill in your values
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run format       # Format code with Prettier
npm run test:e2e     # Run Playwright E2E tests
```

## Project Structure

```
src/
├── app/                    # Pages and API routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── cenotaph/           # Cenotaph creation
│   ├── cenotaphery/        # Cemetery browsing
│   ├── interview/          # Interview wizard
│   ├── research/           # Research center
│   ├── community/          # Community hub
│   ├── auth/               # Authentication
│   └── api/                # API routes
├── components/
│   ├── three/              # React Three Fiber 3D components
│   ├── sections/           # Page section components
│   ├── layout/             # Global wrappers (AppShell, Header, Footer)
│   ├── navigation/         # Navigation components
│   ├── transitions/        # Page transition animations
│   ├── ui/                 # Design system components
│   └── forms/              # Form components
├── contexts/               # React contexts
└── lib/                    # Utilities
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security

To report security vulnerabilities, please see [SECURITY.md](./SECURITY.md).

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

**Every ending deserves dignity. Honor your venture. Help others learn.**
