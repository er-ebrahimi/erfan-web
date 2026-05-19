# Design System — ErfanWeb Frontend

> Persian (Farsi)-first blog/portfolio site for **studioarman.com**.

---

## 1. Tech Stack

| Category | Libraries |
|----------|-----------|
| Framework | Next.js 16 (App Router, turbopack dev) |
| Styling | Tailwind CSS v4 + CSS Variables |
| UI Library | shadcn/ui (`default` style, `neutral` base color) |
| Animations | `framer-motion` ^12.23, `tailwindcss-animate` |
| Icons | `@tabler/icons-react` (primary), `lucide-react` (secondary) |
| 3D / Particles | `three` / `@react-three/fiber` / `drei`, `@tsparticles/react` |
| Font | Iran Sans (local `next/font/local`) |
| Theme | `next-themes` (class-based dark mode) |
| Class Utils | `clsx` + `tailwind-merge` via `cn()` |
| Typography | `@tailwindcss/typography` (`.prose`) |
| Text Balance | `react-wrap-balancer` |

---

## 2. Color System

All colors use CSS custom properties in `oklch` color space, defined in `app/globals.css`.

### Theme Tokens (Light — `:root`)

| Token | Value (oklch) | Description |
|-------|---------------|-------------|
| `--background` | `0.922 0 0` / `#f2f3f4` | Page background |
| `--foreground` | `0.145 0 0` / `#242424` | Body text |
| `--card` | `1 0 0` / `#ffffff` | Card bg |
| `--card-foreground` | `0.145 0 0` | Card text |
| `--popover` | `1 0 0` | Popover/dropdown bg |
| `--popover-foreground` | `0.145 0 0` | Popover text |
| `--primary` | `0.205 0 0` | Primary buttons, links |
| `--primary-foreground` | `0.985 0 0` | Text on primary |
| `--secondary` | `0.97 0 0` | Secondary surfaces |
| `--secondary-foreground` | `0.205 0 0` | Text on secondary |
| `--muted` | `0.97 0 0` | Muted backgrounds |
| `--muted-foreground` | `0.45 0 0` | Muted/secondary text |
| `--accent` | `0.97 0 0` | Accent surfaces |
| `--accent-foreground` | `0.205 0 0` | Text on accent |
| `--destructive` | `0.577 0.245 27.325` | Destructive actions |
| `--destructive-foreground` | `0.985 0 0` | Text on destructive |
| `--border` | `0.922 0 0` | Borders, dividers |
| `--input` | `0.922 0 0` | Input borders |
| `--ring` | `0.708 0 0` | Focus rings |
| `--radius` | `0.625rem` | Border radius base |

### Theme Tokens (Dark — `.dark`)

| Token | Value (oklch) |
|-------|---------------|
| `--background` | `0.145 0 0` |
| `--foreground` | `0.985 0 0` |
| `--primary` | `0.922 0 0` |
| `--primary-foreground` | `0.205 0 0` |
| `--secondary` | `0.205 0 0` |
| `--muted` | `0.205 0 0` |
| `--accent` | `0.205 0 0` |
| `--border` | `0.205 0 0` |
| `--input` | `0.205 0 0` |
| `--ring` | `0.45 0 0` |

All other tokens invert accordingly (card → dark bg, etc.).

### Static Colors

| Name | Value | Usage |
|------|-------|-------|
| `charcoal` | `#08090A` | Near-black for overlays, dark sections |
| `lightblack` | `#1C1C1C` | Light black for dark surfaces |

---

## 3. Typography

### Font Stack

| Locale | Font Family | Source |
|--------|-------------|--------|
| `fa` (Persian) | `IRANSansWeb` (local) | `next/font/local` — `fonts/IRANSansWeb.ttf` |
| All others | `Inter` via `font-sans` | Tailwind default stack |

### Iran Sans Config

- **CSS variable:** `--font-iran-sans`
- **Range:** `400 500 600 700 800 900`
- **Display:** `swap`
- **Preload:** `true`
- **Fallback:** `system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`

### Text Sizes

**Heading** (`components/elements/heading.tsx`):

| Size | Tailwind Classes |
|------|-----------------|
| `sm` | `text-xl md:text-2xl md:leading-snug` |
| `md` (default) | `text-3xl md:text-4xl md:leading-tight` |
| `xl` | `text-4xl md:text-6xl md:leading-none` |
| `2xl` | `text-5xl md:text-7xl md:leading-none` |
| Base | `text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium` |

**Subheading** (`components/elements/subheading.tsx`):
- `text-sm md:text-base max-w-4xl text-left my-4 mx-auto text-center font-normal`

**Body:**
- Default: `text-base` (`1rem` / `16px`)
- Small: `text-sm` (`0.875rem`)
- Utility: `leading-relaxed`, `leading-snug`, `leading-tight`, `leading-none`

### Typography Plugin

`@tailwindcss/prose` configured with `dark:prose-invert` for blog content.

