# app.design.md — Dashboard Design

> Applies to: `/app/*` and `/executor/*` routes only.
> This file is a derivation of Design.md — it does not repeat global tokens, motion, typography families, spacing, or accessibility rules. Read Design.md first.

---

## 1. Philosophy

The dashboard is where trust is earned or lost. Every interaction here involves real sensitive data — passwords, seed phrases, executors, beneficiaries. The design must reinforce two things simultaneously:

- **Security is visible** — the user should always feel their data is protected and under control.
- **The task is manageable** — complexity is hidden behind calm, structured layouts that never overwhelm.

---

## 2. Theme & Color

Dark mode is supported on these routes only. Public pages are light-only — see Design.md scope table.

### Light Mode Surfaces

```
Content Canvas:         #FBF9F1  — Warm Cream. Same as public canvas. Unified product feel.
Sidebar Background:     #FFFFFF  — Pure white. Slight lift against the cream content area.
Card / Tile Surface:    #FFFFFF  — White cards on cream canvas creates clear hierarchy without shadow.
```

### Dark Mode Surfaces

```
Content Canvas:         #0B1B2B  — Deep Navy.
Sidebar Background:     #101113  — One step darker than canvas. Grounds the sidebar.
Card / Tile Surface:    #112236  — Navy lifted. Cards sit above the canvas.
```

### Active & Interactive States (Sidebar)

```
Active item light:      bg-primary-50 + border-l-4 border-primary (#003ecb)
Active item dark:       bg-#112236 + border-l-4 border-primary (#003ecb)
Hover light:            bg-neutral-100
Hover dark:             bg-neutral-800
```

The left blue border is the active signal. It is always `#003ecb` in both modes — the single consistent anchor that tells the user where they are.

### Text (Dashboard-specific)

```
Page title:             font-semibold, Tailwind text-xl or text-2xl
Section header:         font-semibold, text-base
Sidebar item:           font-medium, text-sm
Sidebar divider label:  font-semibold, text-xs, neutral-500 / neutral-400 dark
Data label:             font-medium, text-sm, muted
Data value:             font-semibold, text-sm or text-base
Crypto / key values:    JetBrains Mono / Geist Mono — always monospace, no exceptions
```

---

## 3. Layout Shell

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar                  │  Content Area               │
│  w-min (mobile)           │  flex-1                     │
│  sm:w-60 (desktop)        │  overflow-y-auto            │
│                           │  p-4 sm:p-6                 │
│  bg-white / #101113       │  bg-#FBF9F1 / #0B1B2B       │
│  border-r border-default  │                             │
└─────────────────────────────────────────────────────────┘
```

- Viewport: `w-screen cw-vh-screen cw-app-safe-area` — handles 100dvh and iOS safe areas.
- Sidebar is always visible on desktop, collapsed to icon-only on mobile.
- Content area is the only scrollable region. Sidebar never scrolls independently unless nav items overflow.

---

## 4. Sidebar Anatomy

Top to bottom:

```
1. Logo                  — SidebarLogo component, links to /app
2. Nav Items             — grouped by section dividers
3. Section Dividers      — thin border-default line + optional label
4. Theme Toggle          — pinned to bottom, SwitchThemeButton (sun/moon)
```

### Nav Item Structure

```
[Icon 20px]  [Label text-sm font-medium]  [Optional trailing badge]
```

- Icon: Tabler (tb) set, 20px, 1.5px stroke.
- On mobile: icon only, no label, centered.
- On desktop: icon + label, left-aligned.
- Active: left blue border + subtle fill (see Section 2).
- Hover: `bg-neutral-100` / `bg-neutral-800`.
- No nested sub-navigation. Flat nav only.

---

## 5. Page Header (Per-Page)

Each page inside `/app` has its own fixed header at the top of the content area.

```
┌──────────────────────────────────────────────────────┐
│  [Page Title — font-semibold text-2xl]   [Action CTA]│
│  [Optional subtitle — text-sm muted]                 │
└──────────────────────────────────────────────────────┘
```

- Title: plain Gilroy, `font-semibold`, `text-xl` or `text-2xl`. Never Playfair Display — that is public pages only.
- Action CTA: primary `SimpleButton` aligned right. One action maximum. E.g. "Add Password", "Add Beneficiary".
- Subtitle: optional, one line, muted, `text-sm`. Used for context — e.g. "Encrypted and secured for your beneficiaries."
- No breadcrumbs. The sidebar already shows location. Breadcrumbs add noise.

---

## 6. Topbar

Appears above content area on all dashboard pages.

```
[Mobile menu trigger]   [Page section name]   [Profile popup]
```

- Profile popup: avatar button → dropdown with Profile, Home, Logout.
- Dropdown: `rounded-xl`, `border-default`, white / dark-800 bg, `text-sm font-medium` items.
- No global search in topbar for now. (Cmd+K is aspirational — see Design.md.)

---

## 7. Data Tiles — Card Grid

All data types (passwords, notes, seed phrases, bank accounts, payment cards, etc.) render as **cards in a grid**.

```
Grid:           grid-cols-1 sm:grid-cols-2 lg:grid-cols-3, gap-4
Card:           bg-white dark:bg-#112236
                border border-default
                rounded-2xl (16px)
                p-4
                flat — no shadow (Level 0 elevation)
