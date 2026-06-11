# Design.md - Cipherwill Design System

> The definitive source of truth for visual design, tokens, and frontend philosophy.
> Do not edit without a design discussion. Covers public pages
> Design for app dahboard and executor dashbaord is in app.design.md
> Avoid full project builds for minor changes. Only run a full build when significant changes have been made and build verification is needed.

---

## 1. Design Philosophy

Cipherwill sits at the intersection of two worlds that rarely meet: **digital infrastructure** and **deeply human legacy planning**. The design system must hold both without compromise.

### Dual Engine Principle

**Institutional Rigor** - Every layout must feel solid, secure, and permanent. Users are trusting the platform with their ultimate legacy. Structural ambiguity signals vulnerability.

**Radical Calmness** - The platform treats asset protection and legacy transition not as a cold legal or technical task, but as an act of profound care. Interfaces use space and softness to actively lower the user's cognitive load.

---

## 2. Scope

| Route | Theme |
|---|---|
| `/` and all public pages | Light only - Warm Cream canvas, no dark toggle |
| `/app/*` | Light + Dark mode supported |
| `/executor/*` | Light + Dark mode supported |

Dark mode is a dashboard concern only. Public pages are always light.

---

## 3. Color Tokens

### Public Page Surfaces

```
Canvas (Primary):       #FBF9F1  - Warm Cream. Never pure white.
Card Surface:           #F4F1EA  - Gentle Parchment. Cards sit on canvas.
```

### Text

```
Text Primary:           #2A363B  - Deep Forest Slate. Replaces raw black.
Text on Dark:           #FBF9F1  - Warm Cream. Replaces raw white.
Text Muted:             Use Tailwind neutral-500 / neutral-400 on dark.
```

### Dark Section Backgrounds (Public Pages)

```
Dark Section:           #2A363B  - Deep Forest Slate. Mid-page dark blocks.
Footer / Closing:       #2C1A0E  - Deep Mahogany. Warm, archival, final.
```

### Dashboard Dark Mode Surfaces

```
App Canvas Dark:        #1f1f1e  - Dark Charcoal.
App Card Dark:          #2c2c2a  - Charcoal lifted.
```

### Actions

```
CTA Primary:            #003ecb  - Electric Blue. All primary buttons and links.
CTA Hover:              #004eff  - Brighter blue on hover.
CTA on Dark:            #003ecb  - Same. Holds contrast on navy backgrounds.
```

### Supporting Accents

```
Sage:                   #7AA089  - Success states, "secured" badges, encrypted confirmations.
Clay:                   #D4A390  - Empathy moments. Guide panels, executor flows, onboarding callouts.
```

### Feedback

```
Success:                #7AA089  - Sage (reuse)
Error:                  #C0392B  - Deep red. Form errors, destructive actions.
Warning:                #C87941  - Warm amber. Non-critical alerts.
Info:                   #003ecb  - CTA Blue (reuse)
```

### Borders

```
Border Light:           rgba(42, 54, 59, 0.08)   - On cream/light surfaces.
Border Dark:            rgba(251, 249, 241, 0.08) - On navy/dark surfaces.
```

Borders are always thin and crisp. No heavy box shadows on standard UI. Shadows reserved for elevated layers only.

---

## 4. Typography

### Font Families

```
Headings:    Playfair Display - serif, editorial, authoritative.
Body / UI:   Gilroy - geometric sans-serif, all weights 100–900.
Monospace:   JetBrains Mono / Geist Mono - crypto fields only.
             Used for: seed phrases, wallet keys, hashes, timestamps.
```

### Usage Rules

- Playfair Display is for H1 and H2 only on public pages. Never in the dashboard UI.
- Gilroy handles everything else: body copy, buttons, labels, nav, sidebar, form fields.
- Monospace is strictly for data integrity contexts - anywhere the user sees a key, hash, or cryptographic value.
- Type scale and sizes follow Tailwind defaults. No custom scale - stay on the standard grid.
- Font weights follow Tailwind defaults. Gilroy maps naturally across all Tailwind weight utilities.

---

## 5. Spacing & Layout

- Spacing scale follows Tailwind defaults (4pt base, 8pt rhythm).
- Breakpoints follow Tailwind defaults (sm, md, lg, xl, 2xl).
- Section layouts on public pages require generous vertical padding - prefer py-24 or py-32 on desktop. White space is a core feature, not wasted space.

---

## 6. Border Radius

```
Interactive elements (buttons, inputs, selects):   12px  - rounded-xl approx.
Containers, cards, modals:                         16px  - rounded-2xl approx.
Pill toggles (filter switches, tab selectors):     9999px - rounded-full.
```

Sharp corners are not used on any interactive UI. Everything feels approachable and tactile.

---

## 7. Elevation & Shadows

```
Level 0 - Flat:       No shadow. Border only. Default for cards and inputs.
Level 1 - Raised:     Subtle shadow for dropdowns and popovers.
Level 2 - Floating:   Modals, drawers, command menus.
Level 3 - Overlay:    Full-screen overlays and critical dialogs.
```

Lean flat by default. Only introduce shadow when an element genuinely floats above the page.

---

## 8. Z-Index Scale

```
Base:       0
Sticky:     100   - Header, sidebar
Dropdown:   200   - Menus, tooltips
Modal:      300   - Dialogs, drawers
Toast:      400   - Notifications
```

---

## 9. Component States

Every interactive element must have all five states defined before shipping:

```
Default   → base appearance
Hover     → subtle background shift or color lift
Active    → scale(0.98) press feedback
Disabled  → opacity-50, cursor-not-allowed, no pointer events
Focus     → 2px solid #003ecb, offset 2px (keyboard navigation)
```