---

## 4. Spacing & Layout

### Container

**Container** (`components/container.tsx`):
```css
max-w-7xl mx-auto px-4 md:px-10 xl:px-4
```

### Section Spacing

| Usage | Classes |
|-------|---------|
| Default section padding | `py-10`, `py-20` |
| Large top padding | `pt-40` |
| Element gaps | `gap-1`, `gap-2`, `gap-4`, `gap-10` |
| Card padding | `p-6`, `p-8`, `md:p-10` |
| Input height | `h-10` |
| Icon containers | `h-14 w-14`, `h-16 w-16` |
| Nav items | `h-9`, `h-10` |

### Border Radius

| Token | Value |
|-------|-------|
| `lg` | `var(--radius)` = `0.625rem` |
| `md` | `calc(var(--radius) - 2px)` = `~0.5rem` |
| `sm` | `calc(var(--radius) - 4px)` = `~0.375rem` |
| `rounded-3xl` | Feature cards |
| `rounded-2xl` | Pricing inner cards |
| `rounded-xl` | Skeleton containers |

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm:` | 640px | Small text, single-column |
| `md:` | 768px | **Primary mobile/desktop split** (navbar, grids, spacing) |
| `lg:` | 1024px | Grid layout changes |
| `xl:` | 1280px | Container padding adjustments |

---

## 6. Z-Index Hierarchy

| Layer | Value | Component |
|-------|-------|-----------|
| Base content | `auto` / `z-10` | Page content |
| Beam | `z-[40]` | Meteor beam |
| Ambient color | `z-40` | Background glow |
| Navbar | `z-50` | Fixed navbar |
| Sheet/Dialog overlay | `z-50` | Modal overlays |
| Sheet/Dialog content | `z-50` | Modal panels |
| Floating dock | `z-50` | Bottom dock |
| Language selector | `z-40` / `z-50` | Floating selector |
| Carousel gradient | `z-[1000]` | Scroll fade |

---

## 7. Shadows

| Name | Definition |
|------|-----------|
| `shadow-derek` | `0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 1px -0.5px rgba(0,0,0,0.06), 0px 3px 3px -1.5px rgba(0,0,0,0.06), 0px 6px 6px -3px rgba(0,0,0,0.06), 0px 12px 12px -6px rgba(0,0,0,0.06), 0px 24px 24px -12px rgba(0,0,0,0.06)` |
| `shadow-aceternity` | `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)` |
| `shadow-sm` | shadcn default (cards) |

---

## 8. Gradients

### Background Patterns (Tailwind utilities)

| Utility | Pattern |
|---------|---------|
| `bg-grid-white/[0.02]` | SVG grid 32×32 |
| `bg-grid-small` | SVG grid 8×8 |
| `bg-dot` | Dot pattern |
| `bg-dot-thick` | Thick dot pattern |

### Common Gradient Patterns

| Pattern | Usage |
|---------|-------|
| `bg-gradient-to-t from-background to-transparent` | Hero bottom fade |
| `bg-gradient-to-b from-neutral-800 to-neutral-950` | Feature icon container |
| `bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500` | Featured badge text |
| `bg-gradient-to-r from-charcoal to-transparent` | Marquee edge fade |
| `bg-gradient-to-b from-white to-white` (text clip) | Gradient text |
| `radial-gradient(...)` via `bg-gradient-radial` | Ambient color effects |

---

## 9. Components

### Button (`components/elements/button.tsx`)

**Base:** `relative z-10 text-sm md:text-sm font-medium transition-all duration-200 rounded-md px-4 py-2 flex items-center justify-center`

| Variant | Style |
|---------|-------|
| `simple` | Transparent bg, border on hover |
| `outline` | Bg + border, hover secondary |
| `primary` (default) | Solid bg, hover lift (`-translate-y-0.5`) |
| `muted` | Muted bg, hover foreground |

Supports `as` prop for polymorphic rendering (Link, button, etc.).

### Card (`components/ui/card.tsx`)

| Sub-component | Classes |
|---------------|---------|
| `Card` | `rounded-lg border bg-card text-card-foreground shadow-sm` |
| `CardHeader` | `flex flex-col space-y-1.5 p-6` |
| `CardTitle` | `text-2xl font-semibold leading-none tracking-tight` |
| `CardDescription` | `text-sm text-muted-foreground` |
| `CardContent` | `p-6 pt-0` |
| `CardFooter` | `flex items-center p-6 pt-0` |

### Input (`components/ui/input.tsx`)

- `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
- Placeholder: `placeholder:text-muted-foreground`

### Tabs (`components/ui/tabs.tsx`)

| Sub-component | Classes |
|---------------|---------|
| `TabsList` | `inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground` |
| `TabsTrigger` | `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all` (active: `bg-background text-foreground shadow-sm`) |
| `TabsContent` | `mt-2 ring-offset-background` |

### Dialog (`components/ui/dialog.tsx`)