```

### Card Anatomy

```
┌─────────────────────────────────┐
│  [Icon 20px]  [Type label]      │
│                                 │
│  [Primary value — font-semibold]│
│  [Secondary detail — muted sm]  │
│                                 │
│  [Action row — icon buttons]    │
└─────────────────────────────────┘
```

- Sensitive values (passwords, keys, seed phrases) are masked by default. Reveal on explicit user action only.
- Masked value renders in monospace: `••••••••••••` — JetBrains Mono.
- Revealed value renders in monospace: actual value — JetBrains Mono.
- Action row: icon-only buttons (copy, edit, delete) at card bottom. Always visible, never hidden in a dropdown for primary actions.
- Cards do not animate on hover beyond a subtle `border-color` lift to `border-primary` (#003ecb at 30% opacity).

---

## 8. Empty States

Shown when a data section has no items yet. This is an empathy moment, not an error.

```
┌─────────────────────────────────────┐
│                                     │
│       [Minimal illustration]        │
│                                     │
│   [Plain-language heading]          │
│   [One sentence of context]         │
│                                     │
│       [Primary CTA Button]          │
│                                     │
└─────────────────────────────────────┘
```

- Illustration: simple, warm, minimal. Clay `#D4A390` as the accent tone.
- Heading: `font-semibold text-lg`, Forest Slate / Warm Cream.
- Context: one sentence max. Plain language. E.g. "Add your passwords so your beneficiaries can access them when needed." Never technical.
- CTA: single primary blue button. One action only.
- No bullet lists. No multiple options. One decision per empty state — consistent with Progressive Isolation principle from Design.md.

---

## 9. Executor Dashboard

`/executor/[id]/*` — Same shell as `/app`. Key differences:

```
Sidebar header:   Shows donor's name prominently below the logo.
                  "Data of [Donor Name]" — text-sm, centered, muted.

Data views:       Read-only. No add/edit/delete actions.
                  Action row on cards is hidden or shows copy-only.

Visual signal:    A persistent read-only badge or banner at the top of content area.
                  Subtle, not alarming — executor has legitimate access.
                  Use Sage #7AA089 as the "access granted" color signal.

Return link:      Pinned above theme toggle in sidebar.
                  "Go to Cipherwill App" — links back to /app.
```

The executor dashboard must feel calm and clear. The executor is often in a difficult life moment. Every view should feel like a trusted handoff, not a system intrusion.

---

## 10. Onboarding Checklist

Shown on the dashboard home for new users until all steps are complete.

- Container: card style (white / `#112236`, `rounded-2xl`, `border-default`, `p-4`).
- Each step: checkbox-style row with completion state.
- Completed step: Sage `#7AA089` checkmark + muted text.
- Pending step: blue circle indicator + active text.
- Dismiss: auto-hides when all steps complete. No manual dismiss.
- This is a Guide Panel in spirit — each step explains *why* it matters, not just *what* to do.

---

## 11. Theme Toggle

- Component: `SwitchThemeButton` — sun (light) / moon (dark) icon.
- Persisted in `localStorage["theme"]`.
- Applied via `class` strategy on `#app-theme-layout`.
- Pinned to bottom of sidebar on all dashboard routes.
- Not shown anywhere on public pages.
