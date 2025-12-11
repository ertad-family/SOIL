# SOIL Roman Dodecahedron Navigation Architecture
## 3D Polyhedron Website Navigation System

**Project:** SOIL (Social Organizational Intelligence Lab)
**Document Type:** Architecture & Design Specification
**Version:** 2.0
**Date:** December 2025
**Status:** Concept Approved

### Historical Inspiration: The Roman Dodecahedron

This navigation system is inspired by the **Roman Dodecahedron** — mysterious bronze artifacts from the 2nd-4th century AD found across the northwestern Roman Empire. These hollow objects feature:

- **12 pentagonal faces with circular holes of varying diameters**
- **20 vertices, each topped with a small sphere (knob)**
- **Unknown purpose** — over 50 theories exist, from astronomical instruments to religious artifacts

The Roman dodecahedron is one of archaeology's most enduring mysteries: approximately 130 specimens found, yet no written Roman documentation exists. This resonates deeply with SOIL's mission — preserving knowledge that might otherwise be lost, finding meaning in organizational artifacts.

**Reference:** [Roman Dodecahedron - Wikipedia](https://en.wikipedia.org/wiki/Roman_dodecahedron)

![Roman Dodecahedron artifact](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Dodecahedron.jpg/220px-Dodecahedron.jpg)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy](#2-design-philosophy)
3. [Geometric Structure](#3-geometric-structure)
4. [Face Portals (Holes)](#4-face-portals-holes)
5. [Vertex Spheres](#5-vertex-spheres)
6. [Navigation System](#6-navigation-system)
7. [Visual Environment](#7-visual-environment)
8. [Content Integration](#8-content-integration)
9. [Technical Architecture](#9-technical-architecture)
10. [Animation Specifications](#10-animation-specifications)
11. [Implementation Phases](#11-implementation-phases)
12. [Success Metrics](#12-success-metrics)

---

## 1. Executive Summary

### 1.1 Overview

SOIL's website navigation is built around a **Roman Dodecahedron** — a faithful recreation of the mysterious ancient artifact. The dodecahedron is a **hollow shell** with 12 pentagonal faces, each featuring a **circular hole (portal)** of varying diameter. Users navigate by flying **through these holes into the interior**, where full web pages are rendered.

The 20 vertices of the dodecahedron are topped with **small spheres** — just like the original artifact. These spheres serve as secondary navigation: clicking a sphere takes the user **inside that sphere** for a 360° panoramic interface (utility functions like profile, settings, search).

### 1.2 Core Concept

**The Artifact as Interface:** We don't just use the dodecahedron shape — we recreate the Roman artifact with all its distinctive features:

| Artifact Feature | Navigation Function |
|------------------|---------------------|
| **Pentagonal faces with circular holes** | Portals to main sections (7 active + 5 empty) |
| **Holes of varying diameters** | Visual hierarchy / section importance |
| **Spheres on vertices** | Utility function access points (20 total) |
| **Hollow interior** | Where web content lives |
| **Patinated bronze surface** | Material/texture aesthetic |

**The Paradox Resolution:** SOIL's visual identity combines classical Roman aesthetics with cutting-edge technology. The Roman dodecahedron IS the resolution:

- **The artifact itself** = Authentic Roman heritage (real historical object)
- **The environment** = Futuristic digital void (Tron-style)
- **The content inside** = Classical Roman design system (marble, Cinzel, gold)

### 1.3 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Roman Dodecahedron artifact** | Authentic historical reference, mysterious origin, fits SOIL's mission |
| **Holes as portals** | True to artifact design; camera flies through to enter sections |
| **Content INSIDE the dodecahedron** | Face is shell/portal, not content surface |
| **Varying hole diameters** | Matches original artifact; can signify section importance |
| **Spheres on vertices** | True to artifact; secondary navigation for utilities |
| **Hollow structure** | Interior space = web content canvas |
| **Tron-style void** | Digital aesthetic, contrast with ancient artifact |
| **Unity WebGL** | Consistency with Columbarium memorial system |

### 1.4 Relationship to Columbarium

The Dodecahedron Navigation and the Circular Columbarium Memorial share:

- **Technology stack:** Unity WebGL
- **Visual language:** Grid patterns, digital aesthetics, sacred geometry
- **Philosophical approach:** 3D space as meaningful architecture, not decoration

The Dodecahedron is the **macro navigation** (between site sections), while the Columbarium is the **micro experience** (within the Memorials section).

---

## 2. Design Philosophy

### 2.1 Guiding Principles

**1. Digital Authenticity**

The website exists in digital space — it should embrace this rather than pretending to be physical. The wireframe void, floating geometry, and sketch-state faces all communicate: "This is a digital construct, deliberately designed."

**2. Classical Content, Futuristic Frame**

The marble buttons, Cinzel typography, and gold accents are wrapped in a cyber-architectural shell. This creates productive tension between permanence (classical) and transience (digital) — mirroring the tension between organizational ambition and organizational mortality.

**3. Navigation as Experience**

Moving between pages isn't just functional — it's experiential. The camera pullback, rotation, and approach sequence creates a moment of orientation and anticipation. Users know where they are in the larger structure.

**4. Growth Through Incompleteness**

Empty faces (wireframe sketches) communicate that SOIL is evolving. Rather than hiding future sections, we display them as "under construction" — inviting curiosity and return visits.

**5. Geometric Meaning**

The dodecahedron isn't arbitrary. In Platonic philosophy, it represents the cosmos/ether. For SOIL, it represents the universe of organizational knowledge — each face a window into a different aspect.

### 2.2 Emotional Journey

The navigation system creates a specific emotional arc:

```
Arrival → Orientation → Selection → Transition → Immersion

1. Arrival: See the dodecahedron floating in void
2. Orientation: Understand the structure, see face labels
3. Selection: Choose a face (section) to enter
4. Transition: Camera pulls back, rotates, approaches
5. Immersion: Face fills viewport, content loads
```

### 2.3 Why a Dodecahedron?

**Considered alternatives:**

| Shape | Faces | Pros | Cons |
|-------|-------|------|------|
| Cube | 6 | Simple, easy faces | Too few, too common |
| Octahedron | 8 | Good count | Triangular faces hard to design for |
| Icosahedron | 20 | Many options | Too many, triangular faces |
| **Dodecahedron** | **12** | **Perfect count, pentagonal faces, unique** | **More complex geometry** |
| Cuboctahedron | 14 | Good count | Mixed face shapes (squares + triangles) |

**The dodecahedron wins because:**
- 12 faces = 7 sections + 5 placeholders (room to grow)
- Pentagonal faces are distinctive and memorable
- Strong geometric symbolism (Platonic solid)
- Not overused in web design (unique identity)

---

## 3. Geometric Structure

### 3.1 Dodecahedron Properties

**Mathematical Definition:**

A regular dodecahedron is a Platonic solid composed of 12 regular pentagonal faces, with 3 faces meeting at each vertex.

```
Properties:
- Faces: 12 (regular pentagons)
- Edges: 30
- Vertices: 20
- Face angles: 108°
- Dihedral angle: 116.565°
```

**Coordinate System:**

The dodecahedron is centered at origin (0, 0, 0) with a circumscribed sphere radius of 1 unit (scaled as needed).

```
Vertex coordinates (using golden ratio φ = 1.618...):

(±1, ±1, ±1)
(0, ±1/φ, ±φ)
(±1/φ, ±φ, 0)
(±φ, 0, ±1/φ)
```

### 3.2 Face Identification

Each face is identified by its center normal vector and assigned an index 0-11:

```
Face Layout (conceptual unfolding):

           [F4]
      [F3] [F0] [F5]
 [F2] [F1] [F6] [F7] [F8]
      [F11][F10][F9]

Where F0 = "front" face (facing camera at start)
```

**Face Addressing:**

```
Face 0:  Front (initial view)      → Home
Face 1:  Front-bottom-left         → Research Center
Face 2:  Front-bottom-right        → Memorials
Face 3:  Front-top-left            → Diagnostics Center
Face 4:  Front-top-right           → Educational Center
Face 5:  Right                     → Clinic
Face 6:  Left                      → Community
Face 7:  Back-top-left             → [Empty/Future]
Face 8:  Back-top-right            → [Empty/Future]
Face 9:  Back-bottom-left          → [Empty/Future]
Face 10: Back-bottom-right         → [Empty/Future]
Face 11: Back                      → [Empty/Future]
```

### 3.3 Scale and Proportions

**Base dimensions (Unity units):**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Circumscribed sphere radius | 10 units | Fits comfortably in view |
| Edge length | ~7.05 units | Derived from radius |
| Face inradius | ~6.07 units | Distance from face center to edge |
| Face area | ~85.5 sq units | Per pentagonal face |

**Camera distances:**

| View State | Distance from Center | Notes |
|------------|---------------------|-------|
| Zoomed out (transition) | 25-30 units | Full dodecahedron visible |
| Zoomed in (content) | 8-10 units | Single face fills ~80% of viewport |
| Default idle | 15-18 units | Shows front face + hints of neighbors |

### 3.4 Orientation

**Default orientation:**

- One face directly facing camera (Face 0 = Home)
- Dodecahedron "standing" on edge, not face or vertex
- Slight tilt (5-10°) for visual interest
- Slow idle rotation (0.5°/sec) when not navigating

---

## 4. Face Portals (Holes)

### 4.1 Portal Concept

Unlike a solid-faced dodecahedron, the Roman Dodecahedron artifact has **circular holes** in each pentagonal face. These holes are our **portals** — the camera flies through them to access content inside.

```
        Roman Dodecahedron Face
    ┌───────────────────────────┐
    │                           │
    │        ╭───────╮          │
    │       │         │         │  ← Circular hole
    │       │ PORTAL  │         │    (varying diameter)
    │       │         │         │
    │        ╰───────╯          │
    │                           │
    │   Bronze pentagonal face  │
    └───────────────────────────┘
```

**Key insight:** The face surface itself shows section label/icon, but the **hole** is the entry point. Looking through the hole, user can see glimpse of interior content.

### 4.2 Portal Assignments (7 Active)

| Face | Section | Hole Diameter | Visual Through Hole |
|------|---------|---------------|---------------------|
| **0** | **Home** | Large (40mm scale) | SOIL logo, intro text |
| **1** | **Research Center** | Medium-Large (35mm) | Data visualization glimpse |
| **2** | **Memorials** | Large (40mm) | Columbarium preview |
| **3** | **Diagnostics** | Medium (30mm) | Assessment interface |
| **4** | **Education** | Medium (30mm) | Course thumbnails |
| **5** | **Clinic** | Medium-Small (25mm) | Consultation booking |
| **6** | **Community** | Medium (30mm) | Forum activity |

### 4.3 Empty Portals (5 Reserved)

| Face | Status | Hole Appearance |
|------|--------|-----------------|
| **7** | Reserved | Sealed with wireframe grate |
| **8** | Reserved | Sealed with wireframe grate |
| **9** | Reserved | Sealed with wireframe grate |
| **10** | Reserved | Sealed with wireframe grate |
| **11** | Reserved | Sealed with wireframe grate |

Empty portals are **sealed** with a digital wireframe grate — suggesting "under construction" but maintaining the hole aesthetic. Faint glow suggests something is being built behind.

### 4.4 Portal Visual States

**Active Portal (Idle):**
- Bronze ring around hole edge
- Subtle inner glow (gold/cyan depending on section)
- Section icon floating just inside the hole
- Section name inscribed on face surface (Roman lettering)
- Through the hole: blurred/distant preview of content

**Active Portal (Hover):**
- Ring brightens, gold glow intensifies
- Hole appears to "open wider" (subtle scale)
- Interior preview becomes clearer/closer
- Section name illuminates
- Sound: soft chime

**Active Portal (Enter — camera approaching):**
- Hole edge glows brightly
- Interior content rushing toward camera
- Other portals dim and recede
- Sound: whoosh

**Sealed Portal (Empty):**
- Wireframe grate pattern across hole
- Dim cyan glow at edges
- "FUTURE" or similar text
- No hover interaction (or shows "Coming Soon" tooltip)

### 4.5 Hole Diameter Significance

Following the original artifact's varying hole sizes:

```
Diameter Scale (arbitrary units matching artifact):
├── 40mm: Primary sections (Home, Memorials)
├── 35mm: Major sections (Research)
├── 30mm: Standard sections (Diagnostics, Education, Community)
├── 25mm: Specialized sections (Clinic)
└── 20mm: Future/reserved (smaller = less ready)
```

This creates visual hierarchy without breaking the artifact's authentic appearance.

---

## 5. Vertex Spheres

### 5.1 Sphere Concept

The Roman Dodecahedron has **20 vertices, each topped with a small sphere (knob)**. This distinctive feature becomes our **secondary navigation system**.

```
        Vertex Sphere
            ╭──╮
           │    │  ← Clickable sphere
            ╰──╯
             │
    ─────────┼─────────  ← Edge of dodecahedron
```

**Function:** Clicking a sphere takes the camera **inside that sphere**, revealing a **360° panoramic interface** for utility functions.

### 5.2 Sphere Assignments

Of the 20 vertex spheres, we assign functions to a subset:

| Sphere ID | Function | Interior Experience |
|-----------|----------|---------------------|
| **S0** | **User Profile** | 360° personal dashboard |
| **S1** | **Settings** | Preferences controls |
| **S2** | **Search** | Global search interface |
| **S3** | **Notifications** | Activity feed |
| **S4** | **Help/Glossary** | Documentation |
| **S5** | **Language** | Localization |
| **S6-S19** | Reserved | Empty spheres (future use) |

### 5.3 Sphere Interaction

**Sphere (Idle):**
- Solid bronze/brass material
- Subtle metallic sheen
- Small, proportional to dodecahedron (like artifact)

**Sphere (Hover):**
- Glow effect (indicates function)
- Function icon appears floating above sphere
- Tooltip with function name

**Sphere (Enter — camera flying into sphere):**
- Camera zooms toward sphere
- Sphere "opens" or becomes transparent
- Camera enters interior
- 360° panoramic environment revealed

### 5.4 Interior Sphere Experience

Inside a sphere, the user experiences a **spherical panoramic interface**:

```
        Inside Sphere (360° view)
    ╭─────────────────────────────────╮
   │                                   │
   │    ┌─────┐     ┌─────┐           │
   │    │ Opt │     │ Opt │           │  ← UI elements arranged
   │    └─────┘     └─────┘           │    on sphere interior
   │                                   │
   │         ┌─────────┐              │
   │         │ MAIN    │              │
   │         │ CONTENT │              │
   │         └─────────┘              │
   │                                   │
    ╰─────────────────────────────────╯

- User can rotate view with mouse/touch
- UI elements are positioned in 3D space
- Exit via gesture or "back" button
```

### 5.5 Sphere Visual Design

**Material:**
- Patinated bronze (matching dodecahedron)
- Slight green-brown patina like artifact
- Metallic highlights

**Active spheres** (assigned function):
- Subtle inner glow
- Icon embossed or floating

**Empty spheres** (reserved):
- Same material, no glow
- No hover reaction
- Appear decorative/structural

---

## 6. Navigation System

### 6.1 Navigation Philosophy

**Core principle:** Navigation is a journey THROUGH the artifact.

The Roman Dodecahedron's holes aren't just visual — they're literal **portals**. Users don't view content ON faces; they fly THROUGH holes to reach content INSIDE.

```
Navigation Model:

    OUTSIDE (void)          SHELL (artifact)         INSIDE (content)
         │                       │                        │
         │     ╭────────╮       │                        │
    👁️ ──┼────▶│  HOLE  │───────┼──────────────▶  📄 Web Page
  Camera │     ╰────────╯       │                        │
         │                       │                        │
         │    Bronze surface     │                        │
```

### 6.2 Navigation Flow

**Portal Entry Sequence (Outside → Inside):**

```
User clicks portal (hole in face)
        ↓
[1] PULL BACK (1.0 sec)
    - Camera retreats from current position
    - If inside: exits through current portal first
    - Full dodecahedron becomes visible
        ↓
[2] ROTATE (1.0-2.0 sec)
    - Dodecahedron rotates to face target portal
    - Target hole comes into direct view
    - Can see through hole to content inside
        ↓
[3] APPROACH & ENTER (1.5 sec)
    - Camera accelerates toward target hole
    - Hole edge grows, fills frame
    - Camera PASSES THROUGH the hole
        ↓
[4] INTERIOR REVEAL (0.5 sec)
    - Camera emerges inside dodecahedron
    - Web content fills viewport
    - UI elements appear
    - Hole visible "behind" as exit point
```

**Total transition time:** 4.0-5.0 seconds

**Exit Sequence (Inside → Outside):**

```
User clicks "back" or navigation
        ↓
[1] RETREAT (1.0 sec)
    - Camera backs away from content
    - Current portal hole visible ahead
        ↓
[2] EXIT THROUGH HOLE (1.0 sec)
    - Camera flies back through hole
    - Emerges outside dodecahedron
        ↓
[3] ROTATE to new target (if navigating)
```

### 6.3 Vertex Sphere Entry Sequence

**Sphere Navigation (Outside → Inside Sphere):**

```
User clicks vertex sphere
        ↓
[1] CAMERA FOCUSES (0.5 sec)
    - Camera orients toward clicked sphere
    - Other elements dim slightly
        ↓
[2] APPROACH SPHERE (1.0 sec)
    - Camera zooms toward sphere
    - Sphere grows to fill frame
        ↓
[3] SPHERE OPENS (0.5 sec)
    - Sphere surface becomes transparent/parts
    - Interior revealed
        ↓
[4] ENTER (0.5 sec)
    - Camera crosses threshold
    - 360° panoramic environment surrounds user
    - Utility UI appears
```

**Exit Sphere:**
- Gesture/button triggers exit
- Camera reverses through sphere surface
- Returns to exterior dodecahedron view

### 6.4 Camera Behavior

**Default State (Idle):**
- Positioned facing current face
- Distance: 8-10 units from face center
- Slight gentle drift (breathing motion)
- Always looking at face center

**Transition State (Navigating):**
- Smooth bezier curve path
- Always looking at dodecahedron center
- Easing: ease-in-out-cubic
- No sudden movements or jerks

**Camera Parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Field of View | 60° | Standard perspective |
| Near clip | 0.1 units | Prevents face clipping |
| Far clip | 100 units | Shows distant void |
| Movement speed | Variable | Based on distance |
| Rotation speed | 30°/sec max | Comfortable viewing |

### 6.5 Input Methods

**Desktop:**
- Click face directly → Navigate to that section
- Keyboard arrows → Rotate to adjacent face
- Number keys 1-7 → Direct jump to section
- Scroll wheel → Zoom in/out (limited range)
- Escape → Return to overview (zoom out)

**Mobile:**
- Tap face → Navigate to that section
- Swipe left/right → Rotate dodecahedron
- Pinch → Zoom in/out
- Menu icon → Section list overlay

**Accessibility:**
- Tab navigation through faces
- Screen reader announces face labels
- Reduced motion option (instant transitions)
- High contrast mode for face labels

### 6.6 Navigation UI Elements

**Persistent Navigation Bar:**

Even when viewing content, a minimal nav bar provides quick jumps:

```
┌────────────────────────────────────────────┐
│ ◇ SOIL  │ Home │ Research │ Memorials │ ⋮ │
└────────────────────────────────────────────┘
```

- Clicking nav items triggers full 3D transition
- Current section highlighted
- Hamburger menu (⋮) for full list on mobile

**Section Indicator:**

Small dodecahedron wireframe in corner showing current position:

```
     ╱╲
    ╱  ╲
   ╱ ●  ╲   ← Dot indicates current face
   ╲    ╱
    ╲  ╱
     ╲╱
```

**Breadcrumb (when deep in section):**

```
Home > Memorials > Silicon Valley Memorial > Cenotaph #127
```

### 6.7 Deep Linking

URLs map to faces and content:

```
soil.org/                     → Face 0 (Home)
soil.org/research             → Face 1 (Research Center)
soil.org/memorials            → Face 2 (Memorials)
soil.org/memorials/sv-001     → Face 2 → specific memorial
soil.org/diagnostics          → Face 3 (Diagnostics)
soil.org/education            → Face 4 (Education)
soil.org/clinic               → Face 5 (Clinic)
soil.org/community            → Face 6 (Community)
```

**Direct URL access:**
- Loads Unity scene
- Immediately positions camera at target face
- Skips intro animation (or shows abbreviated version)
- Content loads in parallel

---

## 7. Visual Environment

### 7.1 The Void (Background Space)

**Aesthetic:** Tron Legacy meets architectural blueprint

The dodecahedron floats in an infinite digital void — a dark space defined by glowing grid lines that suggest infinite digital space.

**Color Palette:**

| Element | Color | Hex |
|---------|-------|-----|
| Void background | Near black | #0a0a0f |
| Grid lines (primary) | Cyan/teal | #00d4ff |
| Grid lines (secondary) | Dimmer cyan | #006680 |
| Grid intersections | Bright white | #ffffff |
| Ambient glow | Deep blue | #001a33 |
| Fog/depth fade | Dark blue | #000510 |

**Grid System:**

```
Infinite Grid Visualization:

     │     │     │     │     │
─────┼─────┼─────┼─────┼─────┼─────
     │     │     │     │     │
─────┼─────┼─────┼─────┼─────┼─────
     │     │  ◇  │     │     │      ← Dodecahedron at center
─────┼─────┼─────┼─────┼─────┼─────
     │     │     │     │     │
─────┼─────┼─────┼─────┼─────┼─────
     │     │     │     │     │

- Grid extends to horizon (fade with distance)
- Grid spacing: 5 units
- Line thickness: 0.02 units (glowing)
- Intersection points: subtle pulse
```

**Grid Properties:**
- Extends horizontally to visual infinity
- Fades with distance (fog)
- Subtle movement/pulse at intersections
- Optional: very slow drift animation

### 6.2 Atmospheric Effects

**Particles:**
- Floating motes of light
- Sparse density (50-100 visible)
- Slow random movement
- Cyan/white coloring
- Suggests digital "dust" or data

**Volumetric Light:**
- Subtle god rays from "above"
- Very low intensity
- Adds depth to void
- Optional based on performance

**Fog/Depth:**
- Linear fog starting at 30 units
- Creates horizon fade
- Emphasizes distance and scale

**Bloom:**
- Applied to grid lines and edges
- Low intensity (0.2-0.3)
- Creates glow effect
- Enhances digital aesthetic

### 7.3 Roman Dodecahedron Materials

**Artifact Surface (Patinated Bronze):**

Recreating the authentic Roman artifact appearance:

```
Bronze Base:
- Base color: Deep bronze (#5c4a32)
- Metallic: 0.85
- Smoothness: 0.3-0.5 (worn, not polished)

Patina Layer:
- Verdigris patches: #3d6b5a (green oxidation)
- Brown patina: #4a3d2d
- Distribution: Procedural noise, concentrated in recesses
- Opacity: 30-60% (varies across surface)

Surface Wear:
- Edge highlights: Brighter bronze (worn edges)
- Micro-scratches: Normal map detail
- Age spots: Darker discoloration patches
```

**Hole Edge Ring:**

```
Raised bronze ring around each portal:
- Color: Brighter bronze (#8b7355)
- Metallic: 0.9
- Inner glow: Gold (#c4a15a) for active portals
- Thickness: Proportional to hole diameter
```

**Vertex Sphere Material:**

```
Same patinated bronze as main body:
- Slightly more polished (higher smoothness: 0.5)
- Active spheres: Subtle gold inner glow
- Reserved spheres: No glow, more patina
```

**Sealed Portal Grate (Empty Faces):**

```
Digital wireframe sealing unused holes:
- Line color: Cyan (#00d4ff)
- Line width: 0.02 units
- Pattern: Radial + grid overlay
- Emission: Low glow
- Opacity: 70%
```

**Interior Surface (Inside Dodecahedron):**

```
When camera enters through portal:
- Environment transitions from bronze to web content
- Interior can be stylized or purely functional
- Option: Bronze interior walls with web content "windows"
- Option: Seamless transition to full-screen web content
```

### 7.4 Lighting Setup

**Primary Light:**
- Type: Directional
- Direction: Top-front (45° down, 30° side)
- Color: Warm white (#fff5e6)
- Intensity: 0.8
- Shadows: Soft

**Fill Light:**
- Type: Directional
- Direction: Bottom-back
- Color: Cool blue (#e6f0ff)
- Intensity: 0.3
- Shadows: None

**Ambient:**
- Type: Gradient
- Sky: Dark blue (#001020)
- Equator: Very dark (#000510)
- Ground: Black (#000000)
- Intensity: 0.2

**Rim Light (per face on hover):**
- Type: Point light at face center
- Color: Gold (#c4a15a)
- Intensity: Variable (0 → 1 on hover)
- Range: 5 units

### 7.5 Sound Design

**Ambient:**
- Low digital hum (synthesizer pad)
- Very subtle, almost subliminal
- Responds slightly to camera movement
- Volume: 10-15% max

**Navigation Sounds:**

| Action | Sound | Duration |
|--------|-------|----------|
| Hover face | Soft chime | 0.2 sec |
| Select face | Confirmation tone | 0.5 sec |
| Camera movement | Whoosh/sweep | Matches animation |
| Arrive at face | Settle tone | 0.3 sec |

**UI Sounds:**
- Button clicks: Subtle marble tap
- Menu open: Soft slide
- Error: Gentle alert (not harsh)

---

## 8. Content Integration

### 8.1 Architecture Overview

**Hybrid Approach:** Unity handles 3D navigation, web handles content.

```
┌─────────────────────────────────────────────┐
│                 Browser                      │
│  ┌─────────────────────────────────────┐    │
│  │         Unity WebGL Canvas           │    │
│  │    (Dodecahedron, void, camera)      │    │
│  │                                      │    │
│  │    ┌─────────────────────────┐      │    │
│  │    │    Content Iframe/      │      │    │
│  │    │    Overlay (HTML)       │      │    │
│  │    │                         │      │    │
│  │    │  (React/Next.js page)   │      │    │
│  │    │                         │      │    │
│  │    └─────────────────────────┘      │    │
│  │                                      │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  [Nav Bar]                    [Settings]     │
└─────────────────────────────────────────────┘
```

### 8.2 Content Rendering Modes

**Mode 1: Exterior View (Outside Dodecahedron)**

Camera is positioned outside the artifact:
- See bronze dodecahedron with all portal holes
- Can peek through holes to glimpse interior content
- Section labels visible on face surfaces
- Vertex spheres visible and clickable

**Mode 2: Portal Approach (Flying Toward Hole)**

Camera approaching a specific portal:
- Hole grows in view, edges visible
- Interior content becomes clearer through hole
- Other portals fade/blur
- Transition sound plays

**Mode 3: Interior View (Inside Dodecahedron)**

Camera has passed through portal, now inside:
- Full web content fills viewport
- Unity renders minimal frame (portal edge visible behind)
- Content is standard Next.js page
- Exit portal visible as "window" back to void

**Mode 4: Sphere Interior (Inside Vertex Sphere)**

Camera has entered a vertex sphere:
- 360° panoramic environment
- UI elements positioned in 3D space
- Mouse/touch rotation to look around
- Exit point visible (way back out)

### 8.3 Unity ↔ Web Communication

**JavaScript → Unity:**

```javascript
// Trigger navigation
unityInstance.SendMessage('NavigationController', 'NavigateToFace', 2);

// Request current state
unityInstance.SendMessage('NavigationController', 'GetCurrentFace');

// Set user preferences
unityInstance.SendMessage('SettingsController', 'SetReducedMotion', 'true');
```

**Unity → JavaScript:**

```csharp
// Send navigation events
Application.ExternalCall("onNavigationStart", targetFaceId);
Application.ExternalCall("onNavigationComplete", faceId);
Application.ExternalCall("onFaceHover", faceId);

// Request content load
Application.ExternalCall("loadContent", "/memorials");
```

**Event Flow:**

```
User clicks face (Unity)
        ↓
Unity starts camera animation
Unity calls: onNavigationStart(faceId)
        ↓
React/Next.js begins preloading content
        ↓
Unity camera reaches destination
Unity calls: onNavigationComplete(faceId)
        ↓
React shows content overlay
URL updates (history.pushState)
```

### 8.4 Content Boundaries

**Pentagon Clipping:**

Content displayed in pentagonal viewport matching face shape:

```css
.face-content {
  clip-path: polygon(
    50% 0%,           /* top */
    100% 38%,         /* right-top */
    81% 100%,         /* right-bottom */
    19% 100%,         /* left-bottom */
    0% 38%            /* left-top */
  );
}
```

**For MVP:** Rectangle viewport acceptable
- Simpler implementation
- Pentagon frame rendered by Unity as overlay
- Content is standard rectangle underneath

### 8.5 Loading States

**Initial Load:**
```
[Void fades in]
    ↓
[Grid lines draw themselves]
    ↓
[Dodecahedron assembles face by face]
    ↓
[Faces illuminate one by one]
    ↓
[Camera settles at Home face]
    ↓
[Content loads]
```

**Navigation Load:**
```
[Current content fades]
    ↓
[Camera pulls back]
    ↓
[Loading indicator on target face]
    ↓
[Content preloads during rotation]
    ↓
[Camera approaches]
    ↓
[Content appears]
```

---

## 8. Technical Architecture

### 8.1 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| 3D Engine | Unity 2022 LTS | Dodecahedron, camera, void |
| Build Target | WebGL | Browser deployment |
| Web Framework | Next.js 14 | Content pages, routing |
| Styling | Tailwind CSS | Design system |
| State Management | React Context | UI state |
| Communication | jslib + events | Unity ↔ JS bridge |

### 8.2 Project Structure

```
soil/
├── unity/
│   └── SoilNavigation/
│       ├── Assets/
│       │   ├── Scripts/
│       │   │   ├── NavigationController.cs
│       │   │   ├── CameraController.cs
│       │   │   ├── FaceManager.cs
│       │   │   ├── VoidEnvironment.cs
│       │   │   └── WebBridge.cs
│       │   ├── Prefabs/
│       │   │   ├── Dodecahedron.prefab
│       │   │   ├── Face.prefab
│       │   │   └── Void.prefab
│       │   ├── Materials/
│       │   ├── Shaders/
│       │   └── Plugins/
│       │       └── WebGL/
│       │           └── Bridge.jslib
│       └── ProjectSettings/
│
├── src/                          (Next.js)
│   ├── app/
│   │   ├── page.tsx              (Home content)
│   │   ├── research/
│   │   ├── memorials/
│   │   ├── diagnostics/
│   │   ├── education/
│   │   ├── clinic/
│   │   └── community/
│   ├── components/
│   │   ├── UnityCanvas.tsx       (Unity WebGL wrapper)
│   │   ├── ContentOverlay.tsx    (Content display)
│   │   └── NavigationBridge.tsx  (Unity communication)
│   └── lib/
│       └── unity-bridge.ts       (JS utilities)
│
├── public/
│   └── unity/
│       ├── Build/
│       │   ├── SoilNavigation.wasm
│       │   ├── SoilNavigation.data
│       │   └── SoilNavigation.framework.js
│       └── TemplateData/
│
└── docs/
    ├── SOIL_Dodecahedron_Navigation_Architecture.md
    └── SOIL_Memorial_Circular_Columbarium_Architecture.md
```

### 8.3 Unity Scene Structure

```
Scene: MainNavigation
│
├── Managers
│   ├── NavigationController
│   ├── CameraController
│   └── WebBridge
│
├── Environment
│   ├── Void
│   │   ├── InfiniteGrid
│   │   ├── Particles
│   │   └── Fog
│   └── Lighting
│       ├── MainLight
│       ├── FillLight
│       └── Ambient
│
├── Dodecahedron
│   ├── Structure
│   │   └── Edges (glow material)
│   └── Faces [0-11]
│       ├── Face_0_Home
│       ├── Face_1_Research
│       ├── Face_2_Memorials
│       ├── Face_3_Diagnostics
│       ├── Face_4_Education
│       ├── Face_5_Clinic
│       ├── Face_6_Community
│       ├── Face_7_Empty
│       ├── Face_8_Empty
│       ├── Face_9_Empty
│       ├── Face_10_Empty
│       └── Face_11_Empty
│
├── Camera
│   └── MainCamera
│       └── Post-Processing Volume
│
└── UI (Unity UI for 3D labels only)
    └── FaceLabels
```

### 8.4 Performance Targets

**Desktop WebGL:**

| Metric | Target |
|--------|--------|
| Frame rate | 60 fps |
| Initial load | < 8 seconds |
| Navigation transition | < 100ms input lag |
| Memory usage | < 256 MB |
| Bundle size | < 15 MB compressed |

**Mobile Web:**

| Metric | Target |
|--------|--------|
| Frame rate | 30 fps |
| Initial load | < 12 seconds |
| Navigation transition | < 150ms input lag |
| Memory usage | < 128 MB |
| Bundle size | < 15 MB compressed |

### 8.5 Fallback Strategy

**If WebGL not supported:**

```
┌─────────────────────────────────────┐
│                                     │
│   ◇ SOIL                            │
│                                     │
│   Your browser doesn't support      │
│   our 3D navigation experience.     │
│                                     │
│   [Continue to 2D Site]             │
│                                     │
│   Sections:                         │
│   • Home                            │
│   • Research Center                 │
│   • Memorials                       │
│   • Diagnostics Center              │
│   • Educational Center              │
│   • Clinic                          │
│   • Community                       │
│                                     │
└─────────────────────────────────────┘
```

- Standard sidebar/header navigation
- All content accessible
- No 3D elements
- Full functionality preserved

---

## 9. Animation Specifications

### 9.1 Navigation Animation

**Phase 1: Pull Back**

```
Duration: 1.5 seconds
Easing: ease-out-cubic

Camera position:
  Start: Face viewing position (8 units from face)
  End: Overview position (25 units from center)

Content:
  Opacity: 1.0 → 0.0
  Scale: 1.0 → 0.8

Dodecahedron:
  No change (stationary)
```

**Phase 2: Rotate**

```
Duration: Variable (1.0 - 2.0 seconds based on angle)
Easing: ease-in-out-cubic

Camera position:
  Orbits around dodecahedron center
  Maintains distance of 25 units
  Follows shortest rotation path

Dodecahedron:
  Optional: slight counter-rotation for effect

Angular speed:
  Max 60°/second
  Min 30°/second
```

**Phase 3: Approach**

```
Duration: 1.5 seconds
Easing: ease-in-cubic

Camera position:
  Start: Overview position (25 units from center)
  End: Face viewing position (8 units from face)

Content:
  Opacity: 0.0 → 1.0 (starts at 50% through approach)
  Scale: 0.8 → 1.0

Target face:
  Glow intensity: 0.5 → 1.0 → 0.3 (pulse then settle)
```

### 9.2 Hover Animation

**Face Hover:**

```
Duration: 0.3 seconds
Easing: ease-out

Face:
  Brightness: 1.0 → 1.2
  Scale: 1.0 → 1.02
  Edge glow: 0.3 → 0.8

Label:
  Opacity: 0.7 → 1.0
  Y offset: 0 → -5px (subtle lift)
```

### 9.3 Idle Animation

**Dodecahedron Drift:**

```
Continuous, looping

Rotation:
  Y-axis: 0.5°/second (very slow spin)
  X-axis: 0.1° oscillation (breathing)
  Period: 8 seconds

Camera:
  Subtle position drift: ±0.1 units
  Period: 5 seconds
  Easing: sine wave
```

**Grid Pulse:**

```
Continuous, looping

Intersection points:
  Brightness oscillation: 0.8 → 1.0 → 0.8
  Period: 3 seconds
  Phase offset: based on position (wave effect)
```

### 9.4 Intro Animation

**First Load Sequence:**

```
[0.0s] Black screen

[0.5s] Void fades in (1.0s)
       - Background color appears
       - Fog gradient establishes

[1.5s] Grid draws (2.0s)
       - Lines extend from center outward
       - Intersection points pop
       - Sound: digital sweep

[3.5s] Dodecahedron assembles (2.0s)
       - Vertices appear as points
       - Edges connect between vertices
       - Faces fill in one by one
       - Sound: crystalline assembly

[5.5s] Faces illuminate (1.0s)
       - Each active face lights up
       - Labels fade in
       - Sound: soft chimes (one per face)

[6.5s] Camera settles (1.0s)
       - Smooth move to Home face
       - Content begins loading

[7.5s] Ready
       - Full interactivity enabled
```

### 9.5 Reduced Motion Mode

**For users with motion sensitivity:**

```
Navigation:
  - Instant camera jumps (no animation)
  - Fade transition only (0.3s)
  - No rotation visualization

Idle:
  - No drift or rotation
  - Static grid (no pulse)
  - Static dodecahedron

Hover:
  - Color change only (no scale/movement)
  - Instant state change
```

---

## 10. Implementation Phases

### 10.1 Overview

Development follows a **5-phase approach** building from core functionality to polish.

### 10.2 Phase 1: Core Geometry (Week 1-2)

**Goal:** Build the dodecahedron and basic camera

**Deliverables:**
- Dodecahedron mesh (programmatic or imported)
- 12 face GameObjects with colliders
- Basic materials (solid color, no textures)
- Orbit camera with mouse/touch control
- Face click detection

**Success Criteria:**
- Dodecahedron renders correctly
- Camera can orbit freely
- Faces are clickable
- Runs in Unity editor

### 10.3 Phase 2: Void Environment (Week 3-4)

**Goal:** Create the digital void aesthetic

**Deliverables:**
- Infinite grid shader/system
- Background gradient
- Fog system
- Particle system
- Basic lighting setup
- Post-processing (bloom)

**Success Criteria:**
- Tron aesthetic achieved
- Grid extends to horizon
- Particles float naturally
- Performance acceptable (60fps)

### 10.4 Phase 3: Navigation System (Week 5-6)

**Goal:** Implement full navigation flow

**Deliverables:**
- Camera path calculation (face to face)
- Smooth animation system
- Pull back → rotate → approach sequence
- Face hover effects
- Face state management (active/empty/selected)
- Navigation sounds

**Success Criteria:**
- Navigation feels smooth and intentional
- All 12 faces reachable
- Transitions take 4-5 seconds
- No visual glitches

### 10.5 Phase 4: Web Integration (Week 7-8)

**Goal:** Connect Unity to Next.js

**Deliverables:**
- WebGL build configuration
- JavaScript bridge (jslib)
- React Unity wrapper component
- Content overlay system
- URL routing integration
- Loading states

**Success Criteria:**
- Unity loads in Next.js page
- Navigation triggers URL changes
- Content loads on face arrival
- Deep links work correctly

### 10.6 Phase 5: Polish & Optimization (Week 9-10)

**Goal:** Production-ready quality

**Deliverables:**
- Face content previews (icons, labels)
- Intro animation sequence
- Accessibility features (reduced motion, keyboard nav)
- Performance optimization
- Mobile optimization
- Fallback page for no-WebGL
- Loading screen

**Success Criteria:**
- All performance targets met
- Accessibility audit passed
- Works on target devices
- No crashes or major bugs

### 10.7 Dependencies

```
Phase 1 (Geometry)
    ↓
Phase 2 (Void) ← Can start partially in parallel
    ↓
Phase 3 (Navigation) ← Requires geometry complete
    ↓
Phase 4 (Integration) ← Requires navigation working
    ↓
Phase 5 (Polish) ← Requires integration complete
```

---

## 11. Success Metrics

### 11.1 Technical Metrics

**Performance:**
- [ ] 60fps on desktop WebGL (Chrome, Firefox, Safari)
- [ ] 30fps on mobile (iOS Safari, Chrome Android)
- [ ] < 8 second initial load (desktop)
- [ ] < 12 second initial load (mobile)
- [ ] < 15 MB compressed bundle size

**Quality:**
- [ ] No visual artifacts or z-fighting
- [ ] Smooth camera transitions
- [ ] All faces accessible
- [ ] Grid renders correctly at all distances

**Reliability:**
- [ ] No crashes during 30-minute session
- [ ] Works on all target browsers
- [ ] Graceful fallback for unsupported browsers
- [ ] Deep links resolve correctly

### 11.2 User Experience Metrics

**Navigation:**
- [ ] Users can navigate to any section within 10 seconds
- [ ] First-time users understand interface within 30 seconds
- [ ] Navigation described as "intuitive" in testing
- [ ] < 5% users request alternative navigation

**Engagement:**
- [ ] Average time on site increases vs. 2D navigation
- [ ] Users explore multiple sections per session
- [ ] Return visit rate > 30%
- [ ] "Cool factor" mentioned in feedback

**Accessibility:**
- [ ] All content accessible via keyboard
- [ ] Reduced motion mode functional
- [ ] Screen reader compatibility (fallback mode)
- [ ] Touch targets meet minimum size (44x44px)

### 11.3 Design Goals

**Aesthetic Success:**
- [ ] Tron-style void feels immersive
- [ ] Dodecahedron appears "solid" and "real"
- [ ] Classical/futuristic contrast is evident
- [ ] Matches SOIL brand identity

**Emotional Impact:**
- [ ] Users describe experience as "unique"
- [ ] Navigation feels like a "journey"
- [ ] Empty faces create curiosity
- [ ] Overall impression is "professional" and "innovative"

### 11.4 Testing Methodology

**Phase 1-3 (During Development):**
- Internal team testing
- Performance profiling
- Cross-browser testing

**Phase 4-5 (Pre-Launch):**
- Alpha testing with 10-20 users
- Usability testing sessions
- Mobile device testing
- Accessibility audit

**Post-Launch:**
- Analytics (time on site, navigation patterns)
- User feedback surveys
- A/B testing against 2D fallback
- Continuous performance monitoring

---

## Appendix A: Dodecahedron Mathematics

### Vertex Coordinates

Using golden ratio φ = (1 + √5) / 2 ≈ 1.618:

```
8 vertices from cube: (±1, ±1, ±1)

4 vertices: (0, ±1/φ, ±φ)
4 vertices: (±1/φ, ±φ, 0)
4 vertices: (±φ, 0, ±1/φ)

Total: 20 vertices
```

### Face Center Normals

Each face center normal (for camera targeting):

```
Face 0:  ( 0.000,  0.851,  0.526)
Face 1:  ( 0.000,  0.851, -0.526)
Face 2:  ( 0.851,  0.526,  0.000)
Face 3:  ( 0.851, -0.526,  0.000)
Face 4:  ( 0.526,  0.000,  0.851)
Face 5:  (-0.526,  0.000,  0.851)
Face 6:  ( 0.526,  0.000, -0.851)
Face 7:  (-0.526,  0.000, -0.851)
Face 8:  ( 0.000, -0.851,  0.526)
Face 9:  ( 0.000, -0.851, -0.526)
Face 10: (-0.851,  0.526,  0.000)
Face 11: (-0.851, -0.526,  0.000)
```

### Adjacent Faces

Each face has 5 neighbors:

```
Face 0:  [1, 2, 4, 5, 10]
Face 1:  [0, 2, 6, 7, 10]
Face 2:  [0, 1, 3, 4, 6]
...etc
```

---

## Appendix B: Color Reference

### Void Colors

```css
--void-background: #0a0a0f;
--grid-primary: #00d4ff;
--grid-secondary: #006680;
--grid-intersection: #ffffff;
--ambient-glow: #001a33;
--fog-color: #000510;
```

### Roman Dodecahedron Colors (Patinated Bronze)

```css
/* Bronze Base */
--bronze-base: #5c4a32;           /* Deep bronze */
--bronze-highlight: #8b7355;      /* Worn edges */
--bronze-dark: #3d3226;           /* Shadows */

/* Patina (Oxidation) */
--patina-green: #3d6b5a;          /* Verdigris */
--patina-brown: #4a3d2d;          /* Brown oxidation */
--patina-dark: #2d3d35;           /* Dark patina spots */

/* Portal Glow */
--portal-glow-active: #c4a15a;    /* Gold inner glow */
--portal-glow-hover: #e8d4a8;     /* Brighter on hover */
--portal-edge: #8b7355;           /* Ring around hole */

/* Sealed Portals */
--sealed-grate: #00d4ff;          /* Cyan wireframe */
--sealed-glow: #006680;           /* Dim glow */

/* Vertex Spheres */
--sphere-base: #5c4a32;           /* Same as body */
--sphere-active-glow: #c4a15a;    /* Gold for active */
```

### UI Colors (from Design System)

```css
--text-primary: #2d2a26;
--text-secondary: #4a4640;
--text-light: #f2efe9;
--gold-accent: #c4a15a;
--gold-text: #6b5a42;
```

---

## Appendix C: Open Questions

**Design Refinements:**
- Interior environment style when inside dodecahedron? (bronze walls vs. seamless content)
- How prominent should exit portal be while viewing content?
- Sealed portal interaction? (tooltip vs. modal vs. nothing)
- Sound on/off toggle location and default?
- How many vertex spheres to activate in MVP?

**Technical Decisions:**
- Unity HDRP vs URP for WebGL?
- Patina texture: procedural shader vs. baked texture?
- Interior lighting when camera is inside?
- 360° sphere UI implementation approach?
- Compression strategy for WebGL build?

**Historical Authenticity:**
- How closely to match specific artifact photographs?
- Include inscriptions/markings found on real artifacts?
- Color accuracy for patina (varies by specimen)?

**Future Considerations:**
- VR mode possibility? (natural fit for portal navigation)
- Alternative shapes (expansion to cuboctahedron as originally discussed)?
- Seasonal themes for void aesthetic?
- User customization options?
- Could vertex spheres expand to hold more complex UIs?

---

## Document History

**Version 2.0** - December 2025
- Major revision: Roman Dodecahedron artifact as design basis
- Added: Portal holes (varying diameters) as navigation entry points
- Added: Vertex spheres (20) for secondary navigation / utilities
- Added: Patinated bronze material specification
- Changed: Content now lives INSIDE dodecahedron (camera flies through holes)
- Changed: Face sections → Portal holes with content visible through them
- Updated: Navigation flow for portal entry/exit sequences
- Updated: Material specifications for authentic artifact appearance

**Version 1.0** - December 2025
- Initial architecture specification
- Basic dodecahedron navigation concept
- Concept approved by stakeholder

---

## Conclusion

The **Roman Dodecahedron Navigation Architecture** creates a unique, meaningful website experience that perfectly embodies SOIL's mission. By using an actual Roman artifact — mysterious, ancient, undocumented — as our navigation interface, we create multiple layers of resonance:

**Conceptual Alignment:**

| Artifact Property | SOIL Parallel |
|-------------------|---------------|
| Unknown purpose | Organizations often fail without understanding why |
| No written records | Institutional knowledge is frequently lost |
| Found in burial contexts | We study organizational "death" |
| Holes of varying sizes | Different pathways to different knowledge |
| Spheres on vertices | Auxiliary tools support main mission |
| Survived millennia | We preserve knowledge for the future |

**Key Achievements:**

1. **Historical Authenticity** - Real Roman artifact, not generic geometry
2. **Spatial Navigation** - Users fly THROUGH portals, not click ON surfaces
3. **Dual Navigation System** - 12 face portals (content) + 20 vertex spheres (utilities)
4. **Growth Narrative** - Sealed portals invite future expansion
5. **Technical Synergy** - Shares Unity stack with Columbarium memorial
6. **Brand Alignment** - Ancient artifact (Roman) + digital void (Tron) + marble content (classical)

**The Roman Dodecahedron is the perfect symbol for SOIL: an artifact whose purpose was forgotten, now repurposed to help us remember what organizations have lost.**

---

*"Like the Roman craftsman who made these objects for purposes we can only guess, we create interfaces to preserve knowledge that might otherwise vanish."*

**— SOIL Navigation Architecture Team**

---

**Document Status:** ✅ Version 2.0 Complete — Ready for Implementation Planning
