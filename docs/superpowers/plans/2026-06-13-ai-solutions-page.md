# AI Solutions Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a premium, RTL-first AI-services page at `/fa/ai-solutions`, built from Strapi dynamic-zone blocks, with non-regressing/perfect SEO.

**Architecture:** New Strapi component schemas (6 dynamic-zone blocks + 4 shared sub-components) registered in the `page` content type; matching RTL-first Next.js block components registered in `manager.tsx`; SEO wired via a reusable `<JsonLd>` and a sitemap that enumerates Strapi pages; the page itself created by an idempotent Strapi seed (+ admin recipe). No routing code is added — the existing `[locale]/(marketing)/[slug]` route renders it.

**Tech Stack:** Strapi 5.36, Next.js 16 (App Router), Tailwind v4, framer-motion 12, `@tabler/icons-react`, three/@react-three/fiber (existing `CanvasRevealEffect`), next-intl (fa), `next/font/local` IranSans.

**Reference spec:** `docs/superpowers/specs/2026-06-13-ai-solutions-page-design.md`

**Quality gates (this repo has no unit-test runner):** from `next/`, `yarn lint`, `yarn typecheck`, `yarn build`. From `strapi/`, `yarn develop` must boot cleanly. Manual checks where noted.

**Branch:** `feat/ai-solutions-page` (already created; spec already committed).

---

## File Structure (decomposition)

**Strapi — schemas**
- `strapi/src/components/shared/capability.json` (new) — icon/title/description card datum
- `strapi/src/components/shared/use-case.json` (new) — case-study card datum
- `strapi/src/components/shared/metric.json` (new) — animated metric datum
- `strapi/src/components/shared/integration.json` (new) — dock item datum
- `strapi/src/components/shared/steps.json` (modify) — add optional `icon`
- `strapi/src/components/dynamic-zone/{ai-hero,capabilities,process,use-cases,metrics,integrations}.json` (new) — the 6 blocks
- `strapi/src/api/page/content-types/page/schema.json` (modify) — register 6 UIDs
- `strapi/src/index.ts` (modify) — idempotent guarded seed

**Next — SEO infra**
- `next/components/seo/json-ld.tsx` (new) — reusable JSON-LD `<script>`
- `next/app/[locale]/(marketing)/[slug]/page.tsx` (modify) — inject JsonLd from `seo.structuredData`
- `next/app/[locale]/(marketing)/page.tsx` (modify) — homepage parity
- `next/app/sitemap.ts` (modify) — enumerate Strapi pages
- `next/app/layout.tsx` (modify, optional) — `metadataBase`

**Next — blocks**
- `next/components/dynamic-zone/{ai-hero,capabilities,process,use-cases,metrics,integrations}.tsx` (new)
- `next/components/dynamic-zone/manager.tsx` (modify) — register 6 keys
- `next/components/dynamic-zone/testimonials/index.tsx` (modify) — RTL
- `next/components/dynamic-zone/faq.tsx` (modify) — RTL + FAQPage JSON-LD
- `next/components/ui/apple-cards-carousel.tsx` (modify) — locale-aware dir
- `next/components/dynamic-zone/brands.tsx`, `form-next-to-section.tsx` (verify RTL)
- `next/messages/{fa,en,fr}.json` (modify) — `aiSolutions` chrome strings

**Docs**
- `docs/ai-solutions-admin-recipe.md` (new)

> Convention reminders: every component receives spread Strapi props + `locale`; media via `StrapiImage`; RTL via `getLocaleConfig(locale)`/`isRTL` modeled on `next/components/ui/timeline.tsx` and `next/components/dynamic-zone/plans.tsx`; framer-motion only; WebGL imported `ssr:false`; `cn()` for classes; no `console.log`.

---

## Phase A — Strapi schemas

### Task A1: New shared sub-components + steps icon

**Files:**
- Create: `strapi/src/components/shared/capability.json`
- Create: `strapi/src/components/shared/use-case.json`
- Create: `strapi/src/components/shared/metric.json`
- Create: `strapi/src/components/shared/integration.json`
- Modify: `strapi/src/components/shared/steps.json`

- [ ] **Step 1: Create `capability.json`**

```json
{
  "collectionName": "components_shared_capabilities",
  "info": { "displayName": "Capability", "icon": "grid", "description": "" },
  "options": {},
  "attributes": {
    "title": { "type": "text" },
    "description": { "type": "text" },
    "icon": { "type": "text" },
    "span": { "type": "enumeration", "default": "one", "enum": ["one", "two"] },
    "accent": { "type": "text" }
  }
}
```

