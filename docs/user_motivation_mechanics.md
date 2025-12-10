# SOIL: User Motivation Mechanics

**Document:** Motivation & Engagement System  
**Project:** SOIL (Social Organizational Intelligence Lab)  
**Date:** December 2025  
**Status:** Design specification

---

## Overview

This document describes the motivation mechanics designed to maximize completion rate of the autopsy process while maintaining therapeutic value and data quality.

### Core Principles

1. **Every step has standalone value** — founder gets something meaningful, platform gets useful data
2. **Gentle progression** — nudge to next step, never pressure for full completion
3. **Visible rewards** — actions translate to tangible cenotaph building
4. **Social dynamics** — community creates natural motivation
5. **Respect for time** — easy to pause, easy to return

---

## 1. Progressive Disclosure System

### Philosophy

Instead of asking founder to commit to 2-hour process, we invite them to "just one more step." Each step is:
- Completable in 15-20 minutes
- Valuable on its own
- Visually rewarded
- Gateway to next step

### Wizard Flow with Value Proposition

| Step | Time | Founder Gets | Platform Gets |
|------|------|--------------|---------------|
| **Basic Info** | 5 min | Cenotaph draft exists | Basic record |
| **Wizard 1: Functional** | 30-40 min | Org structure visualization | Functional snapshot |
| **Wizard 2: Financial** | 15-20 min | Financial health summary | Financial patterns |
| **Wizard 3: Dynamic** | 20-30 min | Timeline visualization | Event data |
| **Wizard 4: Environment** | 15-20 min | Context map | External factors |
| **Wizard 5: Founder** | 15-20 min | Personal reflection | Founder context |
| **Wizard 6: Narrative** | 20-30 min | Complete cenotaph + closure | Full story |

