# AI Solutions Page — Design Spec

> Date: 2026-06-13
> Status: Draft for review
> Scope: A premium, RTL-first **AI-services-for-clients** marketing page for studioarman, built as Strapi-driven dynamic-zone blocks in the existing Next.js 16 + Strapi 5.36 monorepo, with SEO wired to be perfect and non-regressing.

---

## 1. Goal

Ship the best UI/UX AI Solutions page we can, while honoring three hard requirements the user set:

1. **Stay Strapi-driven** — the page must be content-editable, composed from dynamic-zone blocks like every other page. No bespoke hardcoded route.
2. **SEO must be perfect and must not regress** — metadata, canonical, OpenGraph, sitemap, structured data, `lang`/`dir`. Adding this page must not change any existing page's SEO.
3. **Persian-first / RTL** — `fa` is the only active locale; every new block is RTL-correct using the existing `getLocaleConfig`/`isRTL` model (the `timeline`/`plans` pattern), not the older English-hardcoded blocks.

Chosen approach (confirmed with user): **Hybrid** — build a small set of new RTL-first dynamic-zone blocks AND reuse the strongest existing primitives (CanvasRevealEffect shader, apple-cards-carousel, the how-it-works scroll-beam, floating-dock, sparkles/decorations).

Delivery scope (confirmed): implement the Next blocks + Strapi schemas + SEO wiring + **both** a seed script and an admin recipe + Persian placeholder copy.

---

## 2. How the system works (grounding facts)

These are the load-bearing facts the design depends on (verified by reading the repo):

- A Strapi **`page`** (`api::page.page`) = `slug` (uid, required, localized) + `seo` (component `shared.seo`) + `dynamic_zone` (dynamiczone, localized). `draftAndPublish: true`. The `dynamic_zone.components` array in `strapi/src/api/page/content-types/page/schema.json` is the **allow-list** of placeable block UIDs.
- Next route `next/app/[locale]/(marketing)/[slug]/page.tsx` resolves a page by `fetchContentType('pages', { filters: { slug, locale } }, true)`. **No `populate` is sent** — the Strapi `global::deepPopulate` middleware auto-populates the whole tree (dynamic zone, media, relations, localizations). Passing a `populate` param would *disable* deepPopulate, so we must not.
- `next/components/dynamic-zone/manager.tsx` is a registry object: `componentMapping[__component] = dynamic(() => import('./x').then(m => m.X), { ssr: true })`. Each block is rendered with `{...componentData} locale={locale}`. An unmapped `__component` logs a warning and renders nothing.
- **Per-page metadata is automatic**: `generateMetadata` in the `[slug]` route reads `pageData.seo` and calls `generateMetadataObject(seo)` (`next/lib/shared/metadata.ts`) → title, description, keywords, robots, canonical, OpenGraph, Twitter. A new page gets all of this by filling its `seo` component.
- **Sitemap gap**: `next/app/sitemap.ts` enumerates only home, the blog index, and articles. It does **not** enumerate Strapi `pages`. A new page renders fine but will not appear in the sitemap unless we wire it in.
- **Structured-data gap**: JSON-LD is injected only for blog articles (`blog-layout.tsx`). The `shared.seo` component already has a `structuredData` (json) field and `generateStructuredData` exists in `metadata.ts` but is unused for pages.
- Nav/footer are Strapi-driven (`global` single-type `navbar.left_navbar_items` / `footer.internal_links`). Adding an "AI Solutions" nav entry is CMS data, not React code.
- Animation lib is **framer-motion only**. WebGL primitives (`globe.tsx`, `canvas-reveal-effect.tsx`) must be imported `ssr:false`. All media goes through `StrapiImage`/`getStrapiMedia`.

### Reusable shared sub-components (verified shapes)