- [ ] **Step 2: Create `use-case.json`**

```json
{
  "collectionName": "components_shared_use_cases",
  "info": { "displayName": "Use Case", "icon": "cards", "description": "" },
  "options": {},
  "attributes": {
    "title": { "type": "text" },
    "category": { "type": "text" },
    "description": { "type": "text" },
    "image": { "type": "media", "multiple": false, "allowedTypes": ["images", "files", "videos"] }
  }
}
```

- [ ] **Step 3: Create `metric.json`**

```json
{
  "collectionName": "components_shared_metrics",
  "info": { "displayName": "Metric", "icon": "chartBar", "description": "" },
  "options": {},
  "attributes": {
    "value": { "type": "decimal" },
    "prefix": { "type": "text" },
    "suffix": { "type": "text" },
    "label": { "type": "text" },
    "icon": { "type": "text" }
  }
}
```

- [ ] **Step 4: Create `integration.json`**

```json
{
  "collectionName": "components_shared_integrations",
  "info": { "displayName": "Integration", "icon": "plugConnected", "description": "" },
  "options": {},
  "attributes": {
    "title": { "type": "text" },
    "icon": { "type": "media", "multiple": false, "allowedTypes": ["images", "files"] },
    "iconName": { "type": "text" },
    "href": { "type": "text" }
  }
}
```

- [ ] **Step 5: Add optional `icon` to `steps.json`**

Modify `strapi/src/components/shared/steps.json` attributes to:

```json
  "attributes": {
    "title": { "type": "text" },
    "description": { "type": "text" },
    "icon": { "type": "text" }
  }
```

- [ ] **Step 6: Verify JSON validity**

Run: `cd strapi && node -e "['capability','use-case','metric','integration','steps'].forEach(f=>JSON.parse(require('fs').readFileSync('src/components/shared/'+f+'.json','utf8')))" && echo OK`
Expected: `OK`

### Task A2: New dynamic-zone block components

**Files:**
- Create: `strapi/src/components/dynamic-zone/ai-hero.json`
- Create: `strapi/src/components/dynamic-zone/capabilities.json`
- Create: `strapi/src/components/dynamic-zone/process.json`
- Create: `strapi/src/components/dynamic-zone/use-cases.json`
- Create: `strapi/src/components/dynamic-zone/metrics.json`
- Create: `strapi/src/components/dynamic-zone/integrations.json`

- [ ] **Step 1: `ai-hero.json`**

```json
{
  "collectionName": "components_dynamic_zone_ai_heroes",
  "info": { "displayName": "AI Hero", "icon": "sparkles", "description": "" },
  "options": {},
  "attributes": {
    "heading": { "type": "text" },
    "sub_heading": { "type": "text" },
    "badge_text": { "type": "text" },
    "CTAs": { "type": "component", "repeatable": true, "component": "shared.button" },
    "Background": { "type": "media", "multiple": false, "allowedTypes": ["images", "files", "videos"] }
  }
}
```

- [ ] **Step 2: `capabilities.json`**

```json
{
  "collectionName": "components_dynamic_zone_capabilities",
  "info": { "displayName": "Capabilities", "icon": "layoutGrid", "description": "" },
  "options": {},
  "attributes": {
    "heading": { "type": "text" },
    "sub_heading": { "type": "text" },
    "capabilities": { "type": "component", "repeatable": true, "component": "shared.capability" }
  }
}
```

- [ ] **Step 3: `process.json`**

```json
{
  "collectionName": "components_dynamic_zone_processes",
  "info": { "displayName": "Process", "icon": "route", "description": "" },
  "options": {},
  "attributes": {
    "heading": { "type": "text" },
    "sub_heading": { "type": "text" },
    "steps": { "type": "component", "repeatable": true, "component": "shared.steps" }
  }
}
```

- [ ] **Step 4: `use-cases.json`**

```json
{
  "collectionName": "components_dynamic_zone_use_cases",
  "info": { "displayName": "Use Cases", "icon": "cards", "description": "" },
  "options": {},
  "attributes": {
    "heading": { "type": "text" },
    "sub_heading": { "type": "text" },
    "use_cases": { "type": "component", "repeatable": true, "component": "shared.use-case" }
  }
}
```

