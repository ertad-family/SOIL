# Design System Development Task

## Overview

Create a comprehensive design system for the SOIL (Social Organizational Intelligence Lab) MVP platform, including all UI components, design tokens, and complete wireframes/mockups for every required page.

**Project**: SOIL MVP Development
**Status**: READY FOR DESIGN
**Timeline**: To be scheduled

---

## Deliverables

### 1. Design System Documentation

#### 1.1 Design Tokens
- Color palette (primary, secondary, accent, semantic colors)
- Typography system (font families, sizes, weights, line heights)
- Spacing scale (margins, padding, gaps)
- Border radius values
- Shadows and elevation system
- Animation/transition easing and timing

#### 1.2 Component Library
Complete specifications for all UI components:

**Base Components:**
- Button (primary, secondary, tertiary, ghost, loading states)
- Input fields (text, email, number, textarea)
- Select/Dropdown
- Checkbox & Radio buttons
- Toggle switches
- Date picker
- File upload
- Links & Navigation

**Complex Components:**
- Cards
- Modals/Dialogs
- Toast notifications
- Breadcrumbs
- Tabs
- Accordion
- Progress indicators
- Spinner/Loader
- Badges
- Tags
- Tooltips
- Pagination

**Form Components:**
- Form layout patterns
- Error states & validation feedback
- Success states
- Loading states
- Required field indicators

**Navigation Components:**
- Header/Navigation bar
- Sidebar navigation
- Footer
- Mobile menu
- Tab navigation

#### 1.3 Layout Patterns
- Authentication layout (login, signup)
- Dashboard layout
- Main content layout (with sidebar)
- Modal/overlay patterns
- Empty state patterns
- Error page patterns

---

### 2. Complete Wireframes & Mockups

All wireframes should include:
- Desktop version (1440px minimum)
- Tablet version (768px)
- Mobile version (375px)
- Interactive annotations for interactions/transitions
- State variations (default, hover, active, disabled, loading, error)

#### 2.1 Public/Marketing Pages

**1. Landing Page**
- Hero section with CTA
- Problem/Solution section
- Key features/sections overview
- Call-to-action buttons
- Navigation to platform

**2. About Page**
- SOIL mission & vision
- The problem we're solving
- How it works (simple explanation)
- Contact/CTA

**3. Pricing/Sections Overview Page**
- Overview of Cenotaphery, Research Center, Diagnostics, Education, Clinic
- Features of each section
- CTA to sign up/explore

#### 2.2 Authentication Pages

**4. Login Page**
- Email input
- Password input
- "Remember me" checkbox
- "Forgot password" link
- Sign up link
- Error states

**5. Sign Up Page**
- Email input
- Password input
- Confirm password input
- Name input
- Location selector
- Role selector
- Terms acceptance
- Sign in link
- Validation states

**6. Forgot Password Page**
- Email input
- Submit button
- Back to login link
- Success state

**7. Reset Password Page**
- Password input
- Confirm password input
- Submit button
- Success state

#### 2.3 Platform Pages (Authenticated)

**8. Dashboard/Home**
- Welcome message personalized to user
- Current cenotaph status (if exists)
- Quick actions (Create new cenotaph, View directory, etc.)
- Recent activity feed
- Navigation to sections

**9. User Account Page**
- Profile information (name, email, location, role)
- Edit profile form
- Password change form
- Account settings (notifications, privacy)
- Data export option
- Delete account option

**10. Create Cenotaph - Step 0: Basic Info**
- Organization name input
- One-sentence description
- Organization type selector (dropdown/buttons)
- Business model selector (conditional on type)
- Industry selector
- Location (country + city)
- Timeline: Founded date, Closed date
- Founder role selector
- Visibility preference (anonymous, pseudonym, public)
- Contact email
- Save draft / Begin wizard buttons
- Progress indicator

**11. Create Cenotaph - Step 1: Functional Mapping**
- Functions list for organization type
- For each function:
  - Did you have this function? (toggle)
  - Who performed it? (in-house, outsourced, hybrid)
  - If in-house: headcount, FTE%, owner type
  - If outsourced: provider type
  - Formalization level (dropdown)
  - When started/stopped (stage selectors)
  - Satisfaction rating (1-5 scale)
  - Issue description (if satisfaction ≤3)
