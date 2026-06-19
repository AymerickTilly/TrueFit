# LAYOUT.md — TrueFit Shell & Page Templates

## Shell anatomy

```
┌─────────────────────────────────────────────────────────┐
│  TrueFit   Profile   Applications   Generate        [A]  │  ← 52px topbar (sticky, bg-card, border-b)
├─────────────────────────────────────────────────────────┤
│                                                           │
│                    <page content>                         │  ← flex-1, each page owns its layout
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Component**: `src/components/layout/app-shell.tsx`

### Topbar
- Height: `52px` — fixed, never grows
- Background: `bg-card` (white) with `border-b border-border`
- Sticky: `sticky top-0 z-40`
- Left: TrueFit wordmark (`True` font-light, `Fit` font-semibold, 15px)
- Center-left: nav links (plain text, no icons)
- Right: avatar circle → account dropdown menu

### Nav links
- Active indicator: `after:absolute after:bottom-0 after:h-px after:bg-foreground` — hairline underline at topbar bottom edge
- Active text: `text-foreground font-medium`
- Inactive text: `text-muted-foreground hover:text-foreground`
- No background pills. No icons. Weight + underline carry all meaning.

### Account dropdown
- Triggered by avatar button (`aria-haspopup="menu"`, `aria-expanded`)
- Items: email (read-only), Account settings, Sign out
- Positioned `absolute right-0 top-[calc(100%+6px)]` — escapes no clip constraint because topbar is not `overflow:hidden`
- Closed on outside click via `mousedown` listener

---

## Page templates

### Settings template — Profile, Account, Applications
Full-width content centered in `max-w-3xl`, padded `px-8 py-10`.

```
<div className="mx-auto max-w-3xl px-8 py-10">
  <h1>Page title</h1>
  <p>subtitle / email</p>

  <Section title="…" description="…">
    {/* content */}
  </Section>
  …
</div>
```

**Section component** (defined in `src/pages/profile.tsx`, copy pattern for other pages):
```tsx
function Section({ title, description, children }) {
  const ref = useReveal()
  return (
    <section ref={ref} data-reveal className="flex gap-10 border-t border-border py-10">
      <div className="w-44 shrink-0 pt-0.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </section>
  )
}
```

- Label column: `w-44 shrink-0` — 176px, never grows
- Content column: `flex-1 min-w-0` — takes all remaining space
- Divider: `border-t border-border` on the section itself (not a separate `<hr>`)
- Scroll-reveal: each section fades+rises via `useReveal` hook and `data-reveal` CSS

### Split-panel template — Generate
Full viewport height minus topbar. Left panel fixed width, right panel fills remainder.

```
<div className="flex h-[calc(100vh-52px)]">
  <aside className="w-72 shrink-0 border-r border-border overflow-y-auto px-6 py-8">
    {/* controls: job selector, profile summary, generate button */}
  </aside>
  <div className="flex-1 overflow-y-auto">
    {/* output or empty state */}
  </div>
</div>
```

- Left panel (`w-72` = 288px): job selector, profile summary card, Generate button, status text
- Right panel: CV output in `max-w-3xl mx-auto px-10 py-8`, or centered empty state
- Empty state: icon + title + one-line instruction, vertically centered with `flex h-full items-center justify-center`

---

## Scroll-reveal

Every top-level `<section>` in the settings template uses `useReveal`:
- Hook: `src/hooks/use-reveal.ts`
- Mechanism: IntersectionObserver sets `data-reveal="visible"` on entry
- Animation: `reveal-up` keyframe (opacity 0→1, translateY 18px→0, 450ms expo ease)
- Guard: `prefers-reduced-motion: reduce` shows content instantly, no animation

---

## Auth pages

Auth pages (`/login`, `/signup`, `/forgot-password`, `/reset-password`) do **not** use `AppShell`. They are standalone white pages (`bg-white`) with:
- No persistent navigation
- TrueFit wordmark only (same weight-contrast pattern)
- Underline inputs (border-b only, no border-box)
- Max width `max-w-sm` centered

---

## What not to do

- No sidebar navigation — the topbar is the only nav chrome
- No persistent icon nav (icon + label vertical stack)
- No dark chrome on the authenticated shell — the topbar is white/card
- No page-level max-width on the generate page — it uses a split panel
- No nested cards inside section content (cards within the settings template content area are fine)