- [ ] **Step 5: `metrics.json`**

```json
{
  "collectionName": "components_dynamic_zone_metrics",
  "info": { "displayName": "Metrics", "icon": "chartBar", "description": "" },
  "options": {},
  "attributes": {
    "heading": { "type": "text" },
    "sub_heading": { "type": "text" },
    "metrics": { "type": "component", "repeatable": true, "component": "shared.metric" }
  }
}
```

- [ ] **Step 6: `integrations.json`**

```json
{
  "collectionName": "components_dynamic_zone_integrations",
  "info": { "displayName": "Integrations", "icon": "plugConnected", "description": "" },
  "options": {},
  "attributes": {
    "heading": { "type": "text" },
    "sub_heading": { "type": "text" },
    "integrations": { "type": "component", "repeatable": true, "component": "shared.integration" }
  }
}
```

- [ ] **Step 7: Verify JSON validity**

Run: `cd strapi && node -e "['ai-hero','capabilities','process','use-cases','metrics','integrations'].forEach(f=>JSON.parse(require('fs').readFileSync('src/components/dynamic-zone/'+f+'.json','utf8')))" && echo OK`
Expected: `OK`

### Task A3: Register blocks in the page schema

**Files:**
- Modify: `strapi/src/api/page/content-types/page/schema.json` (the `dynamic_zone.components` array)

- [ ] **Step 1: Add the 6 new UIDs**

Append these strings to the `dynamic_zone.components` array (keep existing entries):

```
"dynamic-zone.ai-hero",
"dynamic-zone.capabilities",
"dynamic-zone.process",
"dynamic-zone.use-cases",
"dynamic-zone.metrics",
"dynamic-zone.integrations"
```

- [ ] **Step 2: Verify schema JSON validity**

Run: `cd strapi && node -e "const s=JSON.parse(require('fs').readFileSync('src/api/page/content-types/page/schema.json','utf8'));const c=s.attributes.dynamic_zone.components;['dynamic-zone.ai-hero','dynamic-zone.capabilities','dynamic-zone.process','dynamic-zone.use-cases','dynamic-zone.metrics','dynamic-zone.integrations'].forEach(u=>{if(!c.includes(u))throw new Error('missing '+u)});console.log('OK',c.length)"`
Expected: `OK <n>` (n = previous count + 6)

- [ ] **Step 3: Boot Strapi to sync schema**

Run: `cd strapi && yarn develop` (let it compile; confirm no schema errors in logs; then stop).
Expected: Strapi starts; admin → Content-Type Builder shows the 6 new components; a Page's Dynamic Zone lists them. No "duplicate collectionName" errors.

- [ ] **Step 4: Commit**

```bash
git add strapi/src/components strapi/src/api/page/content-types/page/schema.json
git commit -m "feat(strapi): add AI Solutions dynamic-zone block schemas"
```

---

## Phase B — Next SEO infrastructure

### Task B1: Reusable JsonLd component

**Files:**
- Create: `next/components/seo/json-ld.tsx`

- [ ] **Step 1: Implement**

```tsx
import React from 'react';

export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd next && yarn typecheck`
Expected: PASS (no new errors).

### Task B2: Inject JsonLd from `seo.structuredData` on pages

**Files:**
- Modify: `next/app/[locale]/(marketing)/[slug]/page.tsx`
- Modify: `next/app/[locale]/(marketing)/page.tsx`

> First READ both files to match the existing return JSX (they render `<ClientSlugHandler/>` + `<PageContent pageData={...}/>`). `structuredData` is a JSON field on `shared.seo`; it may arrive as an object or a JSON string — guard for both.

- [ ] **Step 1: Add the import + render in `[slug]/page.tsx`**

Add import: `import { JsonLd } from '@/components/seo/json-ld';`
In the returned JSX, before/after `<PageContent .../>`, add:

```tsx
{pageData?.seo?.structuredData ? (
  <JsonLd
    data={
      typeof pageData.seo.structuredData === 'string'
        ? JSON.parse(pageData.seo.structuredData)
        : pageData.seo.structuredData
    }
  />
) : null}
```

(Wrap the `JSON.parse` in a `try/catch` returning `null` on malformed strings — define a small local helper `parseStructuredData(value)` above the component to avoid throwing during render.)

- [ ] **Step 2: Repeat the same injection in the homepage `(marketing)/page.tsx`**

