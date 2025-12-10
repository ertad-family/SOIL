# SOIL: Simplified Economic Model v2

**Project:** SOIL (Social Organizational Intelligence Lab)  
**Date:** December 2025  
**Status:** Design specification  
**Supersedes:** orgsoleum_economic_model.md

---

## Executive Summary

This document describes a radically simplified economic model for SOIL, replacing the complex dual-currency system with floating exchange rates. The new model focuses on a single currency (Respects) earned through valuable platform actions and spent on cenotaph customization.

**Key Changes from v1:**
- ❌ Removed: Days as separate currency
- ❌ Removed: Decay mechanism (cenotaphs live forever)
- ❌ Removed: Floating exchange rates
- ❌ Removed: Regional micro-economies
- ❌ Removed: M2 supply tracking
- ✅ Kept: Respects as gamification currency
- ✅ Kept: Earning through valuable actions
- ✅ Kept: Spending on customization

**Core Philosophy:** Make the game about building a beautiful memorial and contributing to research, not about managing a complex economy.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [The Respects Currency](#2-the-respects-currency)
3. [Earning Respects: Target Actions](#3-earning-respects-target-actions)
4. [Spending Respects](#4-spending-respects)
5. [Progression System](#5-progression-system)
6. [Premium Features (Fiat)](#6-premium-features-fiat)
7. [Implementation Roadmap](#7-implementation-roadmap)

---

## 1. Design Principles

### 1.1 Why We Simplified

The original economic model was academically interesting but created problems:

| Problem | Impact |
|---------|--------|
| **Cognitive overload** | Founders grieving their company don't want to learn monetary policy |
| **Implementation complexity** | Regional micro-economies require constant monitoring |
| **Unpredictable value** | "How much is my Respect worth?" — depends on 5 variables |
| **Decay contradicts mission** | "Every ending deserves dignity" — but your memorial dies if ignored? |
| **Barrier to entry** | Complex systems discourage participation |

### 1.2 New Principles

**1. One Currency, Fixed Value**
- 1 Respect = 1 Respect, always
- No conversion rates to track
- Clear, predictable pricing

**2. Eternal Existence, Visual Aging**
- Cenotaphs never disappear or become inaccessible
- Visual aging reflects passage of time (weathering, vegetation)
- Visits naturally slow aging (community maintenance)
- Restoration possible via Respects

**3. Earn Through Value, Gift to Appreciate**
- Respects earned by actions valuable to platform
- Respects can be gifted to cenotaphs you appreciate
- New users get starter Respects to participate immediately

**4. Unique Design is Permanent**
- Monument design created during cenotaph creation
- Design becomes part of cenotaph identity
- Cannot be changed (affects prominence and recognition)
- Redesign available only as premium paid service

**5. Customization, Not Survival**
- Spend Respects to enhance aesthetics
- Spend Respects to restore from aging
- No spending required to "keep it alive"
- Optional enhancement, not mandatory maintenance

**6. Transparent Simplicity**
- All prices visible and fixed
- No hidden mechanics
- Easy to understand in 30 seconds

---

## 2. The Respects Currency

### 2.1 Nature

Respects are the single in-platform currency, earned through valuable actions and spent on cenotaph customization or gifted to other cenotaphs.

**Characteristics:**
- **Fixed value**: 1 Respect = 1 Respect (no exchange rates)
- **Earned primarily**: Main source is valuable platform actions
- **Giftable**: Can be paid to other cenotaphs (not your own)
- **Non-expiring**: Respects never decay or expire
- **Account-bound**: Cannot be traded for money or withdrawn

### 2.2 Gifting Respects

Users can pay Respects to cenotaphs they appreciate (but not to their own):

**From Respects balance:**
- Any user with Respects can gift them to any cenotaph (except their own)
- Minimum gift: 1 Respect
- No maximum limit

**From fiat (USD):**
- Any user (even without Respects balance) can purchase Respects to gift to a specific cenotaph
- Pricing: TBD
- Cannot purchase Respects for your own cenotaph
- Cannot purchase Respects to keep (only to gift immediately)

**New User Welcome Bonus:**
- Every new user receives **10 Respects** upon registration
- These can only be gifted to other cenotaphs (not spent on own customization)
- Encourages exploration and community participation from day one

### 2.3 Display

```
┌─────────────────────────────────────────────────┐
│ Your Balance: 💎 847 Respects                   │
│                                                 │
│ Recent activity:                                │
│ +100  Completed Financial Wizard                │
│ +75   Verified by 3 colleagues                  │
│ +25   Received gift from @founder_jane          │
│ -150  Upgraded materials (marble)               │
│ -10   Gifted to "TechStartup Inc" cenotaph      │
└─────────────────────────────────────────────────┘

Cenotaph view:
┌─────────────────────────────────────────────────┐
│ 💎 This cenotaph received 234 Respects          │
│    from 47 visitors                             │
│                                                 │
│ [Pay Respects 💎]                               │
└─────────────────────────────────────────────────┘
```

---

## 3. Earning Respects: Target Actions

### 3.1 Action Categories

SOIL needs users to perform specific actions that advance platform goals. Respects rewards are calibrated to incentivize these actions.

**Category A: Data Contribution** — Primary platform fuel
**Category B: Verification & Trust** — Research integrity
**Category C: Growth & Virality** — Platform expansion
**Category D: Community Building** — Ecosystem health
**Category E: Longitudinal Data** — Ongoing research value

### 3.2 Category A: Data Contribution

*Why it matters: Core autopsy data is SOIL's primary asset*

| Action | Respects | Notes |
|--------|----------|-------|
| Complete Basic Info | 50 | Minimal viable cenotaph |
| Complete Wizard 1: Functional | 100 | Organizational structure |
| Complete Wizard 2: Financial | 100 | Financial patterns |
| Complete Wizard 3: Dynamic | 100 | Timeline & events |
| Complete Wizard 4: Environment | 75 | External context |
| Complete Wizard 5: Founder | 75 | Personal perspective |
| Complete Wizard 6: Narrative | 150 | Full story & lessons |
| **Total for full completion** | **650** | |

**Bonus Actions (Data Enrichment):**

| Action | Respects | Notes |
|--------|----------|-------|
| Upload supporting documents | +50 | Financial statements, pitch decks, etc. |
| Add 10+ timeline events | +50 | Rich event data |
| Add 20+ timeline events | +50 | Extra rich data |
| Complete in single session | +50 | Higher quality, less fragmentation |

### 3.3 Category B: Verification & Trust

*Why it matters: Research requires verified, trustworthy data*

| Action | Respects | Notes |
|--------|----------|-------|
| Get verified by 1 colleague | +25 | First verification |
| Get verified by 3 colleagues | +75 | Verification threshold (total, not additional) |
| Get verified by 5+ colleagues | +125 | High trust (total) |
| Upload incorporation documents | +50 | Legal verification |
| Upload dissolution documents | +50 | Closure verification |
| Verify another founder's cenotaph | +15 | Help others verify |
| Complete multi-perspective autopsy* | +200 | Premium research data |

*Multi-perspective autopsy: Founder facilitates interviews with 2+ former employees/stakeholders, providing multiple viewpoints on the same organization.

### 3.4 Category C: Growth & Virality

*Why it matters: Platform needs scale to achieve research goals*

| Action | Respects | Notes |
|--------|----------|-------|
| Share cenotaph on LinkedIn | +25 | One-time per platform |
| Share cenotaph on Twitter/X | +25 | One-time per platform |
| Share memorial card | +15 | Shareable visual artifact |
| Referral: invited user starts cenotaph | +50 | User creates Basic Info |
| Referral: invited user completes cenotaph | +100 | Additional on completion |
| Referral: invited user goes public | +50 | Additional if public |
| Featured in external press/media | +100 | Verified media mention |

**Referral Tiers:**
```
You → User A creates cenotaph    = +50
User A completes cenotaph        = +100 (additional)
User A goes public               = +50 (additional)
────────────────────────────────────────
Maximum per referral             = 200 Respects
```

### 3.5 Category D: Community Building

*Why it matters: Sustainable ecosystem requires active community*

| Action | Respects | Notes |
|--------|----------|-------|
| Make cenotaph public | +100 | Contributes to public dataset |
| Write helpful comment on another cenotaph | +10 | Moderated, quality only |
| Receive "helpful" votes on comment | +5/vote | Max 50 per comment |
| Accept mentorship request | +25 | Connect with founder seeking help |
| Complete mentorship conversation | +50 | Verified by mentee |
| Receive positive mentorship review | +25 | Quality bonus |
| Attend Day of the Dead Venture event | +50 | Annual community gathering |
| Attend local meetup | +25 | Regular community events |
| Speak at meetup (public cenotaph owners) | +100 | Share your story |

### 3.6 Category E: Longitudinal Data

*Why it matters: Research benefits from updates over time*

| Action | Respects | Notes |
|--------|----------|-------|
| 6-month reflection update | +50 | How perspectives changed |
| 1-year anniversary update | +75 | Deeper reflection |
| "What I'd do differently" addition | +50 | Hindsight insights |
| Update with outcome data | +50 | What happened to team, IP, etc. |
| Connect to successor organization | +50 | Link if company pivoted/restarted |

### 3.7 Summary: Earning Potential

**Minimum viable cenotaph:** 50 Respects (Basic Info only)

**Typical complete cenotaph:** ~800-1,000 Respects
- Full wizard completion: 650
- Verification (3 colleagues): 75
- Public visibility: 100
- Some sharing: 50-75

**Maximum engaged founder:** ~2,000+ Respects
- Full completion with bonuses: ~900
- High verification: 125
- All social sharing: 150
- Multiple referrals: 400+
- Community participation: 200+
- Longitudinal updates: 225

---

## 4. Spending Respects

### 4.1 Philosophy

Spending Respects is used for two purposes:
1. **Customization** — making your cenotaph more beautiful and personal
2. **Anti-Aging** — restoring cenotaphs that have aged over time

**Key principles:**
- You cannot buy a complete-looking cenotaph — structure comes from data completion
- Monument design is created during cenotaph creation (part of UX) — it's unique and permanent
- Respects buy aesthetics and maintenance, not fundamental design

### 4.2 Aging Mechanics

Cenotaphs age over time, reflecting the passage of time in a dignified way.

**How aging works:**
- Every day, cenotaph age increases by 1
- Visual aging manifests as: weathering, patina, moss/lichen growth, overgrown vegetation, fallen leaves, dust accumulation
- Aging is aesthetic — the cenotaph never disappears or becomes inaccessible

**Natural anti-aging: Visits**
- Visits slow down visible aging
- More visits = slower aging (as if the memorial is being "maintained" by visitors)
- Popular cenotaphs may never show significant aging
- The exact formula: TBD

**Visual aging stages:**

| Age Stage | Visual Signs |
|-----------|--------------|
| Fresh (0-30 days) | Pristine, as designed |
| Settled (30-180 days) | Slight patina, natural settling |
| Mature (180-365 days) | Dignified weathering, some moss |
| Aged (1-3 years) | Significant weathering, vegetation growth |
| Ancient (3+ years) | Heavy aging, possible overgrowth, "ruins" aesthetic |

**Respects for restoration:**
- Founders (or supporters via gifted Respects) can restore cenotaph to earlier visual state
- Restoration is temporary — aging continues after restoration
- Creates ongoing engagement loop

| Restoration Level | Cost | Effect |
|-------------------|------|--------|
| Light cleanup | 25 | Remove recent weathering |
| Full restoration | 100 | Return to "Fresh" state |
| Permanent preservation* | 500 | Freeze at current visual age |

*Permanent preservation stops visible aging indefinitely but can be purchased only once.

### 4.3 Customization Categories

**Important:** Monument design (style, form) is created during cenotaph creation and cannot be changed. The design becomes part of the cenotaph's identity and affects its prominence — memorable designs attract visitors who want to share them. Changing the design would break this social contract.

For redesign, there is a premium paid service (see §6).

#### Materials
*Surface texture and appearance — applied to existing design*

| Option | Cost | Description |
|--------|------|-------------|
| Stone | Default | Basic dignified material |
| Marble | 150 | Elegant white/veined |
| Granite | 150 | Solid, permanent feel |
| Obsidian | 200 | Dark, striking appearance |
| Bronze accents | 100 | Metallic highlights |
| Glass elements | 150 | Modern, luminous |

#### Environmental Elements
*Surrounding landscape and atmosphere*

| Option | Cost | Description |
|--------|------|-------------|
| Bare ground | Default | Simple, dignified |
| Garden | 75 | Flowers and plants |
| Trees | 100 | One or two trees |
| Water feature | 150 | Small pond or fountain |
| Seasonal variants | 50 | Spring/Summer/Autumn/Winter lock |
| Night mode | 75 | Moonlit atmosphere |

#### Decorative Elements
*Personal touches and symbols*

| Option | Cost | Description |
|--------|------|-------------|
| Candles | 25 | Perpetual flame effect |
| Flowers | 25 | Flower arrangements |
| Industry symbols | 50 | Tech, food, healthcare, etc. |
| Custom symbol | 100 | Upload your own icon |
| Founder artifact | 75 | Personal item representation |
| Company logo integration | 100 | Logo carved into monument |

#### Lighting & Effects
*Atmosphere and mood*

| Option | Cost | Description |
|--------|------|-------------|
| Standard | Default | Natural daylight |
| Spotlight | 75 | Dramatic lighting |
| Dawn/Dusk | 100 | Golden hour atmosphere |
| Ambient glow | 100 | Soft ethereal light |
| Particle effects | 150 | Floating light particles |

#### Audio
*Sound ambiance (visitor hears when viewing)*

| Option | Cost | Description |
|--------|------|-------------|
| Silence | Default | Peaceful quiet |
| Nature sounds | 75 | Birds, wind, water |
| Ambient music | 100 | Peaceful instrumental |
| Custom audio clip | 150 | Upload 30-second clip |

### 4.4 Spending Summary

| Category | Purpose | Cost Range |
|----------|---------|------------|
| **Anti-Aging** | Restore visual freshness | 25-500 |
| **Materials** | Surface appearance | 100-200 |
| **Environment** | Surrounding landscape | 50-150 |
| **Decorative** | Personal touches | 25-100 |
| **Lighting** | Atmosphere | 75-150 |
| **Audio** | Sound ambiance | 75-150 |

### 4.5 Gifted Respects for Anti-Aging

When visitors gift Respects to a cenotaph, those Respects can be used by:
1. **The cenotaph owner** — to spend on customization or anti-aging
2. **Automatically** — accumulated gifted Respects can auto-trigger restoration at certain thresholds (optional setting)

This creates a community support mechanism where popular cenotaphs are "maintained" by their visitors.

---

## 5. Progression System

### 5.1 Founder Tiers

> ⚠️ **STATUS: TBD.** The founder grading system requires more sophisticated design beyond simple Respects thresholds. Will incorporate multiple dimensions of contribution, expertise, and community standing.

*Placeholder — detailed tier system to be developed.*

### 5.2 Cenotaph Status

Independent of founder tier, each cenotaph has a completion status:

| Status | Requirements | Visual Indicator |
|--------|--------------|------------------|
| **Draft** | Basic Info only | Construction scaffold |
| **Partial** | 1-3 wizards | Partially built monument |
| **Complete** | All 6 wizards | Full monument structure |
| **Verified** | Complete + 3 verifications | Trust badge |
| **Enriched** | Verified + documents/updates | Research value badge |

### 5.3 Achievements

Hidden achievements for engagement and delight:

| Achievement | Trigger | Reward |
|-------------|---------|--------|
| **Night Owl** | Complete step 12am-5am | +25 Respects, badge |
| **Speed Runner** | All wizards in single session | +50 Respects, badge |
| **Storyteller** | 20+ timeline events | +50 Respects, badge |
| **Open Book** | Public within 24h of completion | +50 Respects, badge |
| **Connector** | 3 referrals who complete | +150 Respects, badge |
| **Veteran** | Organization lasted 5+ years | Special monument style unlock |
| **Phoenix** | Started new company after closure | Badge + exclusive community |
| **Mentor** | 5 completed mentorship sessions | Badge + priority matching |
| **Historian** | All longitudinal updates completed | Badge + research credit |

---

## 6. Premium Features (Fiat)

> ⚠️ **STATUS: This section is under development.** Premium services list is not finalized.

### 6.1 Philosophy

Some features require real resources (human time, AI compute, storage) and are offered for fiat payment, completely separate from Respects economy.

**Principle:** Fiat buys services, not in-game advantages.

### 6.2 Premium Services (Draft)

| Service | Price | Description |
|---------|-------|-------------|
| **Therapeutic Course** | $600 | 5 sessions with business psychologist. Full therapy + maximum detail cenotaph creation as outcome |
| **Single Therapy Session** | $150 | 1 session with business psychologist at final wizard step. Therapy + help finalizing cenotaph |
| **Crypt Storage** | TBD | Secure document/code/media preservation |
| **Cenotaph 3D Redesign** | TBD | New AI-generated monument design (initial design is free) |

*Note: Additional premium services may be added as platform develops.*

### 6.3 B2B Services (Separate)

Institutional analytics and research access are priced separately and don't interact with consumer economy:

- **Research Data Access**: Custom pricing based on scope
- **Portfolio Mortality Analysis**: For accelerators/VCs
- **Custom Research Projects**: Academic partnerships

---

## 7. Implementation Roadmap

### Phase 1: MVP

**Focus:** Core earning and spending loop

- [ ] Respects currency system
- [ ] Wizard completion rewards
- [ ] Basic verification rewards
- [ ] Monument style customization
- [ ] Material customization

### Phase 2: Growth

**Focus:** Viral mechanics and community

- [ ] Referral system with tracking
- [ ] Social sharing rewards
- [ ] Community features (comments, votes)
- [ ] Achievement system
- [ ] Founder tier badges

### Phase 3: Engagement

**Focus:** Long-term participation

- [ ] Mentorship program
- [ ] Longitudinal update rewards
- [ ] Premium services
- [ ] Advanced customization options
- [ ] Event participation tracking

### Phase 4: Scale

**Focus:** Ecosystem maturity

- [ ] Full customization catalog
- [ ] Research council for Luminaries
- [ ] B2B analytics integration
- [ ] DAO consideration for governance

---

## Appendix A: Economic Comparison

### Old Model vs New Model

| Aspect | Old Model | New Model |
|--------|-----------|-----------|
| Currencies | 3 (Days, Respects, USD) | 1 (Respects) + fiat for premium |
| Exchange rates | 2 floating rates | None (fixed prices) |
| Regional economies | Yes (per cenotaphery) | No (global) |
| Decay mechanism | Yes (1 Day/day, cenotaph dies) | Visual aging only (never dies) |
| Purchased currency | Yes (Days, Respects) | Respects only as gifts to others |
| Gifting | No | Yes (Respects to cenotaphs) |
| New user bonus | No | Yes (10 Respects) |
| Complexity | High (central bank simulation) | Low (simple earn/spend/gift) |
| User understanding | ~10 minutes to explain | ~30 seconds to explain |

### Removed Components

1. **Days Currency**
   - Was: Protected asset for memorial lifespan
   - Now: Not needed — cenotaphs exist forever

2. **Decay = Death**
   - Was: 1 Day consumed per calendar day, zero = archived
   - Now: Visual aging only, visits slow aging, restoration via Respects

3. **Exchange Rates**
   - Was: Floating Respects↔Days, Visits→Days rates
   - Now: Fixed Respects values for all transactions

4. **Regional Micro-Economies**
   - Was: Each cenotaphery has own M2 and rates
   - Now: Global economy with fixed prices

5. **Visit-Based Currency Generation**
   - Was: Visits generate Days based on exchange rate
   - Now: Visits slow visual aging, contribute to prominence

### New Components

1. **Respects Gifting**
   - Users can gift Respects to cenotaphs they appreciate
   - Fiat can purchase Respects as gifts (not for self)

2. **Welcome Bonus**
   - New users receive 10 Respects
   - Encourages immediate community participation

3. **Visual Aging System**
   - Cenotaphs age visually over time
   - Visits naturally slow aging
   - Respects can restore/preserve appearance

---

## Appendix B: Respects Quick Reference

### Earning Summary

| Category | Max Potential |
|----------|---------------|
| Data Contribution | ~850 |
| Verification | ~325 |
| Growth & Virality | ~400+ |
| Community | ~300+ |
| Longitudinal | ~225 |
| Achievements | ~400+ |
| Welcome Bonus | 10 |
| **Theoretical Maximum** | **~2,500+** |

### Spending Reference

| Category | Range |
|----------|-------|
| Anti-Aging | 25-500 |
| Materials | 100-200 |
| Environment | 50-150 |
| Decorative | 25-100 |
| Lighting | 75-150 |
| Audio | 75-150 |
| **Full Customization** | **~700-1,100** |

---

## Appendix C: Open Questions

1. **Aging formula?** Exact relationship between visits and aging speed. Need to balance so popular cenotaphs stay fresh but unpopular ones don't become ruins too quickly.

2. **Seasonal events?** Limited-time earning opportunities? Double Respects weeks?

3. **Decay for inactive drafts?** Should incomplete cenotaphs (drafts) eventually archive? Different from completed cenotaphs aging.

4. **Gifting limits?** Should there be limits on how many Respects can be gifted per day/week to prevent gaming?

5. **Fiat gift pricing?** What should be the USD price for purchasing Respects as gifts?

6. **Auto-restoration thresholds?** At what gifted Respects level should auto-restoration trigger?

---

*Document Version: 2.0*  
*December 2025*  
*SOIL Economic Model — Simplified*

---

**Summary:** This model replaces complex monetary simulation with straightforward gamification. Founders earn Respects by contributing value (data, verification, growth, community), receive Respects as gifts from appreciators, and spend them on customization and anti-aging. Visual aging replaces fatal decay — cenotaphs never disappear but may weather over time unless maintained by visits or Respects. Design is permanent, created during cenotaph creation. Simplicity enables focus on the core mission: dignified memorials and research data collection.