- `shared.button`: `text`, `URL`, `target` (enum), `variant` (enum: simple/outline/primary/muted), `image` (media). → CTAs.
- `shared.steps`: `title`, `description`. → process steps (we add one optional `icon` text field, backward compatible).
- `shared.form`: `inputs` (repeatable `items.input`). → final CTA form.
- `shared.section`: `heading`, `sub_heading`, `users`. → used by `form-next-to-section`.

---

## 3. Page structure (scroll narrative)

Ten sections, in order. Live URL: `/fa/ai-solutions` (slug `ai-solutions`). Nav label: «راهکارهای هوش مصنوعی».

| # | Section | Block UID | New / Reuse | Key primitive |
|---|---------|-----------|-------------|---------------|
| 1 | Hero | `dynamic-zone.ai-hero` | **New** | Sparkles/StarBackground + `Cover` highlight |
| 2 | Trust bar (optional) | `dynamic-zone.brands` | Reuse | logo marquee |
| 3 | Capabilities (services) | `dynamic-zone.capabilities` | **New** | `CanvasRevealEffect` on hover + card surface |
| 4 | How it works (process) | `dynamic-zone.process` | **New** | scroll-beam + radial reveal (how-it-works pattern) |
| 5 | Use cases | `dynamic-zone.use-cases` | **New** | `apple-cards-carousel` (expandable cards) |
| 6 | Impact metrics | `dynamic-zone.metrics` | **New** | framer-motion count-up on in-view |
| 7 | Integrations (optional) | `dynamic-zone.integrations` | **New** | `floating-dock` |
| 8 | Testimonials | `dynamic-zone.testimonials` | Reuse (+RTL fix) | slider + marquee |
| 9 | FAQ | `dynamic-zone.faq` | Reuse (+RTL fix, +JSON-LD) | accordion |
| 10 | Final CTA + contact | `dynamic-zone.form-next-to-section` | Reuse (+RTL verify) | form beside section |

The page is composed in this order in the page's `dynamic_zone`. Every section is independently removable/reorderable in Strapi with zero code change.

---

## 4. New Strapi components

All new dynamic-zone components live in `strapi/src/components/dynamic-zone/` and follow the `heading` + `sub_heading` convention. Each new UID must also be **registered** in the `dynamic_zone.components` array of `strapi/src/api/page/content-types/page/schema.json`. `deepPopulate` then auto-populates them — no middleware change.

### 4.1 New dynamic-zone block components

1. `dynamic-zone.ai-hero` (`ai-hero.json`)
   - `heading` (text), `sub_heading` (text)
   - `badge_text` (text) — small eyebrow pill above the heading
   - `CTAs` (component `shared.button`, repeatable)
   - `Background` (media, single, optional — falls back to particle/star background)

2. `dynamic-zone.capabilities` (`capabilities.json`)
   - `heading` (text), `sub_heading` (text)
   - `capabilities` (component `shared.capability`, repeatable)

3. `dynamic-zone.process` (`process.json`)
   - `heading` (text), `sub_heading` (text)
   - `steps` (component `shared.steps`, repeatable)

4. `dynamic-zone.use-cases` (`use-cases.json`)
   - `heading` (text), `sub_heading` (text)
   - `use_cases` (component `shared.use-case`, repeatable)

5. `dynamic-zone.metrics` (`metrics.json`)
   - `heading` (text), `sub_heading` (text)
   - `metrics` (component `shared.metric`, repeatable)

6. `dynamic-zone.integrations` (`integrations.json`)
   - `heading` (text), `sub_heading` (text)
   - `integrations` (component `shared.integration`, repeatable)

### 4.2 New shared sub-components

