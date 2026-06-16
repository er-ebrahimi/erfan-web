# AI Solutions Page — CRO Phase 2 (Real Work + Lead Capture)

**Date:** 2026-06-16
**Branch:** `feat/ai-solutions-page`
**Predecessor:** Phase 1 (copy/microcopy) — see `[[ai-solutions-page]]` memory and the critique in `C:\Users\solta\.claude\plans\act-as-an-expert-atomic-fern.md`.

## Context
Phase 1 softened unbacked claims but the page still had zero real proof and no on-page lead capture. The client supplied two real projects (a manufacturing AI visual-inspection system with measured outcomes, and a Persian handwritten-receipt OCR system at MVP stage) and asked for a dedicated lead-capture endpoint. This phase converts hypothetical content into attributed real work and captures leads inline. No testimonials/logos are available, so we do not fabricate any.

## Decisions (user-approved)
- **Publishable work:** both projects, **summarized** (OCR stripped of internal phases/timelines/pricing).
- **Layout:** a **new dedicated `نمونه‌کارها` case-studies section** above the closer; existing hypothetical use-cases stay.
- **Metrics:** **2 real + attributed** (95% detection precision, 60% shorter inspection cycle — both from the VQC project); other 2 stay illustrative.
- **Lead form:** **inline, replacing the closing CTA buttons**, posting to a **new endpoint**.

## Architecture (follows the existing 6-block pattern)
Each new block needs 3 touch-points: Strapi component JSON, page-schema UID registration, and a `manager.tsx` entry whose key equals the `__component` string.

### 1. Lead endpoint — `next/app/api/ai-solutions-lead/route.ts`
Mirrors `next/app/api/contact/route.ts`: `POST` → validate required fields → email via web3forms → `{ success, message }` (localized via `getApiMessage`). Body: `{ name, company, contact, need, locale }`. Subject `🚀 New AI-Solutions Lead`. Env: reuse `CONTACT_EMAIL_ACCESS_KEY`; recipient = `AI_SOLUTIONS_LEAD_EMAIL ?? CONTACT_EMAIL`. Turnstile omitted (matches current contact form state).

### 2. Lead form block — `dynamic-zone.lead-form`
- `next/components/dynamic-zone/lead-form.tsx` (client): heading + sub + RTL inline form (name / company / contact / need), submit `درخواست مشاوره‌ی رایگان`, reassurance line, status banner. Posts to `/api/ai-solutions-lead`. Locale-aware labels (Persian for RTL, English fallback). Styled to match the page (rounded-3xl, indigo/violet accents) reusing `Container`/`Heading`/`Subheading`.
- `strapi/src/components/dynamic-zone/lead-form.json`: `heading`, `sub_heading`, `reassurance` (all `text`).
- Replaces the `dynamic-zone.cta` closer on this page only; generic CTA untouched.

### 3. Case studies block — `dynamic-zone.case-studies`
- `strapi/src/components/shared/case-study.json`: `title`, `category`, `summary` (text), `outcomes` (repeatable `shared.metric`-style or simple text list), `tags` (text/JSON), `image` (media, optional).
  - Simplify: `outcomes` and `tags` as `json` arrays of strings to avoid extra sub-components.
- `strapi/src/components/dynamic-zone/case-studies.json`: `heading`, `sub_heading`, `case_studies` (repeatable `shared.case-study`).
- `next/components/dynamic-zone/case-studies.tsx`: responsive 2-up grid of rich cards — title, industry chip, summary, outcome chips, tech tags. RTL-aware, `prefers-reduced-motion` respected.

### 4. Metrics attribution
- Add optional `note` (`text`) to `strapi/src/components/shared/metric.json`.
- `metrics.tsx`: render `metric.note` as a small muted line under the label when present (Metric interface gets `note?: string`).
- Seed/preview: VQC tiles carry `note: 'منبع: پروژه‌ی بازرسی بصری'`.

### 5. Registration + data
- `manager.tsx`: add `dynamic-zone.case-studies` and `dynamic-zone.lead-form`.
- `page/schema.json`: append both UIDs to `dynamic_zone.components`.
- `strapi/src/index.ts` seed + `preview-ai-solutions/page.tsx`: insert case-studies block (after metrics or before FAQ), update 2 metric tiles, replace the closing `dynamic-zone.cta` with `dynamic-zone.lead-form`.

## Content (Persian, public-safe)
- **CS1 — بازرسی بصری هوشمند خط تولید** · تولید. Summary as approved. Outcomes: `~۹۵٪ دقت تشخیص`, `~۶۰٪ کاهش زمان بازرسی`, `درون‌سازمانی و شیفت‌پایدار`. Tags: Computer Vision, OpenCV, Python, Object Detection.
- **CS2 — استخراج هوشمند اطلاعات از رسیدهای دست‌نویس فارسی** · مالی و حسابداری. Summary as approved. Outcomes (qualitative, no numbers): `تکمیل خودکار فرم`, `اصلاح دستی + پایش KPI`, `قابل‌توسعه به ERP/انبار`. Tags: OCR, NLP, Python, Document AI.

## Verification
- **Verifiable now (Next preview `/fa/preview-ai-solutions`):** case-studies section renders RTL with both cards; metrics show 2 attributed tiles; closer shows inline form; form POST to `/api/ai-solutions-lead` returns a JSON result (validation path testable without real web3forms creds).
- **Unverified (Strapi can't boot here):** the 3 new component JSONs, page-schema registration, seed edits — authored to the existing pattern; user rebuilds + reseeds.

## Out of scope / not fabricated
No testimonials, client logos, or invented metrics. OCR card stays number-free. Pre-existing `useEffect` deps-size React warning (not introduced here) left for a separate task.
