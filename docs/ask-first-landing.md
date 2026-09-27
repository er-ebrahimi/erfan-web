# Ask-first Studio Arman landing

## Overview

The homepage can lead with Strapi dynamic-zone blocks **`dynamic-zone.ask-hero`** and **`dynamic-zone.ai-gateway`** instead of (or before) the portfolio hero. Studio sections (`features`, projects, process, contact) stay unchanged; editors reorder blocks in Strapi.

## AI product URL

| Variable | Build-time | Purpose |
| -------- | :--------: | ------- |
| `NEXT_PUBLIC_AI_ARCHITECTURE_URL` | Yes | Base URL for the separate AI architecture app |

Default when unset: `http://localhost:3001`.

- Ask hero submit and suggestion chips navigate to `{base}?prompt={encoded}`.
- Questionnaire CTA uses `questionnaire_url` from CMS, or `{base}/questionnaire` when empty.
- AI gateway primary CTA opens the base URL; `action_links` use `shared.link` (`URL` may be absolute or a path under the base).

See `next/.env.studioarman.example`.

## Strapi

- `strapi/src/components/dynamic-zone/ask-hero.json`
- `strapi/src/components/dynamic-zone/ai-gateway.json`
- `strapi/src/components/ask/prompt-chip.json`
- Registered on **Pages** → `dynamic_zone` in `strapi/src/api/page/content-types/page/schema.json`

## Frontend

- `next/components/dynamic-zone/ask-hero.tsx`
- `next/components/dynamic-zone/ai-gateway.tsx`
- `next/lib/ai-architecture-url.ts`
- Mapped in `next/components/dynamic-zone/manager.tsx`

No live AI backend is wired in this repo; navigation only.