- `shared.capability` (`capability.json`): `title` (text), `description` (text), `icon` (text — Tabler icon name, e.g. `IconMessageChatbot`), `span` (enumeration: `one`|`two`, default `one`, controls bento width), `accent` (text, optional hex for the reveal shader; default brand blue/purple).
- `shared.use-case` (`use-case.json`): `title` (text), `category` (text), `description` (text), `image` (media, single, optional).
- `shared.metric` (`metric.json`): `value` (decimal), `prefix` (text, optional), `suffix` (text, optional — e.g. `%`, `+`, `ساعت`), `label` (text), `icon` (text, optional Tabler name).
- `shared.integration` (`integration.json`): `title` (text), `icon` (media, single, optional), `iconName` (text, optional Tabler fallback), `href` (text, optional).
- **Modify** `shared.steps` (`steps.json`): add optional `icon` (text — Tabler name). Backward compatible; `how-it-works` ignores it.

> Constraint: every component JSON needs a globally unique `collectionName` and `info.displayName`, or Strapi schema sync fails on boot.

---

## 5. New Next.js components

All under `next/components/dynamic-zone/` unless noted. Each accepts the spread Strapi props + `locale`, uses `elements/heading` + `elements/subheading`, the established card surface, `StrapiImage` for media, and is RTL-first via `getLocaleConfig(locale)`/`isRTL` (`font-iran-sans`, `dir`, logical spacing — model after `timeline.tsx`/`plans.tsx`).

1. `ai-hero.tsx` → `export const AiHero` — full-bleed hero; `Background` via `StrapiImage` fill OR `StarBackground` + `ShootingStars` + `SparklesCore` fallback; last word of `heading` wrapped in `<Cover>`; CTAs via `Button as={Link} href={localePrefixed}`. RTL text alignment. Kept deliberately light (no WebGL globe) to protect LCP.
2. `capabilities.tsx` → `export const Capabilities` — responsive bento grid of `shared.capability`; each card uses the rgba card surface, a `FeatureIconContainer` with the Tabler `icon`, and a group-hover `CanvasRevealEffect` (imported `ssr:false`) masked behind the card. `span` controls `md:col-span-{1|2}`. RTL-aware.
3. `process.tsx` → `export const Process` — adapts the `how-it-works/card.tsx` interaction: a `useScroll`/`useSpring` connector beam plus a mouse-tracked radial-mask `CanvasRevealEffect` reveal per step, laid out RTL (beam on the right rail). Steps from `shared.steps` with optional Tabler `icon` (fallback: numbered).
4. `use-cases.tsx` → `export const UseCases` — maps `shared.use-case[]` to the `apple-cards-carousel` `Card`/`Carousel` (`{ src, title, category, content }`). Made locale-aware (do not hardcode `dir`). Images via `StrapiImage`/`BlurImage`.
5. `metrics.tsx` → `export const Metrics` — grid of `shared.metric`; each animates a count-up from 0 → `value` when it enters the viewport (framer-motion `useInView` + `animate`/`useMotionValue`), formatted with `Intl.NumberFormat('fa-IR')` and `prefix`/`suffix`. Respects `prefers-reduced-motion`.
6. `integrations.tsx` → `export const Integrations` — wraps `floating-dock` with `shared.integration[]` (`{ title, icon, href }`); icon via `StrapiImage` or Tabler `iconName` fallback. Below-fold, lazy.

Plus:

7. `next/components/seo/json-ld.tsx` → `export function JsonLd({ data })` — a server component rendering `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`. Reusable by any page.

### Manager registration

Add 6 keys to `componentMapping` in `next/components/dynamic-zone/manager.tsx`:

```
'dynamic-zone.ai-hero':       dynamic(() => import('./ai-hero').then(m => m.AiHero), { ssr: true }),
'dynamic-zone.capabilities':  dynamic(() => import('./capabilities').then(m => m.Capabilities), { ssr: true }),
'dynamic-zone.process':       dynamic(() => import('./process').then(m => m.Process), { ssr: true }),
'dynamic-zone.use-cases':     dynamic(() => import('./use-cases').then(m => m.UseCases), { ssr: true }),
'dynamic-zone.metrics':       dynamic(() => import('./metrics').then(m => m.Metrics), { ssr: true }),
'dynamic-zone.integrations':  dynamic(() => import('./integrations').then(m => m.Integrations), { ssr: true }),
```