### Post-Step Screen Template

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ✓ [Completion message]                        │
│                                                 │
│  [Visualization of what was just created]      │
│                                                 │
│  [Personalized insight or affirmation]         │
│                                                 │
│  ─────────────────────────────────────────     │
│                                                 │
│  [Next step teaser - what it unlocks]          │
│  ([Time estimate])                             │
│                                                 │
│  [Continue →]                                  │
│                                                 │
│  [Schedule next session 📅]  [I'm done for now]│
│                                                 │
└─────────────────────────────────────────────────┘
```

### Return Flow

When founder returns:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Welcome back.                                 │
│                                                 │
│  [Organization Name]                           │
│                                                 │
│  ✓ Basic Info                                  │
│  ✓ Structure mapped                            │
│  ✓ Financial picture                           │
│  ○ Timeline                    ← You are here  │
│  ○ Environment                                 │
│  ○ Your story                                  │
│  ○ Meaning & lessons                           │
│                                                 │
│  [Continue where you left off →]               │
│                                                 │
│  Or jump to any section                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 2. Hybrid Cenotaph Building System

### Philosophy

The cenotaph visually reflects completion status. You cannot buy a complete-looking cenotaph — you must earn it through data contribution. But you CAN customize its beauty through Respects.

### Structure = Data Completeness (Cannot Be Bought)

| Wizard | Unlocks Structure Element |
|--------|---------------------------|
| Basic Info | Land plot (место в cenotaphery) |
| Wizard 1: Functional | Foundation + basic monument form |
| Wizard 2: Financial | Financial engravings |
| Wizard 3: Dynamic | Timeline memorial plaque |
| Wizard 4: Environment | Surrounding landscape |
| Wizard 5: Founder | Personal artifacts & symbols |
| Wizard 6: Narrative | Epitaph + final polish |

**Visual progression:**

```
Basic Info    Wizard 1      Wizard 2      Wizard 3
    │             │             │             │
    ▼             ▼             ▼             ▼
   ___          _____        _______      _________
  |   |        |     |      |       |    |         |
  |___|        |_____|      |_______|    |  ████   |
   bare         basic        detailed     + plaque
   plot        monument      engravings   

Wizard 4      Wizard 5      Wizard 6
    │             │             │
    ▼             ▼             ▼
 _________    _________    ___________
|         |  |    ☆    |  |    ☆      |
|  ████   |  |  ████   |  |  ████     |
|_________|  |_________|  |_"Legacy"__|
  🌳   🌳     🌳 📷 🌳     🌳 📷 ✨ 🌳
+ landscape  + personal   + epitaph
             artifacts    + polish
```

### Beauty = Respects (Earned & Spent)

**Earning Respects:**

| Action | Respects |
|--------|----------|
| Complete Basic Info | 50 |
| Complete Wizard 1 | 100 |
| Complete Wizard 2 | 100 |
| Complete Wizard 3 | 100 |
| Complete Wizard 4 | 75 |
| Complete Wizard 5 | 75 |
| Complete Wizard 6 | 150 |
| **Total possible** | **650** |

**Bonus Respects:**

| Action | Respects |
|--------|----------|
| Upload financial documents | +50 |
| Complete in single session | +50 |
| Verify with 3+ colleagues | +75 |
| Make cenotaph public | +100 |
| Refer another founder | +100 |
| Add 10+ events | +50 |

**Spending Respects:**

| Category | Options | Cost Range |
|----------|---------|------------|
| **Materials** | Stone → Marble → Granite → Obsidian | 50-200 |
| **Monument style** | Classic, Modern, Abstract, Cultural | 100-300 |
| **Decorative elements** | Flowers, candles, symbols | 25-75 each |
| **Lighting effects** | Ambient glow, spotlight, dawn/dusk | 50-150 |
| **Landscape** | Trees, water feature, garden | 50-100 each |
| **Audio** | Ambient sound, music snippet | 75-150 |
| **Animation** | Gentle flame, floating particles | 100-200 |

### Visual Differentiation

**Incomplete cenotaph (Wizard 1 only):**
- Basic stone monument
- No engravings
- Bare ground
- Clearly "under construction"

**Complete but uncustomized:**
- Full structure
- All elements present
- Default materials
- Dignified but standard

**Complete and customized:**
- Premium materials
- Personal touches
- Environmental details
- Unique and memorable

---

## 3. Motivation Hooks

### 3.1 Progress Hooks

**Completion percentage with context:**

```
┌─────────────────────────────────────────────────┐
│ Your cenotaph: 47% complete                    │
│ █████████░░░░░░░░░░░░                          │
│                                                 │
│ You're 2 steps away from a complete memorial.  │
│ Average time to finish: 35 minutes.            │
└─────────────────────────────────────────────────┘
```

**Milestone celebrations:**
- 25%: "Foundation laid"
- 50%: "Taking shape"
- 75%: "Almost there"
- 100%: "Complete. Permanent. Meaningful."

---

### 3.2 Live Activity Feed 🥇

**Real-time social proof creates urgency and normalizes participation.**

**Global feed (homepage):**
```
┌─────────────────────────────────────────────────┐
│ LIVE                                    ● 12    │
├─────────────────────────────────────────────────┤
│ 🏛️ A fintech startup in London just went public│
│    2 minutes ago                                │
│                                                 │
│ ✓ Founder in Berlin completed their timeline   │
│    5 minutes ago                                │
│                                                 │
│ 🌱 New cenotaph started: e-commerce, Singapore │
│    8 minutes ago                                │
│                                                 │
│ 💬 "This helped me process 3 years of work"    │
│    — founder who completed today                │
│                                                 │
│ 12 founders are building right now             │
└─────────────────────────────────────────────────┘
```

**Personal dashboard:**
```
┌─────────────────────────────────────────────────┐
│ While you were away:                           │
│                                                 │
│ • 47 founders completed cenotaphs              │
│ • 3 in your industry (SaaS)                    │
│ • 2 in your city (Berlin)                      │
│                                                 │
│ [See their stories]  [Continue yours →]        │
└─────────────────────────────────────────────────┘
```

**Activity types to show:**
- New cenotaph started (anonymous: "A [industry] in [city]")
- Cenotaph went public
- Wizard completed
- Milestone reached
- Quote from completed founder

---

### 3.3 Waiting Audience 🥇🥇

**Show founder that people are looking for their story.**

**Search signals:**
```
┌─────────────────────────────────────────────────┐
│ 👀 People are looking for you                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ This week:                                     │
│ • 3 searches for "[Organization Name]"         │
│ • 12 searches for "[your industry] failures"   │
│ • 5 people viewed similar cenotaphs            │
│                                                 │
│ Your story could help them.                    │
│                                                 │
│ [Continue building →]                          │
└─────────────────────────────────────────────────┘
```

**Similar organization triggers:**
```
┌─────────────────────────────────────────────────┐
│ 💡 A founder in your shoes is looking          │
├─────────────────────────────────────────────────┤
│                                                 │
│ Someone building a [similar company] just      │
│ searched for lessons from [your industry].     │
│                                                 │
│ Complete founders with similar experiences     │
│ get matched for mentorship.                    │
│                                                 │
│ [Finish your story to help them]               │
└─────────────────────────────────────────────────┘
```

**Email trigger:**
> "Someone searched for '[Organization Name]' yesterday. Your cenotaph is 60% complete — finishing it means they'll find your story."

---

### 3.4 Mentorship Unlock 🥇🥇🥇

**The strongest hook: complete your story to help others directly.**

**The promise:**
```
┌─────────────────────────────────────────────────┐
│ 🎓 MENTORSHIP PROGRAM                          │
├─────────────────────────────────────────────────┤
│                                                 │
│ Founders with complete cenotaphs can be        │
│ matched with founders facing similar           │
│ challenges RIGHT NOW.                          │
│                                                 │
│ Your experience with [detected pattern] could  │
│ help someone avoid the same outcome.           │
│                                                 │
│ Requirements:                                   │
│ ✓ Basic Info                                   │
│ ✓ Functional Mapping                           │
│ ✓ Financial Picture                            │
│ ○ Dynamic Picture       ← needed               │
│ ○ Environment           ← needed               │
│ ○ Founder Context       ← needed               │
│ ○ Narrative             ← needed               │
│                                                 │
│ [Complete to unlock mentorship →]              │
└─────────────────────────────────────────────────┘
```

**Post-completion:**
```
┌─────────────────────────────────────────────────┐
│ 🎓 MENTORSHIP UNLOCKED                         │
├─────────────────────────────────────────────────┤
│                                                 │
│ You're now eligible to be matched with         │
│ founders facing:                               │
│                                                 │
│ • Co-founder conflicts (you experienced this)  │
│ • Cash flow crises (you navigated this)        │
│ • [Industry] market shifts                     │
│                                                 │
│ We'll notify you when there's a match.         │
│                                                 │
│ [Set mentorship preferences]                   │
│                                                 │
│ Average: 2-3 mentorship requests per month     │
│ Time commitment: 30 min per conversation       │
└─────────────────────────────────────────────────┘
```

**Match notification:**
> "A founder building [similar company] is facing [challenge you faced]. They'd like 30 minutes of your time. [Accept] [Decline]"

---

### 3.5 Community Thank-Yous

**Show impact of contribution.**

**After completion:**
```
┌─────────────────────────────────────────────────┐
│ Your impact so far:                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ 📊 Your data contributed to 3 research papers  │
│ 👁️ 47 people viewed your cenotaph              │
│ 💬 2 founders said it helped them              │
│                                                 │
│ "Reading about a similar SaaS that faced       │
│  cash flow issues helped me see the signs      │
│  in my own company. Thank you."                │
│  — Anonymous founder, Stockholm                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Email updates (monthly):**
> "Your cenotaph was viewed 23 times this month. One founder wrote: '[quote]'. Your story is helping people."

**Annual impact report:**
```
┌─────────────────────────────────────────────────┐
│ 🎁 YOUR 2025 IMPACT                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ Views: 284                                     │
│ Founders helped: 12 (who told us)              │
│ Research contributions: 5 papers               │
│ Mentorship conversations: 4                    │
│                                                 │
│ You're in the top 15% of contributors.         │
│                                                 │
│ Thank you for honoring [Organization Name]     │
│ and helping others learn.                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 3.6 Easter Eggs (Future)

**Hidden achievements for delight:**

| Achievement | Trigger | Reward |
|-------------|---------|--------|
| **Night Owl** | Completed step between 12am-5am | +25 Respects, badge |
| **Speed Runner** | Completed all wizards in single session | +50 Respects, badge |
| **Storyteller** | Added 20+ events | +50 Respects, badge |
| **Open Book** | Made cenotaph public within 24h | +50 Respects, badge |
| **Connector** | Referred 3 founders who completed | +150 Respects, badge |
| **Veteran** | Organization lasted 5+ years | Special monument style |
| **Phoenix** | Started another company after closure | Badge + founder circle access |

**Discovery moment:**
```
┌─────────────────────────────────────────────────┐
│ 🏆 ACHIEVEMENT UNLOCKED                        │
│                                                 │
│ "Night Owl"                                    │
│ Completed a step between midnight and dawn     │
│                                                 │
│ +25 Respects                                   │
│ Badge added to your profile                    │
│                                                 │
│ Some stories need quiet hours.                 │
│                                                 │
│ [Continue]                                     │
└─────────────────────────────────────────────────┘
```

---

### 3.7 Calendar Integration

**After each wizard step, offer scheduling:**

```
┌─────────────────────────────────────────────────┐
│ ✓ Step complete                                │
│                                                 │
│ Schedule your next session?                    │
│                                                 │
│ The next step ([Wizard name]) takes ~[X] min.  │
│                                                 │
│ [Tomorrow, same time]                          │
│ [This weekend]                                 │
│ [Pick a time...]                               │
│                                                 │
│ [Skip — I'll come back when ready]             │
└─────────────────────────────────────────────────┘
```

**Calendar event includes:**
- Link directly to next wizard
- Time estimate
- Motivational note

**Calendar invite content:**
```
Title: Continue [Organization Name]'s story
Time: [Selected time], 20 min

Next step: [Wizard name]
"[Teaser about what you'll capture]"

[Direct link to continue]

---
"Every ending deserves dignity."
```

**Reminder email (1 hour before scheduled time):**
> "Your session for [Organization Name] starts in 1 hour. Ready to add the next layer? [Start now →]"

**If missed:**
> "You scheduled time for [Organization Name] yesterday. Still want to continue? [Reschedule] [Continue now]"

---

## 4. Notification Strategy

### Email Cadence (for incomplete cenotaphs)

| Day | Message |
|-----|---------|
| Day 1 | "Your cenotaph is started. Ready for the next step?" |
| Day 3 | "[N] founders completed today. Continue yours?" |
| Day 7 | "Your cenotaph is [X]% complete. [X] minutes to finish." |
| Day 14 | "[N] people searched for [industry] stories this week." |
| Day 21 | Waiting audience hook (if search data exists) |
| Day 30 | "Just checking in. Your progress is saved." |
| Day 60 | "Some stories take time. We're here when you're ready." |
| Day 90 | "Final reminder: drafts archive in 30 days." |

### Push Notification Triggers (if enabled)

| Trigger | Message |
|---------|---------|
| Similar cenotaph completed | "A [industry] founder in [city] just finished their story" |
| Search for org name | "Someone searched for [Org Name]" |
| Scheduled session approaching | "Your [Org Name] session in 1 hour" |
| Mentorship match available | "A founder wants to learn from your experience" |
| Milestone nearby | "You're 1 step from [milestone]" |

### Tone Guidelines

- Never guilt ("You abandoned...")
- Always warmth ("We're here when ready")
- Show value ("X people could learn from...")
- Respect time ("Takes 15 minutes")
- Create FOMO gently ("47 founders completed today")

---

## 5. Completion Tiers

### Public Recognition

| Tier | Requirements | Recognition |
|------|--------------|-------------|
| **Seed** 🌱 | Basic Info | Listed in draft area |
| **Sprouted** 🌿 | + Wizard 1 | Visible in cenotaphery (minimal) |
| **Growing** 🪴 | + Wizard 2-3 | Visible with timeline |
| **Established** 🌳 | + Wizard 4-5 | Full visibility, mentorship eligible |
| **Legacy** 🏛️ | All complete | Featured eligible, full benefits |

### Benefits by Tier

| Benefit | 🌱 | 🌿 | 🪴 | 🌳 | 🏛️ |
|---------|:--:|:--:|:--:|:--:|:--:|
| Cenotaph exists | ✓ | ✓ | ✓ | ✓ | ✓ |
| Visible in cenotaphery | | ✓ | ✓ | ✓ | ✓ |
| Searchable | | | ✓ | ✓ | ✓ |
| Mentorship eligible | | | | ✓ | ✓ |
| Featured in feed | | | | | ✓ |
| Community voting | | | | | ✓ |
| Annual report inclusion | | | | | ✓ |

---

## 6. Implementation Priority

| Feature | Impact | Effort | Phase |
|---------|--------|--------|-------|
| Progressive wizard flow | High | Medium | MVP |
| Cenotaph building visualization | High | High | MVP |
| Respects earning/spending | Medium | Medium | MVP |
| Calendar integration | Medium | Low | MVP |
| Live activity feed | High | Medium | V1.1 |
| Waiting audience hooks | High | Medium | V1.1 |
| Community thank-yous | Medium | Low | V1.1 |
| Mentorship program | High | High | V1.2 |
| Easter eggs | Low | Low | V2.0 |

---

## Summary

The motivation system works on multiple levels:

1. **Immediate gratification** — each step builds visible cenotaph structure
2. **Earned currency** — Respects for customization
3. **Social proof** — live activity shows others are doing it
4. **Personal relevance** — waiting audience creates urgency
5. **Higher purpose** — mentorship connects effort to direct impact
6. **Community belonging** — thank-yous show contribution matters
7. **Gentle persistence** — calendar + emails keep momentum without pressure

The goal: make completion feel like building something meaningful, not filling out a form.

---

*"Every ending deserves dignity. Every step builds that dignity."*
