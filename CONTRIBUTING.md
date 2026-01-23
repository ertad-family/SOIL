# Contributing to SOIL

Thank you for your interest in contributing to SOIL! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/SOIL.git`
3. Install dependencies: `npm install`
4. Copy environment template: `cp .env.example .env.local`
5. Create a branch from `develop`: `git checkout -b your-feature develop`
6. Start the dev server: `npm run dev`

## Development Workflow

### Branch Strategy

- `main` — production releases only
- `develop` — primary development branch (base your work here)
- `feature/*` — new features
- `fix/*` — bug fixes

### Before Submitting a PR

```bash
npm run lint         # Check for linting errors
npm run typecheck    # Verify TypeScript types
npm run build        # Ensure production build passes
npm run test:e2e     # Run E2E tests (requires Playwright browsers)
```

Pre-commit hooks (Husky + lint-staged) will automatically format your code with Prettier on commit.

### Pull Request Process

1. Create your PR against the `develop` branch
2. Provide a clear description of what your changes do and why
3. Ensure all checks pass (lint, typecheck, build)
4. Keep PRs focused — one feature or fix per PR

## Code Conventions

- **TypeScript** — strict mode, avoid `as any` type assertions
- **Formatting** — handled automatically by Prettier on commit
- **Components** — React functional components with TypeScript props
- **Styling** — Tailwind CSS utility classes, use `cn()` helper for conditional classes
- **File naming** — PascalCase for components, kebab-case for utilities and routes

## Project Structure

See [README.md](./README.md#project-structure) for the directory layout.

Key patterns:

- Pages live in `src/app/` following Next.js App Router conventions
- Reusable UI components go in `src/components/ui/`
- Page-specific sections go in `src/components/sections/`
- 3D components use React Three Fiber in `src/components/three/`

## Reporting Issues

- Use [GitHub Issues](https://github.com/ertad-family/SOIL/issues) to report bugs or request features
- Check existing issues before creating a new one
- Include reproduction steps for bugs

## Questions?

Reach out at community@soilplatform.org or open a discussion on GitHub.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