### RTL fixes to reused blocks

- `testimonials/index.tsx` — remove the hardcoded `dir="ltr"` (make locale-aware).
- `faq.tsx` — add the `isRTL` branch (text-right, `font-iran-sans`, mirror chevrons).
- `apple-cards-carousel.tsx` — replace the hardcoded `dir="rtl"`/`text-right` with locale-driven values (driven from the `use-cases` wrapper).
- `brands.tsx` — verify marquee + heading are RTL-safe (low risk).
- `form-next-to-section.tsx` — verify RTL layout for the closer.

---

## 6. SEO wiring (the "perfect, non-regressing" part)

### 6.1 Automatic, no code (fill the `seo` component)

The page's `shared.seo` is populated (via seed + recipe) with: `metaTitle` (≤60 chars), `metaDescription` (≥50 chars), `keywords`, `canonicalURL` = `https://studioarman.com/fa/ai-solutions`, `metaRobots` = `index,follow`, and `metaImage` (optional — when a real OG image is uploaded; omitted otherwise). `generateMetadata` turns these into title/description/keywords/robots/canonical/OG/Twitter automatically. **No `seo` field is renamed; the `generateMetadata` fetch contract is unchanged.**

### 6.2 Close the sitemap gap (the one required code change)

Extend `next/app/sitemap.ts` to enumerate published Strapi `pages` and emit `${BASE_URL}/${locale}/${slug}` for each (mapping `homepage` → root, which already exists). Implementation notes:
- Fetch `GET /api/pages?fields[0]=slug&pagination[pageSize]=100&locale=fa&status=published` (or via `fetchContentType`), wrapped in `try/catch` with a fallback to the current static entries so a Strapi outage cannot break the build.
- This makes `/fa/ai-solutions` **and every future page** appear automatically — a net improvement; existing article/blog entries are untouched.

### 6.3 Structured data (JSON-LD)

- Render `<JsonLd data={pageData.seo.structuredData} />` from the `[slug]` route (and the homepage route) when `seo.structuredData` is present. This is generic and CMS-driven — any page can opt in by filling the field.
- Seed the AI Solutions page's `seo.structuredData` with a graph containing **`Service`** (the AI-services offering, provider = Organization), **`BreadcrumbList`** (Home → AI Solutions), and **`WebPage`**.
- **FAQPage**: emit a `FAQPage` JSON-LD derived from the rendered `faq` block's `faqs` (so it stays in sync with displayed content), injected inside `faq.tsx` via the same `JsonLd` component.

### 6.4 Optional polish

- Add `metadataBase: new URL(BASE_URL)` to the root metadata so OG/canonical always resolve absolute. (Low-risk improvement; does not alter existing per-page values.)

### 6.5 Constraints preserved (must NOT change)

- No renaming of `shared.seo` fields; no change to the `generateMetadata` fetch shape.
- Never pass a `populate` param on the page-body fetch (would disable `deepPopulate`).
- Keep `<html lang>` and `dir="rtl"` wrappers; keep `robots.ts` allow-all and `sitemap.xml` route.
- Keep article URL shape `locale/category/slug` and the existing article JSON-LD in `blog-layout.tsx`.

---

## 7. i18n / nav / footer

- `fa` only. Any **chrome** string introduced by new components (aria-labels, a "مشاهده بیشتر" control, reduced-motion fallback text) is added to **all three** message files `messages/{fa,en,fr}.json` under an `aiSolutions` namespace, per the repo convention. Section copy itself comes from Strapi block props, not messages.
- **Nav**: add to Strapi `global.navbar.left_navbar_items`: `{ text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions', icon: 'IconBriefcase' }`.
- **Footer**: add to `global.footer.internal_links`: `{ text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions' }`.
- Both are CMS data — provided by the seed and the admin recipe; no React change.

---

## 8. Content delivery (seed + recipe)

