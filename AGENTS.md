# Kodom Tech Front — Agent Guide

# CRITICAL RULES - MUST FOLLOW

## DOCUMENTATION

- Always create/update docs in the `docs/` folder for deployments, environment setup, and architecture decisions.
- Update `.env.example` when adding new environment variables.

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

| Where | Command | What it does |
|-------|---------|--------------|
| root | `yarn setup` | installs root + Next + Strapi deps; copies `.env.example` → `.env` |
| root | `yarn dev` | starts Strapi (`:1337`), waits for it, then starts Next (`:3000` via turbopack) |
| root | `yarn seed` | `cd strapi && yarn strapi import -f ./data/export_*.tar.gz --force` |
| root | `yarn fix:format` | `prettier . --write --cache` |
| root | `yarn check:format` | `prettier . --check --cache` |
| `next/` | `yarn dev` | `next dev --turbopack` |
| `next/` | `yarn build` | `next build` (output: `standalone`; sitemap runs in `postbuild`) |
| `next/` | `yarn lint` | `eslint . --ext .js,.jsx,.ts,.tsx` |
| `next/` | `yarn typecheck` | `tsc --noEmit` |
| `next/` | `yarn production` | `cross-env PORT=4000 next start` |
| `strapi/` | `yarn develop` | Strapi dev with autoReload |
| `strapi/` | `yarn seed` | `strapi import -f ./data/export_20250116105447.tar.gz` |

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

## Deployment (legacy)

- Old blue-green Docker deploy via `next/deploy.sh` (not actively used).
- CI: `.github/workflows/deploy-demo.yaml` triggers GitLab pipeline on push to `main`.

See **Docker build & deploy** section below for the current deployment flow.

## Architecture notes

- **Auth**: Next.js API routes (`next/app/api/auth/*`) proxy to Strapi's `users-permissions` plugin (JWT, 7d expiry).
- **Strapi custom middleware**: `deepPopulate` at `strapi/src/middlewares/deepPopulate.ts`.
- **SEO**: Dynamic redirects fetched from Strapi at build time in `next.config.mjs`. Metadata from Strapi `global` content type via `next/lib/shared/metadata.ts`.
- **shadcn/ui** setup in `next/components.json`, aliases: `@/components`, `@/components/ui`, `@/lib/utils`.
- **Path alias**: `@/*` maps to `next/` directory root (see `next/tsconfig.json`).

## Docker build & deploy

### Environment variables — 3 tiers

| Var | Prefixed? | Inlined at build? | Purpose | Local (Docker) | Server |
|-----|-----------|:-:|---------|----------------|--------|
| `STRAPI_INTERNAL_URL` | No | ❌ Runtime | Server API calls (fetchContentType, auth, redirects) | `http://host.docker.internal:1337` | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_` | ✅ Yes | Client auth calls (auth-context.tsx) | `http://localhost:1337` | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_STRAPI_URL` | `NEXT_PUBLIC_` | ✅ Yes | Browser-facing image URLs | `http://localhost:1337` | `https://studioarman.site:2087` |

`NEXT_PUBLIC_*` vars are **baked into the JS bundle at build time** — changing them requires a rebuild.  
`STRAPI_INTERNAL_URL` is read from `process.env` at runtime — change it in `.env.local` and restart the container.

### Build & save image (local machine)
```bash
cd next
docker compose -f docker-compose.dev.yml build
docker save -o armanstudio-blog.tar armanstudio-blog:latest
```

### Deploy to server
```bash
# Copy the tar to the server, then:
docker load -i armanstudio-blog.tar
docker compose up -d   # start
docker compose down    # stop
```

### Server docker-compose.yml
```yaml
services:
  app:
    image: armanstudio-blog:latest
    container_name: armanstudio-blog
    ports:
      - "3000:4000"
    env_file:
      - .env.local
    dns:
      - 178.22.122.100
      - 185.51.200.2
      - 185.8.174.140
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

> **Why `dns` is needed:** Without explicit DNS, the container may fail to resolve `studioarman.site` (`EAI_AGAIN`). The public IP `185.239.3.14` is reachable from inside the container only via DNS resolution of the domain.

### Server .env.local
```
WEBSITE_URL=http://localhost:3000
PORT=4000
BACK_PORT=2087
DOMAIN=studioarman.site
STRAPI_INTERNAL_URL=https://studioarman.site:2087
NEXT_PUBLIC_API_URL=https://studioarman.site:2087
NEXT_PUBLIC_STRAPI_URL=https://studioarman.site:2087
PREVIEW_SECRET=tobemodified
IMAGE_HOSTNAME=studioarman.site:2087
```

### Architecture notes (Docker)
- Strapi runs directly on the host (not in Docker), bound to `127.0.0.1:1337`.
- Nginx on the host proxies `https://studioarman.site:2087` → `http://127.0.0.1:1337`.
- The Next.js container connects to Strapi via Nginx at `https://studioarman.site:2087`.
- DNS in the container resolves `studioarman.site` to the server's public IP `185.239.3.14`.
- `host.docker.internal` is mapped to the Docker bridge gateway for local dev only.

## Local dev gotchas

- `.env.local` in `next/` is **not** gitignored (only `.env` is). Production values may be committed.
- Strapi has Windows-specific upload config (`strapi/config/plugins.ts` → `providerOptions.local`).
- `yarn dev` from root will fail if Strapi isn't running first (wait-on waits for `:1337`).
- Image optimization uses `sharp` in production; **unoptimized** in development (see `next.config.mjs`).
- Strapi `postinstall` regenerates its UUID — harmless but modifies `strapi/package.json`.
