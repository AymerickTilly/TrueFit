# DESIGN.md — TrueFit Design System

## Color tokens

All tokens live in `src/index.css` as CSS custom properties.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#f5f5f4` | Page background (stone-100) |
| `--fg` | `#1c1917` | Body text (stone-900) |
| `--card` | `#ffffff` | Surface — cards, topbar, panels |
| `--border` | `#e7e5e4` | Dividers, input outlines (stone-200) |
| `--input` | `#d6d3d1` | Input border focus ring base (stone-300) |
| `--primary` | `#2563eb` | CTAs, active states, links (blue-600) |
| `--primary-fg` | `#ffffff` | Text on primary background |
| `--muted` | `#f5f5f4` | Subtle background tints |
| `--muted-fg` | `#78716c` | Secondary text (stone-500) |
| `--ring` | `#2563eb` | Focus ring color |

Dark mode overrides are defined in `@media (prefers-color-scheme: dark)`.

Tailwind theme aliases (`--color-background`, `--color-foreground`, etc.) are mapped in the `@theme inline` block.

## Typography

**Font**: Figtree (Google Fonts) — geometric humanist. Weights 300, 400, 500, 600, 700.

| Role | Size | Weight | Usage |
|---|---|---|---|
| Page title | `text-xl` (20px) | `font-semibold` | `<h1>` on each page |
| Section label | `text-sm` (14px) | `font-semibold` | Two-column section headers |
| Body | `text-sm` (14px) | `font-normal` | Form labels, card content |
| Caption / meta | `text-xs` (12px) | `font-normal` | Descriptions, muted hints |
| Wordmark | `text-[15px]` | light + semibold | `True` (300) `Fit` (600) |

- `h1, h2, h3` have `text-wrap: balance` globally.
- Body line length capped at `max-w-3xl` (~65ch at standard viewport).
- No eyebrow labels (`text-xs uppercase tracking-widest`). Section identity comes from weight and spacing.

## Spacing rhythm

Base unit: 4px (Tailwind default).

| Context | Value |
|---|---|
| Page padding | `px-8 py-10` |
| Section vertical gap | `py-10` (40px) |
| Section inner gap | `gap-10` (40px) between label col and content |
| Card inner padding | `px-6 py-5` or `px-4 py-3` (compact) |
| Form field gap | `space-y-5` |
| Topbar height | `52px` (`h-[52px]`) |
| Sidebar width (generate) | `288px` (`w-72`) |

## Z-index scale

| Layer | Value | Used for |
|---|---|---|
| Topbar | `z-40` | Sticky navigation header |
| Dropdown / popover | `z-50` | Account menu, any popover |
| Dialog backdrop | (top-layer) | Native `<dialog>` via `showModal()` — no z-index needed |
| Dialog | (top-layer) | Same — browser handles stacking |

Never use arbitrary values like `z-999`.

## Motion

All animations use `cubic-bezier(0.16, 1, 0.3, 1)` (expo ease-out) at 300–450ms.
Every animation has a `@media (prefers-reduced-motion: reduce)` guard.

| Animation | Duration | Trigger |
|---|---|---|
| Scroll-reveal (sections) | 450ms | IntersectionObserver via `useReveal` hook |
| Dialog enter (expand editor) | 300ms | `dialog[open]` |
| Nav active underline | 150ms | Route change |
| Color / opacity transitions | 150ms | Hover, focus |

## Components

### Button (`src/components/ui/button.tsx`)
Variants: `primary`, `secondary`, `ghost`, `destructive`.
Sizes: `sm`, `md`.
Always has `cursor-pointer`. Focus ring: `focus-visible:ring-2 focus-visible:ring-ring`.

### Input (`src/components/ui/input.tsx`)
Box-style with border. Used in app pages (not auth).
Auth pages use underline inputs defined inline (border-b only).

### ExpandEditor (`src/components/ui/expand-editor.tsx`)
Inline preview button → native `<dialog>` modal with full textarea.
Used for long free-form fields (professional statement, personal attributes).

### SkillCard (`src/components/profile/skill-card.tsx`)
Compact rounded pill. Context dot (blue/violet/emerald/stone). Delete on hover.
Displayed in `flex flex-wrap gap-2`.

### Section (inline in `src/pages/profile.tsx`)
Two-column layout: `w-44` label/description left, `flex-1` content right.
Each section uses `useReveal` hook for scroll-reveal entrance.

## Absolute bans

- No gradient text (`background-clip: text`)
- No side-stripe borders (`border-left` > 1px as accent)
- No glassmorphism decoratively
- No eyebrow labels (`text-xs uppercase tracking-widest` on every section)
- No numbered section markers (01 / 02 / 03) as scaffolding
- No nested cards
- No arbitrary z-index values