- Overlay: `fixed inset-0 z-50 bg-background/80 backdrop-blur-sm`
- Content: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg`
- Title: `text-lg font-semibold leading-none tracking-tight`
- Description: `text-sm text-muted-foreground`

### Sheet (`components/ui/sheet.tsx`)

- Overlay: `fixed inset-0 z-50 bg-black/50`
- Content: `bg-background fixed z-50 flex flex-col gap-4 shadow-lg`
- Sides: `left`, `right` (default), `top`, `bottom`

### Feature Card (custom)

- Container: `p-8 rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]`
- Icon container: `h-16 w-16 rounded-lg border-2 bg-[rgba(40,40,40)] border-[rgba(255,255,255,0.20)]`
- Title: `text-lg font-semibold text-white py-2`
- Description: `text-sm font-normal text-neutral-400 max-w-sm`

---

## 10. RTL (Right-to-Left)

### Active Configuration

- **Only active locale:** `fa` (Persian)
- **RTL locales list:** `['fa', 'ar', 'he', 'ur']`

### Utilities (`lib/rtl-utils.ts`)

| Function | Returns |
|----------|---------|
| `isRTL(locale)` | `true` only for `'fa'` |
| `getDirection(locale)` | `'rtl'` or `'ltr'` |
| `getTextAlignClass(locale)` | `'text-right'` or `'text-left'` |
| `getFontClass(locale)` | `'font-iran-sans'` or `'font-sans'` |
| `getSpacingClasses(locale, baseClass)` | Swaps `ml`/`mr`, `pl`/`pr`, `left`/`right` |

### Locale-aware Layout

- `dir` attribute on root wrapper: `dir={direction}`
- Font class applied via `cn()` alongside locale classes
- Text alignment flipped via `getTextAlignClass()`
- Spacing utilities swapped via `getSpacingClasses()`

---

## 11. Dark Mode

- **Strategy:** Class-based (`class` strategy via `next-themes`)
- **Provider:** `components/theme-provider.tsx` wrapping next-themes `ThemeProvider`
- **Config:** `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`
- **Toggle:** `components/theme-toggle.tsx` — Sun/Moon icons, `variant="muted"`, `w-9 h-9 p-0`
- **Convention:** All components use `dark:` prefix for overrides (e.g., `dark:bg-neutral-900`, `dark:text-white`, `dark:border-neutral-700`)

---

## 12. Animation Patterns

### Framer Motion

| Pattern | Config | Usage |
|---------|--------|-------|
| Default spring | `{ stiffness: 260, damping: 35 }` | Modal enter/exit |
| Light spring | `{ stiffness: 100, damping: 20, mass: 0.5 }` | Draggable card |
| Tooltip spring | `{ stiffness: 260, damping: 10 }` | Tooltip popup |
| Dock spring | `{ mass: 0.1, stiffness: 150, damping: 12 }` | Floating dock |
| Stagger | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` | Carousel items |
| Hover | `whileHover={{ scale: 1.02 }}` | Card hover |
| Layout | `layoutId` | Shared layout animations |

### CSS Animations

| Name | Duration | Keyframes |
|------|----------|-----------|
| `move` | 5s linear infinite | `translateX(-200px)` → `translateX(200px)` |
| `spin-circle` | 3s linear infinite | `rotate(0deg)` → `rotate(360deg)` |

### Packages

- `framer-motion` ^12.23 — complex animations
- `tailwindcss-animate` — Tailwind animation utilities
- `@tsparticles/react` + `@tsparticles/slim` — particle effects

---

## 13. Icons

| Source | Usage |
|--------|-------|
| `@tabler/icons-react` | **Primary** — nav, features, pricing, testimonials |
| `lucide-react` | Theme toggle (Sun, Moon), dialog close (X) |
| Custom illustrations | Social media icons (Facebook, Instagram, LinkedIn, Twitter, etc.) |

---

## 14. Layout Structure

```
<html>
  <GlobalErrorBoundary>
    <SlugProvider>
      <body>
        <NextIntlClientProvider>
          <ViewTransitions>
            <ThemeProvider>
              <AuthProvider>
                <CartProvider>
                  <div dir="rtl" className="...">
                    <Navbar />
                    {children}
                    <Footer />
                  </div>
                </CartProvider>
              </AuthProvider>
            </ThemeProvider>
          </ViewTransitions>
        </NextIntlClientProvider>
      </body>
    </SlugProvider>
  </GlobalErrorBoundary>
</html>
```

---

## 15. Coding Conventions

- Use `cn()` from `@/lib/utils` for class merging (never raw template strings)
- Component variants via `class-variance-authority` (CVA)
- All UI text added to all available message files (`fa`, `en`, `fr`)
- `console.error` / `console.warn` only (no `console.log`)
- Prefer CSS variables via `oklch` for theme colors
- Dark mode via `dark:` prefix on all components
- shadcn/ui components in `@/components/ui/`, custom in `@/components/elements/`