**Seed (auto-create the page):** add an idempotent seeder, guarded by env, that runs in `strapi/src/index.ts` `bootstrap()`:
- If `process.env.SEED_AI_SOLUTIONS === 'true'` and no `pages` entry with slug `ai-solutions` exists, create it (locale `fa`, published) with the full `dynamic_zone` (all 10 sections), the populated `seo` (incl. `structuredData`), using the Strapi 5 document service (`strapi.documents('api::page.page').create(...)`).
- Also ensure the `global` navbar/footer contain the AI Solutions entries (add if missing).
- Idempotent: re-running is a no-op. Media is **optional** — blocks render with shader/particle/gradient fallbacks, so the seed needs no uploaded files to look complete.
- Documented one-time run: `SEED_AI_SOLUTIONS=true yarn develop` (then unset).

**Recipe (`docs/ai-solutions-admin-recipe.md`):** step-by-step Strapi-admin guide to build/edit the same page by hand, plus all Persian copy to paste (the content appendix below), so the page can be re-created or tuned without the seed.

---

## 9. File-by-file change list

**Strapi**
- `strapi/src/components/dynamic-zone/ai-hero.json` (new)
- `strapi/src/components/dynamic-zone/capabilities.json` (new)
- `strapi/src/components/dynamic-zone/process.json` (new)
- `strapi/src/components/dynamic-zone/use-cases.json` (new)
- `strapi/src/components/dynamic-zone/metrics.json` (new)
- `strapi/src/components/dynamic-zone/integrations.json` (new)
- `strapi/src/components/shared/capability.json` (new)
- `strapi/src/components/shared/use-case.json` (new)
- `strapi/src/components/shared/metric.json` (new)
- `strapi/src/components/shared/integration.json` (new)
- `strapi/src/components/shared/steps.json` (add optional `icon`)
- `strapi/src/api/page/content-types/page/schema.json` (register 6 new UIDs in `dynamic_zone.components`)
- `strapi/src/index.ts` (idempotent guarded seeder)

**Next**
- `next/components/dynamic-zone/ai-hero.tsx` (new)
- `next/components/dynamic-zone/capabilities.tsx` (new)
- `next/components/dynamic-zone/process.tsx` (new)
- `next/components/dynamic-zone/use-cases.tsx` (new)
- `next/components/dynamic-zone/metrics.tsx` (new)
- `next/components/dynamic-zone/integrations.tsx` (new)
- `next/components/seo/json-ld.tsx` (new)
- `next/components/dynamic-zone/manager.tsx` (register 6 keys)
- `next/app/[locale]/(marketing)/[slug]/page.tsx` (render `<JsonLd>` from `seo.structuredData`)
- `next/app/[locale]/(marketing)/page.tsx` (same JsonLd hook, homepage parity)
- `next/app/sitemap.ts` (enumerate Strapi pages)
- `next/components/dynamic-zone/testimonials/index.tsx` (RTL fix)
- `next/components/dynamic-zone/faq.tsx` (RTL fix + FAQPage JSON-LD)
- `next/components/ui/apple-cards-carousel.tsx` (locale-aware dir)
- `next/components/dynamic-zone/brands.tsx`, `form-next-to-section.tsx` (RTL verify)
- `next/messages/{fa,en,fr}.json` (aiSolutions chrome strings)
- `next/app/layout.tsx` (optional `metadataBase`)

**Docs**
- `docs/ai-solutions-admin-recipe.md` (new)
- `docs/superpowers/specs/2026-06-13-ai-solutions-page-design.md` (this file)

---

## 10. Verification plan

- `cd next && yarn lint && yarn typecheck && yarn build` — all pass (no `console.log`; only `console.error/warn`).
- Strapi boots cleanly; the 6 new blocks are selectable in a page's Dynamic Zone; `deepPopulate` returns their nested data.
- Run `yarn dev`; open `/fa/ai-solutions`:
  - All 10 sections render, RTL correct (text-right, Persian font, mirrored beams/rails), dark + light themes both correct.
  - Animations fire (hero particles, capabilities reveal-on-hover, process beam, metrics count-up, carousel expand, dock magnify); `prefers-reduced-motion` respected.
  - WebGL blocks do not throw on SSR (imported `ssr:false`).
