# CLAUDE.md — AI Assistant Instructions for SOIL

## Project Context

SOIL (Social Organizational Intelligence Lab) is building a research platform for organizational autopsy data collection. The MVP includes a website, user accounts, interview wizard, cenotaph creation, and 2D cemetery visualization.

**Call me Dima** for all communications.

## Core Instructions (From Global CLAUDE.md)

1. **Plan before coding** - Never write code without a user-approved plan
2. **Search for root causes** - Understand why problems occur before fixing
3. **Simplify solutions** - Minimize complexity; build MVPs with core functionality
4. **Be radically honest** - Admit when something doesn't work; don't fake success
5. **Test thoroughly** - Check everything twice; don't celebrate until verified
6. **Avoid over-engineering** - Only make requested changes; don't add unwanted features
7. **Use Playwright for testing** - For frontend testing when available
8. **Minimize git commit messages** - Use backtick escaping in GitHub issues
9. **Request JSON format** - For GitHub issue data: `gh ... --json title,body,comments`
10. **Database checks** - Always verify table structure before migrations/scripts
11. **No `as any` type casting** - Avoid TypeScript escape hatches
12. **Real testing** - No mocking for integration/E2E tests; test real queries, APIs, connections
13. **Simplify code** - Reduce size, increase transparency and maintainability

## SOIL-Specific Conventions

### Technology Stack
- **Frontend**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + Design System (provided by Dima)
- **Backend**: Next.js API Routes initially, Supabase for database/auth
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel
- **Testing**: Playwright for E2E tests

### Repository Structure
- **Repo**: Private at `https://github.com/ertad-family/soil`
- **Branches**:
  - `main` - Production-ready code (protected)
  - `develop` - Integration branch
  - `feature/xxx` - Feature branches
  - `release/x.x.x` - Release branches
  - `hotfix/xxx` - Hotfix branches

### MVP Components (Priority Order)

**Phase 1 (P0 - Core):**
1. Mother website with section navigation (Cenotaphery, Research, Diagnostics, Education, Clinic)
2. User account page (profile, settings, data)
3. Interview Framework & Wizard (6-step process for data intake)
4. Cenotaph creation flow (with 3D/visual preview)

**Phase 2 (P1 - Discovery):**
5. Searchable/filterable cenotaph directory
6. 2D Cenotaphery visualization
7. Individual cenotaph detail pages

### Data Model (Simplified for MVP)

**Users**
- id, email, password (via Supabase Auth)
- name, location, role
- created_at, updated_at

**Cenotaphs**
- id, user_id (founder)
- name, description, organization_type
- founded_date, closed_date
- status (draft, partial, complete, verified, public)
- data (structured JSON from wizard)
- visibility (private, anonymous, public)
- created_at, updated_at

**Interview Data** (within cenotaph.data JSON)
- basic_info, functional_mapping, financial, timeline, environment, founder_context, narrative
- respects_earned, respects_spent
- verification_status, verified_by (array of user_ids)

### Design System (To Be Provided)

Awaiting design system from Dima before implementing UI components. Will integrate Tailwind tokens once received.

### Code Style

- Use TypeScript; prefer explicit types
- Component organization: small, focused, reusable components
- Hooks over class components
- API routes in `src/app/api/`
- Utilities in `src/lib/`
- Custom hooks in `src/hooks/`
- Type definitions in `src/types/`

### Testing

- E2E tests with Playwright
- Focus on real user flows, not implementation details
- Test actual Supabase queries and API endpoints
- No mocking of database or API calls

### Security Considerations

- All user data is private by default
- Founder owns their cenotaph data
- Financial data never shown publicly (only anonymized aggregates)
- Verification required before public visibility
- API rate limiting for production
- HTTPS only
- Secure session handling via Supabase

### Communication

- Keep responses concise; we're in a CLI environment
- Use markdown for formatting
- Reference file locations as `file_path:line_number` when relevant
- Explain your reasoning; don't skip context
- Ask for clarification if requirements are ambiguous

---

## When to Use Tasks/Agents

- **Explore agent**: For exploring the codebase, answering "where is X" questions
- **Plan agent**: For designing implementation strategy for complex features
- **General-purpose agent**: For multi-step research tasks
- **claude-code-guide**: For questions about Claude Code features (if using that)

## Getting Help

If stuck:
1. Re-read the relevant documentation (docs/ folder)
2. Check SOIL_Master_Strategy_v3.md for context
3. Ask Dima for clarification
4. Use Bash to explore and test locally

---

**Last Updated**: December 10, 2025
**Project Phase**: MVP Development
**Design System**: Pending