Use the identical helper + JSX block.

- [ ] **Step 3: Verify**

Run: `cd next && yarn typecheck && yarn lint`
Expected: PASS. (Runtime validated in Phase G once the seed sets `structuredData`.)

### Task B3: Enumerate Strapi pages in the sitemap

**Files:**
- Modify: `next/app/sitemap.ts`

> READ the current `sitemap.ts` first to reuse its `BASE_URL`, locale handling, and fetch utility. Goal: add published `pages` slugs so `/fa/ai-solutions` (and every future page) appears, WITHOUT removing the existing home/blog/article entries, and WITHOUT breaking the build on a Strapi outage.

- [ ] **Step 1: Add a guarded page-enumeration block**

Fetch pages and map to URL entries. Pattern (adapt imports to the file's existing style; reuse `fetchContentType` if already imported, else axios/`fetch`):

```ts
async function getPageRoutes(locale: string) {
  try {
    const res = await fetchContentType('pages', {
      filters: {},
      fields: ['slug', 'updatedAt'],
      pagination: { pageSize: 100 },
      locale,
    });
    const items = Array.isArray(res?.data) ? res.data : res || [];
    return items
      .map((p: any) => p?.slug)
      .filter((slug: string) => slug && slug !== 'homepage')
      .map((slug: string) => ({
        url: `${BASE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}
```

Merge `...(await getPageRoutes('fa'))` into the returned array alongside the existing entries. (Note: `fetchContentType` calls `draftMode()`; in a build/sitemap context that returns disabled, so only published pages are returned — correct. If `fetchContentType` cannot be used here, replace with a direct `fetch` to `${STRAPI_URL}/api/pages?fields[0]=slug&pagination[pageSize]=100&locale=fa` and the same try/catch fallback.)

- [ ] **Step 2: Verify typecheck + build emits sitemap**

Run: `cd next && yarn typecheck && yarn build`
Expected: PASS; `postbuild` sitemap step runs without error. (Content asserted in Phase G.)

### Task B4 (optional): metadataBase

**Files:**
- Modify: `next/app/layout.tsx`

- [ ] **Step 1:** In the root `metadata` export, add `metadataBase: new URL(process.env.WEBSITE_URL || 'https://studioarman.com')`. READ the file first; only add if a `metadata`/`viewport` export exists there — otherwise skip (do not duplicate metadata ownership).
- [ ] **Step 2: Verify** `cd next && yarn typecheck` → PASS.

- [ ] **Step 3: Commit Phase B**

```bash
git add next/components/seo next/app/sitemap.ts "next/app/[locale]/(marketing)/[slug]/page.tsx" "next/app/[locale]/(marketing)/page.tsx" next/app/layout.tsx
git commit -m "feat(next): JSON-LD injection + sitemap enumerates Strapi pages"
```

---

## Phase C — New Next block components

> For each: READ the referenced primitive first, then build the block RTL-first. Each block is a `'use client'` component unless it has no interactivity. Each is registered in `manager.tsx`. Acceptance per block = `yarn typecheck && yarn lint` PASS and the block renders with placeholder data in Phase G.

### Task C1: AI Hero

**Files:**
- Create: `next/components/dynamic-zone/ai-hero.tsx`
- Modify: `next/components/dynamic-zone/manager.tsx`
- Reference: `next/components/dynamic-zone/hero.tsx` (layout + `Cover` + CTA pattern), `next/components/decorations/{star-background,shooting-star}.tsx`, `next/components/ui/sparkles.tsx`, `next/lib/fonts.ts` (`getLocaleConfig`).

- [ ] **Step 1: Build `AiHero`**

Contract: `export const AiHero = ({ heading, sub_heading, badge_text, CTAs = [], Background, locale }: AiHeroProps) => {...}`.
- Full-bleed section (`min-h-[calc(100vh-6rem)]`, centered).
- If `Background?.url` → `StrapiImage` `fill` as backdrop with a `bg-gradient-to-t from-background` scrim; else render `StarBackground` + `ShootingStars` + a `SparklesCore` accent (the hero.tsx fallback path).
- Eyebrow pill from `badge_text` (rounded-full, border, muted).
- `Heading` (size `xl`/`2xl`) with the **last word** wrapped in `<Cover>`; `Subheading` below.
- CTAs → `Button as={Link}` with `href={cta.URL?.startsWith('http') ? cta.URL : `/${locale}${cta.URL}`}` and `variant={cta.variant}`.
- RTL: `const { isRTL, fontClass } = getLocaleConfig(locale)`; apply `fontClass`, `text-center` (hero is centered so RTL is mostly font), but ensure CTA row + pill use logical alignment.
- Respect `prefers-reduced-motion` for the sparkle/star animations.

- [ ] **Step 2: Register in `manager.tsx`** — add to `componentMapping`:

```ts
'dynamic-zone.ai-hero': dynamic(() => import('./ai-hero').then((m) => m.AiHero), { ssr: true }),
```

- [ ] **Step 3: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task C2: Capabilities (bento)

**Files:**
- Create: `next/components/dynamic-zone/capabilities.tsx`
- Modify: `next/components/dynamic-zone/manager.tsx`
- Reference: `next/components/dynamic-zone/features/card.tsx` (card surface), `feature-icon-container.tsx`, `next/components/dynamic-zone/how-it-works/card.tsx` (mouse-tracked radial-mask + `CanvasRevealEffect`), `next/components/ui/canvas-reveal-effect.tsx`.

- [ ] **Step 1: Build `Capabilities`**

Contract: `export const Capabilities = ({ heading, sub_heading, capabilities = [], locale }: CapabilitiesProps) => {...}`.
- Section header: `FeatureIconContainer` + `Heading` + `Subheading` (RTL-aware).
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-4`; each card `md:col-span-2` when `span === 'two'` else `col-span-1`.
- Card: the rgba card surface (`rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)]`, `group`), a `FeatureIconContainer` rendering the Tabler icon named by `capability.icon` (resolve via a small icon map — see note), title + description.
- Hover reveal: on `group-hover`, render `CanvasRevealEffect` (imported `dynamic(..., { ssr: false })`) behind a radial mask (copy the `useMotionValue`/`useMotionTemplate` mask from `how-it-works/card.tsx`); shader `colors` default `[[59,130,246],[139,92,246]]`, overridden by `capability.accent` if a hex is provided.
- RTL: text-right + `font-iran-sans` when `isRTL`.

> Icon map note: build `const iconMap: Record<string, Icon> = { IconMessageChatbot, IconRobot, IconEye, IconChartHistogram, IconDatabaseSearch, IconPlugConnected, ... }` from `@tabler/icons-react`; fallback to `IconSparkles` when a name is unknown. Keep it in this file (or `lib/constants/icon-map.ts` if reused by Process/Integrations — DRY).

- [ ] **Step 2: Register in `manager.tsx`:**

```ts
'dynamic-zone.capabilities': dynamic(() => import('./capabilities').then((m) => m.Capabilities), { ssr: true }),
```

- [ ] **Step 3: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task C3: Process (scroll-beam steps)

**Files:**
- Create: `next/components/dynamic-zone/process.tsx`
- Modify: `next/components/dynamic-zone/manager.tsx`
- Reference: `next/components/dynamic-zone/how-it-works/index.tsx` + `how-it-works/card.tsx` (the beam + reveal), `next/components/ui/timeline.tsx` (RTL rail mirroring).

- [ ] **Step 1: Build `Process`**

Contract: `export const Process = ({ heading, sub_heading, steps = [], locale }: ProcessProps) => {...}`.
- Reuse the how-it-works card interaction (scroll-grown connector `Beam` + mouse-tracked radial `CanvasRevealEffect`), but lay the rail on the **right** for RTL (mirror like `timeline.tsx` does based on `isRTL`).
- Each step: index badge or Tabler icon from `step.icon` (same `iconMap`), `step.title`, `step.description`.
- RTL: `dir`, `font-iran-sans`, logical spacing via the `isRTL` branch.

- [ ] **Step 2: Register in `manager.tsx`:**

```ts
'dynamic-zone.process': dynamic(() => import('./process').then((m) => m.Process), { ssr: true }),
```

- [ ] **Step 3: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task C4: Use Cases (carousel) + make carousel locale-aware

**Files:**
- Create: `next/components/dynamic-zone/use-cases.tsx`
- Modify: `next/components/ui/apple-cards-carousel.tsx` (remove hardcoded `dir="rtl"`/`text-right`; accept/derive `locale`)
- Modify: `next/components/dynamic-zone/manager.tsx`
- Reference: `next/components/ui/apple-cards-carousel.tsx` (`Carousel`, `Card`, `BlurImage`, `Card` type `{src,title,category,content,link}`).

- [ ] **Step 1: Make the carousel locale-aware**

In `apple-cards-carousel.tsx`, replace the hardcoded `dir="rtl"` on the modal and the fixed `text-right` with values derived from a `locale` prop (default current behavior). Thread `locale` from the wrapper. Keep existing keyboard/outside-click behavior intact.

- [ ] **Step 2: Build `UseCases`**

Contract: `export const UseCases = ({ heading, sub_heading, use_cases = [], locale }: UseCasesProps) => {...}`.
- Header (RTL-aware) + `Carousel` of `Card` built from each `use_case`: `{ src: getStrapiMedia(image), title, category, content: <p>{description}</p> }`.
- Images via `StrapiImage`/`BlurImage`; guard missing image (render a gradient placeholder card).
- Pass `locale` to `Carousel`/`Card`.

- [ ] **Step 3: Register in `manager.tsx`:**

```ts
'dynamic-zone.use-cases': dynamic(() => import('./use-cases').then((m) => m.UseCases), { ssr: true }),
```

- [ ] **Step 4: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task C5: Metrics (count-up)

**Files:**
- Create: `next/components/dynamic-zone/metrics.tsx`
- Modify: `next/components/dynamic-zone/manager.tsx`
- Reference: framer-motion `useInView`, `useMotionValue`, `animate` (already a dependency).

- [ ] **Step 1: Build `Metrics`**

Contract: `export const Metrics = ({ heading, sub_heading, metrics = [], locale }: MetricsProps) => {...}`.
- Header (RTL-aware) + responsive grid (`grid-cols-2 md:grid-cols-4 gap-6`).
- Each metric: optional Tabler icon, an animated number that counts 0 → `value` when the grid enters view (`useInView(ref, { once: true })` → `animate(0, value, { duration: 1.6, onUpdate })`), formatted with `new Intl.NumberFormat('fa-IR').format(Math.round(n))`, wrapped with `prefix`/`suffix`, then `label`.
- `prefers-reduced-motion` → render the final value immediately (no animation).
- Numbers must be rounded before display.

- [ ] **Step 2: Register in `manager.tsx`:**

```ts
'dynamic-zone.metrics': dynamic(() => import('./metrics').then((m) => m.Metrics), { ssr: true }),
```

- [ ] **Step 3: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task C6: Integrations (dock)

**Files:**
- Create: `next/components/dynamic-zone/integrations.tsx`
- Modify: `next/components/dynamic-zone/manager.tsx`
- Reference: `next/components/ui/floating-dock.tsx` (items `{title, icon, href}`).

- [ ] **Step 1: Build `Integrations`**

Contract: `export const Integrations = ({ heading, sub_heading, integrations = [], locale }: IntegrationsProps) => {...}`.
- Header (RTL-aware) + `FloatingDock` whose `items` map each integration to `{ title, href: href || '#', icon: <StrapiImage .../> or <TablerIcon/> from iconName }`.
- Guard: if neither `icon` nor `iconName`, fall back to `IconPlug`.

- [ ] **Step 2: Register in `manager.tsx`:**

```ts
'dynamic-zone.integrations': dynamic(() => import('./integrations').then((m) => m.Integrations), { ssr: true }),
```

- [ ] **Step 3: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

- [ ] **Step 4: Commit Phase C**

```bash
git add next/components/dynamic-zone next/components/ui/apple-cards-carousel.tsx
git commit -m "feat(next): add six RTL-first AI Solutions block components"
```

---

## Phase D — RTL fixes to reused blocks

### Task D1: Testimonials RTL

**Files:** Modify `next/components/dynamic-zone/testimonials/index.tsx`

- [ ] **Step 1:** Replace the hardcoded `dir="ltr"` wrapper with `dir={getLocaleConfig(locale).direction}` (and apply `fontClass` for fa). Marquee may stay LTR-scrolling but text must read RTL.
- [ ] **Step 2: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task D2: FAQ RTL + FAQPage JSON-LD

**Files:** Modify `next/components/dynamic-zone/faq.tsx`

- [ ] **Step 1:** Add the `isRTL` branch: `text-right`, `font-iran-sans`, mirror the expand chevron for RTL.
- [ ] **Step 2:** Build a `FAQPage` JSON-LD from `faqs` and render via `<JsonLd data={faqLd} />`:

```ts
const faqLd = faqs?.length ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f: any) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
} : null;
```

> READ `faq.tsx` + the `api::faq.faq` shape first to use the correct field names (`question`/`answer` or nested). Import `JsonLd` from `@/components/seo/json-ld`.

- [ ] **Step 3: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

### Task D3: Brands + Form RTL verify

**Files:** Modify (if needed) `next/components/dynamic-zone/brands.tsx`, `next/components/dynamic-zone/form-next-to-section.tsx`

- [ ] **Step 1:** READ both; if any hardcoded `text-left`/`ml-`/`pl-`/`dir`, swap to logical/`isRTL`-driven values. If already RTL-neutral, no change.
- [ ] **Step 2: Verify** `cd next && yarn typecheck && yarn lint` → PASS.

- [ ] **Step 3: Commit Phase D**

```bash
git add next/components/dynamic-zone/testimonials next/components/dynamic-zone/faq.tsx next/components/dynamic-zone/brands.tsx next/components/dynamic-zone/form-next-to-section.tsx
git commit -m "fix(next): RTL-correct reused blocks + FAQPage JSON-LD"
```

---

## Phase E — i18n chrome strings

### Task E1: aiSolutions message keys

**Files:** Modify `next/messages/fa.json`, `next/messages/en.json`, `next/messages/fr.json`

- [ ] **Step 1:** Add an `aiSolutions` namespace with any chrome strings introduced by the new components (e.g. aria-labels, a reduced-motion fallback, a carousel "مشاهده بیشتر"). Keep the three files structurally identical (same keys). Example minimal set:

```json
"aiSolutions": {
  "viewMore": "مشاهده بیشتر",
  "metricsAria": "آمار و نتایج",
  "integrationsAria": "فناوری‌ها و یکپارچه‌سازی"
}
```

(English/French files: translate values, identical keys.)

- [ ] **Step 2: Verify keys in sync**

Run: `cd next && node -e "const f=require('./messages/fa.json'),e=require('./messages/en.json'),r=require('./messages/fr.json');const k=o=>Object.keys(o.aiSolutions||{}).sort().join(',');if(k(f)!==k(e)||k(f)!==k(r))throw new Error('aiSolutions keys out of sync');console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add next/messages
git commit -m "i18n: add aiSolutions chrome strings (fa/en/fr)"
```

---

## Phase F — Seed + admin recipe

### Task F1: Idempotent Strapi seed

**Files:** Modify `strapi/src/index.ts` (`bootstrap`)

> READ `strapi/src/index.ts` first. Add the seed inside `bootstrap({ strapi })`, guarded by env so it never runs unexpectedly. Use the Strapi 5 document service.

- [ ] **Step 1: Implement guarded idempotent seed**

Logic:
- `if (process.env.SEED_AI_SOLUTIONS !== 'true') return;`
- Check existing: `const existing = await strapi.documents('api::page.page').findMany({ filters: { slug: 'ai-solutions' }, locale: 'fa' });` — if length, log "AI Solutions page already exists" and skip page creation.
- Else `await strapi.documents('api::page.page').create({ locale: 'fa', status: 'published', data: { slug: 'ai-solutions', seo: SEO_OBJ, dynamic_zone: DZ_ARRAY } });` where:
  - `SEO_OBJ` = `{ metaTitle, metaDescription, keywords, metaRobots: 'index,follow', canonicalURL: 'https://studioarman.com/fa/ai-solutions', structuredData: STRUCTURED_DATA }`.
  - `STRUCTURED_DATA` = a `@graph` with `Service` (name «راهکارهای هوش مصنوعی», provider Organization studioarman), `BreadcrumbList` (Home → AI Solutions), `WebPage`.
  - `DZ_ARRAY` = the 10 blocks in order, each `{ __component: 'dynamic-zone.<x>', ...fields }`, populated from Appendix A of the spec (Persian copy). Media fields omitted (blocks have fallbacks).
- Nav/footer: load `global` single-type; if `navbar.left_navbar_items` lacks `/ai-solutions`, push `{ text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions', target: '_self' }`; same for `footer.internal_links`; update via `strapi.documents('api::global.global').update(...)`. Wrap in try/catch with `strapi.log.warn` so a failure never blocks boot.

> Copy the exact Persian strings from `docs/superpowers/specs/2026-06-13-ai-solutions-page-design.md` Appendix A. Keep block field names matching the component schemas (`heading`, `sub_heading`, `capabilities[].{title,description,icon,span}`, `steps[].{title,description,icon}`, `use_cases[].{title,category,description}`, `metrics[].{value,suffix,label,icon}`, `integrations[].{title,iconName,href}`, `CTAs[].{text,URL,variant}`, `faqs`/`testimonials` reference existing collections — for placeholder, seed a few `faq`/`testimonial` entries too, or leave those two blocks' relations empty and note in the recipe to fill them).

- [ ] **Step 2: Run the seed once**

Run: `cd strapi && SEED_AI_SOLUTIONS=true yarn develop` (Windows PowerShell: `$env:SEED_AI_SOLUTIONS='true'; yarn develop`). Confirm log "Seeded AI Solutions page". Stop. Then start normally (without the flag) and confirm "already exists" path (idempotent).
Expected: page exists once; re-run is a no-op.

- [ ] **Step 3: Commit**

```bash
git add strapi/src/index.ts
git commit -m "feat(strapi): idempotent guarded seed for AI Solutions page + nav/footer"
```

### Task F2: Admin recipe doc

**Files:** Create `docs/ai-solutions-admin-recipe.md`

- [ ] **Step 1:** Write a step-by-step guide: (1) where each block lives in the Dynamic Zone picker, (2) the field values to enter per section (paste from spec Appendix A), (3) how to set the `seo` fields incl. `structuredData`, (4) how to add the nav item (`global.navbar.left_navbar_items`) and footer link, (5) how to publish. Include the full Persian copy inline so it can be built without the seed.
- [ ] **Step 2: Commit**

```bash
git add docs/ai-solutions-admin-recipe.md
git commit -m "docs: AI Solutions admin recipe + copy"
```

---

## Phase G — Integration verification & polish

### Task G1: Full build + manual verification

- [ ] **Step 1: Static checks**

Run: `cd next && yarn lint && yarn typecheck && yarn build`
Expected: all PASS; `postbuild` sitemap runs.

- [ ] **Step 2: Run the stack**

Run (root): `yarn dev` (Strapi then Next). Open `http://localhost:3000/fa/ai-solutions`.

- [ ] **Step 3: Visual/RTL checks** — confirm:
  - All 10 sections render in order; layout reads RTL; Persian font applied.
  - Hero particles/`Cover`; capabilities hover-reveal; process scroll-beam; use-cases card expand; metrics count-up; integrations dock magnify; testimonials/faq RTL; final form.
  - Light + dark themes both correct.
  - `prefers-reduced-motion` (DevTools emulate) disables count-up/heavy motion.

- [ ] **Step 4: SEO checks** — confirm:
  - `view-source` on `/fa/ai-solutions`: `<title>`, `<meta name=description>`, canonical, `og:*`, `twitter:*` populated from `seo`.
  - JSON-LD present: `Service` + `BreadcrumbList` + `WebPage` (from `structuredData`) and `FAQPage` (from the FAQ block). Validate the JSON parses.
  - `http://localhost:3000/sitemap.xml` includes `/fa/ai-solutions` AND still includes home, blog index, and articles (no regression).
  - Homepage and one existing article render unchanged.

- [ ] **Step 5: Record results** in the PR/commit description (paste command outputs). If any check fails, fix and re-run before final.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: AI Solutions page verification + fixes"
```

---

## Self-Review (spec coverage)

- Hero/Capabilities/Process/UseCases/Metrics/Integrations → Tasks A2 (schema), C1–C6 (components), registered in A3 + each C task. ✓
- Reused blocks + RTL fixes (testimonials/faq/brands/form) → Tasks D1–D3. ✓
- SEO: seo-component metadata (automatic) ✓; sitemap enumeration → B3 ✓; JsonLd Service/Breadcrumb/WebPage → B1/B2 + seed F1 ✓; FAQPage → D2 ✓; constraints preserved (no field renames, no populate override) — honored by not modifying those paths. ✓
- i18n strings → E1; nav/footer entries → F1 seed + F2 recipe. ✓
- Seed + recipe + Persian copy → F1/F2 + spec Appendix A. ✓
- Verification (lint/typecheck/build + manual RTL/SEO/no-regression) → G1. ✓
- Non-goals respected (no new locale, no ISR change, no redesign). ✓
- Open questions (brand accent default blue/purple; placeholder proof points) carried from spec; non-blocking. ✓