- SEO checks:
  - `GET /sitemap.xml` includes `/fa/ai-solutions` and still includes home, blog, and articles (no regression).
  - View source: `<title>`, `<meta name="description">`, canonical, OG/Twitter all populated from `seo`.
  - JSON-LD present (Service + BreadcrumbList + WebPage; FAQPage from the FAQ block) and valid against schema.org.
  - Homepage and an existing article are unchanged.
- Mobile: layout, tap targets, and LCP acceptable (hero is light-weight by design).

---

## 11. Non-goals (YAGNI)

- No new locales (fa only); en/fr message files kept in sync but dormant.
- No ISR/caching/revalidate changes — keep current dynamic rendering + `draftMode` behavior.
- No redesign of existing pages, navbar, footer, auth, or cart.
- No new heavy 3D globe in the hero (kept optional/out for performance); globe remains available for other pages.
- No Strapi SEO/preview plugin work beyond what is described.

---

## 12. Risks & mitigations

- **Strapi schema change requires a restart** and unique `collectionName`s — mitigated by following the existing naming convention and restarting after adding components.
- **Build-time sitemap fetch could fail** — wrapped in `try/catch` with a static fallback so the build never breaks.
- **WebGL performance** — `ssr:false`, lazy below-fold, hero kept light; respect `prefers-reduced-motion`.
- **Seed double-create** — idempotent slug check + env guard; safe to re-run and off by default.
- **RTL regressions in reused blocks** — fixes are additive and locale-gated; verified visually.

---

## 13. Open questions

- Brand accent for the reveal shaders defaults to the existing blue/purple (`[59,130,246]`,`[139,92,246]`). Confirm if studioarman has a specific brand accent to use instead.
- Real proof points (metrics, client logos, case studies, testimonials) are placeholders; swap in real data in Strapi when available.

---

## Appendix A — Persian placeholder copy

> Realistic placeholder copy for an AI-services studio. Final copy editable in Strapi.

### 1. Hero
- Badge: «استودیو هوش مصنوعی»
- Heading: «راهکارهای هوش مصنوعی که کسب‌وکار شما را **متحول** می‌کند»
- Sub-heading: «از ایده تا استقرار؛ ما عاملان هوشمند، اتوماسیون و تحلیل داده را متناسب با فرایندهای شما طراحی و پیاده‌سازی می‌کنیم.»
- CTAs: «شروع پروژه» (primary, `/contact`) · «مشاوره‌ی رایگان» (outline, `/contact`)

### 2. Trust bar
- Heading: «مورد اعتماد تیم‌ها و کسب‌وکارها»

### 3. Capabilities (services)
- Heading: «چه کاری برای شما انجام می‌دهیم»
- Sub-heading: «مجموعه‌ای کامل از خدمات هوش مصنوعی، از مشاوره تا محصول نهایی.»
- Cards:
  1. «دستیار و چت‌بات هوشمند» — «پاسخ‌گویی خودکار، پشتیبانی ۲۴ساعته و دستیار داخلی سازمان بر پایه‌ی مدل‌های زبانی.» (`IconMessageChatbot`)
  2. «اتوماسیون فرایندها» — «حذف کارهای تکراری با گردش‌کارهای هوشمند و یکپارچه‌سازی ابزارها.» (`IconRobot`)
  3. «بینایی ماشین» — «پردازش تصویر و ویدئو برای کنترل کیفیت، تشخیص و دسته‌بندی.» (`IconEye`)
  4. «تحلیل و پیش‌بینی داده» — «مدل‌های پیش‌بینی، داشبورد و بینش‌های تصمیم‌ساز از داده‌های شما.» (`IconChartHistogram`)
  5. «جست‌وجوی دانش سازمانی (RAG)» — «پاسخ دقیق از روی اسناد و دانش داخلی شرکت شما.» (`IconDatabaseSearch`)
  6. «یکپارچه‌سازی مدل‌های زبانی» — «اتصال امن LLMها به محصولات و APIهای موجود شما.» (`IconPlugConnected`)