- Health check per function (turnover, staffing, budget, quality, leadership, conflicts)
- Add custom function option
- Save progress / Next step buttons
- Progress indicator

**12. Create Cenotaph - Step 2: Financial Picture**
- File upload area for financial documents
- Financial metrics by organization type (ranges)
- Dynamics: revenue, burn, runway, margin trends
- Financial events timeline builder
- Add event modal with categories and impacts
- Therapeutic messaging
- Save progress / Next step buttons
- Progress indicator

**13. Create Cenotaph - Step 3: Dynamic Picture (Timeline)**
- Pattern detection results (if applicable)
- Targeted questions based on patterns
- Events timeline builder
- Add event card with:
  - Category selector
  - Sub-category options
  - Date picker
  - Emotion selector (emoji-based)
  - Retrospective reflection selectors
  - Details text area
- Events displayed as timeline
- Save progress / Next step buttons
- Progress indicator

**14. Create Cenotaph - Step 4: Environment Analysis**
- Resources assessment section:
  - For each resource: availability, cost, competition (at peak and trends)
  - Optional: What changed?
- External events timeline builder
- Add event card with:
  - Category selector
  - Sub-category options
  - Date picker
  - Emotion selector
  - Retrospective reflection
  - Response options (checkboxes)
  - Details
- Save progress / Next step buttons
- Progress indicator

**15. Create Cenotaph - Step 5: Founder Context**
- Before it began: experience level, readiness
- The beginning: timing, co-founders
- Along the way: motivation evolution, relationship dynamics
- The cost: health, relationships, finances impacts
- Now: time since closure, current feeling
- Personal events timeline builder
- Add event card with category, impact, adaptation, reflection
- Save progress / Next step buttons
- Progress indicator

**16. Create Cenotaph - Step 6: Narrative**
- Format selector: text responses, AI interview, or human interview
- Core questions displayed one or two at a time
- Large text areas for responses
- Submit button
- Completion celebration screen with:
  - 3D preview of cenotaph
  - Summary statistics
  - Personalized message
  - Make public / Keep private / Edit options

#### 2.4 Discovery Pages

**17. Cenotaph Directory**
- Search bar
- Filter sidebar:
  - Organization type
  - Industry
  - Location (country/city)
  - Time period (founded/closed dates)
  - Funding stage
  - Team size
  - Status (draft, complete, verified, public)
- Results grid/list view toggle
- Individual cenotaph cards showing:
  - Organization name
  - Dates (founded - closed)
  - Industry & location
  - Brief description
  - Team size peak
  - Status badge
  - Respects count
  - Link to detail page
- Pagination / Load more
- Empty state when no results
- Sort options (relevance, newest, most respected, most viewed)

**18. Cenotaph Detail Page**
- Cenotaph header with 3D/visual monument preview
- Organization name, dates, location
- Description
- Status badge, Respects count, views count
- Navigation tabs for sections:
  - Overview
  - Functional Analysis
  - Financial Story
  - Timeline
  - Environment
  - Founder Story
  - Data & Insights
- Each tab shows relevant structured data in readable format
- Respects button (Pay respects)
- Share buttons (LinkedIn, Twitter, Copy link)
- Contact founder button (if public) - shows mentor availability
- Related cenotaphs section

#### 2.5 Section Pages

**19. Cenotaphery Page**
- Explanation of what cenotaphery is
- 2D visualization area (placeholder for interactive map)
- Search/filter for cenotaphs
- Recent cenotaphs list/carousel
- Statistics (total cenotaphs, countries, industries)
- Create cenotaph CTA

**20. Research Center Page**
- Overview of research mission
- Featured research findings / case studies
- Research statistics (cenotaphs analyzed, patterns found)
- Latest publications
- Subscribe to research updates
- Data access inquiry form

**21. Diagnostics Center Page**
- Coming soon / Placeholder
- Explanation of diagnostic services (future)
- Get notified when available
- Link to research