Focus rings are mandatory. Never suppress outline entirely.

---

## 10. Buttons

### Variants

```
Primary:    #003ecb background, white Gilroy text, 12px radius
Secondary:  Transparent, border rgba(42,54,59,0.2), Forest Slate text
Danger:     #C0392B background, white text
Pill:       Fully rounded (9999px), used for toggles and filter switches
```

### Rules

- Arrow-suffixed labels (e.g. "Get Started →") signal forward movement on public CTAs.
- All buttons use scale(0.98) on active press with a 200ms spring transition.
- Primary button gradient: from-primary-700 to-primary - retained from existing SimpleButton.

---

## 11. Forms

```
Input height:       44px minimum (touch target)
Input padding:      12px horizontal
Label position:     Above the field. Never floating.
Error display:      Red border (#C0392B) + error message below field.
Helper text:        Small muted text below field, visible by default if relevant.
```

---

## 12. Iconography

```
Library:      react-icons - Tabler (tb) as primary set for consistency.
Sizes:        16px inline text, 20px standard UI, 24px prominent/sidebar.
Stroke:       Tabler default 1.5px stroke weight throughout.
Pairing:      Icons always paired with a label or tooltip. Never icon-only on critical actions.
```

---

## 13. Motion & Animation

All motion must feel deliberate, supportive, and premium. No bounces. No rapid linear transforms.

### Frameworks

```
Framer Motion   - component-level animations, page transitions, wizard flows
Lenis           - smooth scrolling across all pages
GSAP            - complex scroll-driven sequences and timelines
```

### Easing Standard

```css
/* Fluid container morphing - tabs, view switches */
transition: width 0.28s cubic-bezier(0.25, 1, 0.5, 1),
            height 0.28s cubic-bezier(0.25, 1, 0.5, 1);
```

### Component Stacking (Wizards & Progressive Forms)

Subsequent fields slide upward from Y: 8px, opacity: 0 to 1. Allows the eye to track structural changes naturally.

### Micro-feedback

```
Button press:               scale(0.98), 200ms spring
Success confirmation:       Stroke-dashoffset draw animation (checkmark)
Encryption confirmation:    Progressive fill animation - rewards the user
Skeleton loaders:           Shimmer on async content
Page transitions:           Smooth fade + slight upward drift
```

### Reduced Motion

html.cw-reduced-motion disables all animations via !important overrides. Already implemented - maintain this on all new animation additions.

---

## 14. Progressive Isolation - Wizard UX

When a user is performing a sensitive action - configuring a dead man's switch, assigning an executor, setting up security factors - strip all global navigation and footer.

Rules for isolation flows:
- One core decision per view. Never two simultaneous choices.
- Every decision is paired with an adjacent Guide Panel - a styled contextual box explaining why this choice matters in plain language. Eliminates legal and technical intimidation.
- Clay #D4A390 is the Guide Panel accent color.
- Progress indicator always visible (dots or step counter).
- Single back action available. No escape to global nav mid-flow.

---

## 15. Public Page Layout Rhythm

### Alternating Section Pattern

Public pages use a deliberate alternating contrast rhythm to reset user attention as they scroll:

```
Section 1:   Light  - Warm Cream #FBF9F1
Section 2:   Dark   - Forest Slate #2A363B
Section 3:   Light  - Warm Cream #FBF9F1
Section N:   Dark   - Forest Slate #2A363B  (optional)
Footer:      Deep Mahogany #2C1A0E
```

This is a design guideline - apply it on new public pages. Not a hard enforcement on existing pages.

### Header

Minimalist 3-zone architecture:

```
Logo | Utility Nav | Single Primary CTA
```

Soft backdrop-filter: blur(12px) on scroll over content. Transparent base over canvas color.

---

## 16. Media & Rich Content

The platform must come alive through media. Static text-only pages are not acceptable for the public marketing surface.

### Photography

- Style: High-quality, authentic lifestyle imagery. Families, generations, quiet moments of relief.
- Tone: Warm, candid, naturally lit. Never generic corporate stock photography.
- Backgrounds: No pure white backgrounds in photos - they clash with the cream canvas.
- Aspect Ratios: Hero 16:9, Cards 3:2, Avatars 1:1.

### Video

- Use video to demonstrate the platform - dashboard walkthroughs, how encryption works, onboarding previews.
- Autoplay allowed only when muted and looped for ambient/background use.
- Full narrated explainer videos for feature education pages.

### Charts & Data Visualization

- Use charts to make security and asset coverage tangible - e.g. "X% of your assets are secured."
- Style: flat, minimal, using brand palette. No heavy grid lines.
- Animate on scroll-enter for impact.

### Animated Sections

- Scroll-driven animations via GSAP for feature explainer sections.
- Counter animations for stats (e.g. "10,000+ users", "256-bit encryption").
- Lottie or CSS animations for illustrative moments.

### Interactive Sections

- Quiz-style flows to help users identify what plan they need.
- Interactive security checklist on landing pages.
- Live demos or embedded product previews showing the actual dashboard.
- Hover-reveal details on pricing comparison tables.

---

## 17. Accessibility Baseline

```
Contrast ratio:     4.5:1 minimum for body text, 3:1 for large text.
Focus rings:        2px solid #003ecb, offset 2px. Never suppressed.
Color meaning:      Never use color as the only signal - always pair with icon or text.
Touch targets:      44px minimum height on all interactive elements.
Reduced motion:     html.cw-reduced-motion already implemented - maintain on all new additions.
```

---

## 18. Route-Specific Guides

- **[app.design.md](./app.design.md)** - Dashboard styling for `/app` and `/executor` routes.