### 4. Process
- Heading: «چطور با هم کار می‌کنیم»
- Sub-heading: «یک مسیر شفاف و چهار مرحله‌ای از نیاز تا نتیجه.»
- Steps:
  1. «کشف و نیازسنجی» — «فرایندها و داده‌های شما را می‌شناسیم و فرصت‌های هوش مصنوعی را مشخص می‌کنیم.» (`IconSearch`)
  2. «طراحی راهکار» — «معماری، مدل و تجربه‌ی کاربری متناسب با هدف کسب‌وکار را طراحی می‌کنیم.» (`IconPencilBolt`)
  3. «پیاده‌سازی» — «راهکار را می‌سازیم، آزمایش می‌کنیم و با سیستم‌های شما یکپارچه می‌کنیم.» (`IconCode`)
  4. «استقرار و پشتیبانی» — «راه‌اندازی، پایش و بهبود مستمر پس از تحویل.» (`IconRocket`)

### 5. Use cases
- Heading: «کاربردها در صنایع مختلف»
- Sub-heading: «نمونه‌هایی از آنچه می‌توان ساخت.»
- Cards: «خرده‌فروشی» / «پشتیبانی مشتری هوشمند»؛ «سلامت» / «تحلیل تصاویر پزشکی»؛ «مالی» / «تشخیص تقلب»؛ «تولید» / «کنترل کیفیت بصری»؛ «آموزش» / «دستیار یادگیری شخصی».

### 6. Metrics
- Heading: «نتایجی که می‌سازیم»
- Metrics: «۴۰٪ کاهش هزینه‌ی عملیات»؛ «۳ برابر سرعت پاسخ‌گویی»؛ «۲۰۰۰+ ساعت صرفه‌جویی در سال»؛ «۹۸٪ رضایت کاربران».

### 7. Integrations
- Heading: «با ابزارهای شما کار می‌کند»
- Sub-heading: «اتصال امن به مدل‌ها، پایگاه‌های داده و سرویس‌های شما.»

### 8. Testimonials
- Heading: «مشتریان ما چه می‌گویند»

### 9. FAQ
- Heading: «سوال‌های پرتکرار»
- Q: «پروژه‌ی هوش مصنوعی چقدر زمان می‌برد؟» / A: «بسته به دامنه، از چند هفته برای یک نمونه‌ی اولیه تا چند ماه برای یک راهکار کامل.»
- Q: «داده‌های ما امن می‌مانند؟» / A: «بله؛ امنیت و حریم خصوصی داده‌ها در تمام مراحل اولویت ماست و امکان استقرار درون‌سازمانی وجود دارد.»
- Q: «اگر داده‌ی کافی نداشته باشیم چه؟» / A: «با مدل‌های پیش‌آموزش‌دیده و راهکارهای کم‌داده شروع می‌کنیم و به‌مرور بهبود می‌دهیم.»
- Q: «هزینه چگونه محاسبه می‌شود؟» / A: «پس از نیازسنجی رایگان، پیشنهاد قیمت شفاف بر اساس دامنه‌ی پروژه ارائه می‌کنیم.»

### 10. Final CTA
- Heading: «بیایید راهکار هوش مصنوعی شما را بسازیم»
- Sub-heading: «یک مشاوره‌ی رایگان رزرو کنید؛ در کمتر از یک روز پاسخ می‌دهیم.»
- Form: نام، ایمیل/شماره، توضیح کوتاه پروژه · دکمه: «ارسال درخواست»