**22. Educational Institute Page**
- Coming soon / Placeholder
- Future certification programs
- Get notified
- Link to research

**23. Clinic Page**
- Coming soon / Placeholder
- Future consultation services
- Get notified
- Link to research/founder community

#### 2.6 Special Pages

**24. 404 Error Page**
- Clear error message
- Navigation options (home, search, contact)
- Illustration or thematic image

**25. 500 Error Page**
- Error message
- Support contact
- Retry option

**26. Loading/Skeleton States**
- Skeleton loading patterns for all content types
- Loading spinners
- Placeholder animations

---

## Design Requirements

### Visual Style
- **Aesthetic**: Japanese zen garden aesthetic (warm, minimal, peaceful)
- **Tone**: Dignified, respectful, therapeutic (never cynical or exploitative)
- **Color Approach**: Warm tones, not cold/dark
- **Architecture**: Monumentality combined with minimalism
- **Audio**: Ambient peaceful atmosphere (indicate audio elements in design)

### Interaction Patterns
- Smooth transitions between steps
- Clear progress indicators
- Encouraging, affirmative microcopy
- Responsive to all screen sizes
- Accessibility standards (WCAG 2.1 AA minimum)
- Dark mode support (optional, indicate in design)

### Component States
Every component must include:
- Default state
- Hover state
- Active state
- Disabled state
- Loading state (if applicable)
- Error state (if applicable)
- Focus state (for accessibility)

### Responsiveness Breakpoints
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1440px (standard desktop)
- Large desktop: 1920px+ (if applicable)

---

## Deliverable Format

### Design Files
- Figma link (preferred) or similar design tool (Adobe XD, Sketch)
- All components organized in a library
- Pages organized by section
- Design tokens documented in Figma/tool
- Interactive prototypes for key flows:
  - Sign up flow
  - Create cenotaph flow
  - Directory search flow

### Documentation
- Design system guide (exported)
- Component specifications document
- Typography specifications
- Color palette guide
- Spacing & sizing guide
- Animation/transition specifications

### Wireframe/Mockup Specifications
- High-fidelity mockups (not just wireframes)
- All interactive states documented
- Annotations for:
  - Interaction behavior
  - Transitions/animations
  - Responsive behavior
  - Validation patterns
  - Error handling

---

## Acceptance Criteria

- [ ] All 26+ required pages have complete high-fidelity mockups
- [ ] Desktop, tablet, and mobile versions for all pages
- [ ] All component states (default, hover, active, disabled, loading, error) documented
- [ ] Design tokens extracted and organized
- [ ] Figma/design tool file shared and well-organized
- [ ] Design system documentation provided
- [ ] Interactive prototypes for key user flows
- [ ] Responsive behavior clearly indicated
- [ ] Accessibility considerations documented
- [ ] Dark mode (or reasoning if not included)
- [ ] Animation/transition specifications included
- [ ] Ready for developer handoff

---

## Notes for Designer

1. **Therapeutic Focus**: Every page should convey dignity, respect, and care. Users are memorializing their failed organizations—tone matters.

2. **Data-Heavy Pages**: The interview wizard pages (steps 1-6) are complex with lots of conditional logic. Mockups should show all main state variations.

3. **Progressive Disclosure**: The wizard should feel like steps forward, not overwhelming forms. Visual feedback is critical.

4. **Community Aspect**: Design should encourage sharing and connection, but respect privacy (anonymous options).

5. **Future-Proof**: Design should accommodate future additions (Research Center findings, Diagnostics services, etc.)

6. **Consistency**: Use consistent patterns across all forms, inputs, and interactions for predictability.

---

## Questions for Designer

- Preferred design tool? (Figma, Adobe XD, Sketch, etc.)
- Should dark mode be included?
- Any specific typefaces in mind, or should we use system fonts?
- Should 3D cenotaph previews be realistic, abstract, or stylized?
- Any inspiration or reference designs we should consider?

---

**Created**: December 10, 2025
**Project**: SOIL MVP
**Status**: Ready for Design Phase
