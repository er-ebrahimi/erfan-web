# Kodom Tech Front — Agent Guide

# CRITICAL RULES - MUST FOLLOW

## DOCUMENTATION

- Always create/update docs in the `docs/` folder for deployments, environment setup, and architecture decisions.
- Update `.env.example` when adding new environment variables.

## ENVIRONMENT & DEPLOYMENT

- **Never** use a placeholder fallback for a required env var (e.g. `process.env.FRONT_URL || 'https://website.com'`). Required vars fail the build (`next/env/validate.ts`) and the server start (`next/instrumentation.ts`).
- Product-specific values (`FRONT_URL`, Strapi hosts, `NEXT_PUBLIC_SITE_ID`) come from the product's `*_ENV_LOCAL` secret / `.env.<product>.example`. Never hardcode a product domain in shared code, `docker-compose.prod.yml`, or `remote-deploy.sh`; use `${VAR:?VAR is required}`.
- `.env.local` is **build-only**. Next's standalone output copies `.env` and `.env.production`, not `.env.local`. Any env read at request time must be passed in the container environment (`env_file: .env.runtime` or `environment:`).
- The Studioarman frontend deploys **only** through GitHub Actions (`.github/workflows/studioarman-cicd.yml`). Do not build/copy images or run containers by hand; the next deploy overwrites it.
- Adding a required env var means updating all of: `next/env/validate.ts`, `next/.env.example`, `docs/ENV-next.md`, the CI workflow fallback, and the deploy runtime env. Add a test.
- All site-URL output (`sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD, 404 markdown) must use `SITE_URL` from `next/lib/shared/site-url.ts`. Do not read `process.env.FRONT_URL` elsewhere.
- After changing `sitemap.xml` or `robots.txt`, purge the WCDN cache for that URL. It caches for a year.
- Run `yarn lint`, `yarn typecheck`, `yarn test:unit`, and `yarn build` before pushing. The pipeline enforces them too.

See `docs/ENV-RULES.md` for the incident and the guard map.

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

## CHANGE / EDIT MODE

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- Use the best model for the task - premium models for complex tasks (like coding) and mid-tier models for simpler tasks, like documentation
- After completing features (large or small), always run commands like lint, type check and next build to check code quality

## DATABASE SCHEMA CHANGES

- Whenever you make changes to the database schema, ALWAYS run the drizzle generate and migrate commands
- NEVER run drizzle push!

## TESTING

- Use any testing tools, libraries available to the project for testing your changes
- Never assume your changes simply work, always test!
- If the project does not have any testing tools, scripts, MCP tools, skills, etc. available for testing, ask the user whether testing should be skipped.

## UI DESIGN

- Always follow the UI design system when creating or reviewing components or pages.
- Design System: @DESIGN.md

# ErfanWeb — Next.js + Strapi monorepo

Persian (Farsi)-first blog/portfolio site for **studioarman.com**.
Forked from `strapi/LaunchPad`.

## Structure

- `next/` — Next.js 16 frontend (App Router, turbopack dev, standalone output)
- `strapi/` — Strapi 5.36 CMS (SQLite default, `better-sqlite3`)
- Root — orchestration, Husky, Prettier, lint-staged

## Key commands

| Where     | Command             | What it does                                                                    |
| --------- | ------------------- | ------------------------------------------------------------------------------- |
| root      | `yarn setup`        | installs root + Next + Strapi deps; copies `.env.example` → `.env`              |
| root      | `yarn dev`          | starts Strapi (`:1337`), waits for it, then starts Next (`:3000` via turbopack) |
| root      | `yarn seed`         | `cd strapi && yarn strapi import -f ./data/export_*.tar.gz --force`             |
| root      | `yarn fix:format`   | `prettier . --write --cache`                                                    |
| root      | `yarn check:format` | `prettier . --check --cache`                                                    |
| `next/`   | `yarn dev`          | `next dev --turbopack`                                                          |
| `next/`   | `yarn build`        | `next build` (output: `standalone`; sitemap runs in `postbuild`)                |
| `next/`   | `yarn lint`         | `eslint . --ext .js,.jsx,.ts,.tsx`                                              |
| `next/`   | `yarn typecheck`    | `tsc --noEmit`                                                                  |
| `next/`   | `yarn production`   | `cross-env PORT=4000 next start`                                                |
| `strapi/` | `yarn develop`      | Strapi dev with autoReload                                                      |
| `strapi/` | `yarn seed`         | `strapi import -f ./data/export_20250116105447.tar.gz`                          |

## i18n (next-intl v4)

- Only locale active: **`fa`** (Persian). Also `en`, `fr` message files exist.
- Config lives in two places: `next/config.ts` (defaultLocale, locales) and `next/i18n/routing.ts` (next-intl routing).
- Middleware at `next/proxy.ts` handles locale routing.
- Messages in `next/messages/{fa,en,fr}.json`.
- RTL via `next/lib/rtl-utils.ts` and `next/lib/fonts.ts` (Iran Sans font).
- **Always add new UI text to all available message files.**

## Linting / Formatting

- **Prettier** with `@trivago/prettier-plugin-sort-imports` (imports sorted: `@/…` then `./…`).
- **ESLint** in `next/` — `next/core-web-vitals` + `no-console` error (only `console.error`/`warn` allowed).
- **Husky pre-commit is check-only** (stub, not actively enforcing). `lint-staged-check.json` has check-only config.
- Order: `yarn fix:format` → `(cd next && yarn lint)` → `(cd next && yarn typecheck)`.

## Playwright E2E Testing

- Suite lives at `next/playwright.config.ts` (config) and `next/e2e/` (tests, pages, fixtures).
- Uses **Page Object Model** — all pages extend `BasePage` in `next/e2e/pages/`.
- Tests are tagged: `@smoke` (P0 — critical), `@regression` (P1 — important), `@api` (P1 — contract).
- Custom fixtures: `mockContactApi` (mocks `/api/contact` POST), `mockContactApiWithFailure`.
- ALTCHA handled via auto-verify (Web Crypto in browser) + route interception fallback.
- Runs against 3 projects: chromium (1280×720), tablet (768×1024), mobile (375×667).
- **After adding new pages or changing existing ones, always run smoke tests:**
  ```bash
  cd next && yarn test:e2e:smoke
  ```
- **Before releasing, run full suite:**
  ```bash
  cd next && yarn test:e2e
  ```
- **When adding a new page/feature, always create:**
  1. Page Object in `e2e/pages/`
  2. Smoke test in `e2e/tests/smoke/` (tagged `@smoke`)
  3. Regression test in `e2e/tests/regression/` (tagged `@regression`) if applicable
- **Always use role-based locators** (`getByRole`, `getByPlaceholder`, `getByLabel`), never CSS selectors.
- **Tests must be independent** — no shared state between tests.
- **Dynamic content**: use `test.skip(count === 0, 'No items')` for Strapi-driven content.

### Key commands

| Where   | Command                    | What it does                     |
| ------- | -------------------------- | -------------------------------- |
| `next/` | `yarn test:e2e`            | Full suite (all projects)        |
| `next/` | `yarn test:e2e:smoke`      | Smoke tests only (`@smoke`)      |
| `next/` | `yarn test:e2e:regression` | Regression tests (`@regression`) |
| `next/` | `yarn test:e2e:api`        | API contract tests (`@api`)      |
| `next/` | `yarn test:e2e:debug`      | Debug mode (Inspector)           |
| `next/` | `yarn test:e2e:ui`         | Playwright UI mode               |

## Deployment — CI/CD (studioarman)

The Studioarman frontend deploys through **GitHub Actions**. Do not build or copy images by hand.

- Workflow: `.github/workflows/studioarman-cicd.yml`
- Trigger: push to `studioarman/v0.0` (pull requests run lint/typecheck/build only)
- Pipeline: lint → typecheck → `next build` → Docker image (`linux/amd64`) → GHCR → SSH deploy
- Image: `ghcr.io/er-ebrahimi/erfan-web:studioarman-<sha>`
- Server pulls only; it never builds. Container `studioarman-web-blog`, host `127.0.0.1:3001` → container `4000`
- Runbook: `docs/DEPLOY-studioarman.md` · Env reference: `docs/ENV-next.md`

Another product (e.g. painfoolsstudio) uses its own caller workflow and `*_ENV_LOCAL` secret; the shared compose/script take `FRONT_URL` from that secret. See **Multi-product deployments** in the runbook.

The old manual `docker save` / `docker load` flow is not used.

## Architecture notes

- **Auth**: Next.js API routes (`next/app/api/auth/*`) proxy to Strapi's `users-permissions` plugin (JWT, 7d expiry).
- **Strapi custom middleware**: `deepPopulate` at `strapi/src/middlewares/deepPopulate.ts`.
- **SEO**: Dynamic redirects fetched from Strapi at build time in `next.config.mjs`. Metadata from Strapi `global` content type via `next/lib/shared/metadata.ts`.
- **Site identity**: Strapi `Global → siteName` / `siteDescription` feeds Organization/WebSite JSON-LD and `llms.txt`. The `NEXT_PUBLIC_SITE_*` env values are fallbacks; `NEXT_PUBLIC_SITE_NAME` also feeds the edge 404 markdown.
- **shadcn/ui** setup in `next/components.json`, aliases: `@/components`, `@/components/ui`, `@/lib/utils`.
- **Path alias**: `@/*` maps to `next/` directory root (see `next/tsconfig.json`).

## Runtime environment (Docker)

### Environment variables — 3 tiers

| Var                      | Prefixed?      | Read at         | Purpose                                                 | Local (Docker)                     | Server                          |
| ------------------------ | -------------- | --------------- | ------------------------------------------------------- | ---------------------------------- | ------------------------------- |
| `FRONT_URL`              | No             | Build + runtime | Canonical site URL (sitemap, robots, llms.txt, JSON-LD) | `http://localhost:3000`            | `https://studioarman.com`       |
| `STRAPI_INTERNAL_URL`    | No             | Runtime         | Server API calls (fetchContentType, auth, redirects)    | `http://host.docker.internal:1337` | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_API_URL`    | `NEXT_PUBLIC_` | Build (inlined) | Client auth calls (auth-context.tsx)                    | `http://localhost:1337`            | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_STRAPI_URL` | `NEXT_PUBLIC_` | Build (inlined) | Browser-facing image URLs                               | `http://localhost:1337`            | `https://studioarman.site:2087` |

`NEXT_PUBLIC_*` vars are **baked into the JS bundle at build time** — changing them requires a rebuild.  
`FRONT_URL` and other server-only vars are read from `process.env` at runtime — **`.env.local` is not in the standalone image**. The deploy job extracts `FRONT_URL` from the product's `*_ENV_LOCAL` secret and passes it to the container; the compose file requires it (`${FRONT_URL:?...}`) and has no default. Missing `FRONT_URL` fails the build (Zod) and leaves the container unready, so the deploy health check rolls back (`next/instrumentation.ts`).

### Product theming

`NEXT_PUBLIC_SITE_ID` controls **both favicons and the full color theme** per deployment.

| Var                   | Purpose                               | Default  |
| --------------------- | ------------------------------------- | -------- |
| `NEXT_PUBLIC_SITE_ID` | Selects favicon set + CSS color theme | `site-a` |

**One-line brand switch:** `NEXT_PUBLIC_SITE_ID=site-b` → rebuild → new colors everywhere.

**How it works:**

- `next/app/layout.tsx` reads `NEXT_PUBLIC_SITE_ID` and adds `theme-<id>` class to `<html>`.
- `next/app/themes.css` defines per-product CSS variable overrides (`.theme-site-b`, `.theme-site-b.dark`, etc.).
- Default values live in `:root` / `.dark` in `next/app/globals.css` (= site-a).
- `generateViewport()` picks the theme-color meta tag per product.

**To add a new product theme:**

1. Add a block in `next/app/themes.css` (`.theme-site-c`, `.theme-site-c.dark` — all shadcn tokens).
2. Add favicon set in `public/favicon-sets/site-c/`.
3. Deploy with `NEXT_PUBLIC_SITE_ID=site-c`.

See `next/docs/THEME_IMPLEMENTATION.md` for full details.

### Architecture notes (Docker)

- The server has **no Node.js** — everything (Strapi, Next.js, backups) runs in Docker containers, not directly on the host.
- Nginx proxies `https://studioarman.site:2087` → `http://127.0.0.1:1337` (Strapi container).
- The Next.js container connects to Strapi via Nginx at `https://studioarman.site:2087`.
- DNS in the container resolves `studioarman.site` to the server's public IP `185.239.3.14`.
- `host.docker.internal` is mapped to the Docker bridge gateway for local dev only.

## Local dev gotchas

- `.env.local` in `next/` is **not** gitignored (only `.env` is). Production values may be committed.
- Strapi has Windows-specific upload config (`strapi/config/plugins.ts` → `providerOptions.local`).
- `yarn dev` from root will fail if Strapi isn't running first (wait-on waits for `:1337`).
- Image optimization uses `sharp` in production; **unoptimized** in development (see `next.config.mjs`).
- Strapi `postinstall` regenerates its UUID — harmless but modifies `strapi/package.json`.
