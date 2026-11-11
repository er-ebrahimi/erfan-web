# Next.js environment variables (`next/`)

> Deployment rules and the `website.com` sitemap incident: [`docs/ENV-RULES.md`](./ENV-RULES.md).

The Next app validates environment variables with **Zod** in `next/env/validate.ts`. Validation runs when Next loads `next.config.ts` (including `next build`). A missing or invalid **required** variable fails the build with a message that names the variable. `next/instrumentation.ts` also checks `FRONT_URL` when the server starts; a container without it fails to become ready, so the deploy health check rolls it back.

> **Build vs runtime:** `.env.local` is read during the build only. Next's standalone output copies `.env` and `.env.production`, **not `.env.local`**. Server-only values read at request time (`FRONT_URL`, `STRAPI_INTERNAL_URL`, contact secrets) must be passed in the container environment. The deploy job copies the product's `*_ENV_LOCAL` secret to `.env.runtime` on the server and the compose file loads it with `env_file`; `FRONT_URL` is also required for compose interpolation.

## Required vs optional

| Variable                                       | Scope            | Required at build  | Purpose                                                                                                                                               |
| ---------------------------------------------- | ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FRONT_URL`                                    | Build + runtime  | **Yes**            | Canonical site URL for `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD and 404 markdown. Missing → build fails; missing at runtime → container exits |
| `NEXT_PUBLIC_API_URL`                          | Public (inlined) | **Yes**            | Strapi origin, auth, images, redirect fetch at build                                                                                                  |
| `NEXT_PUBLIC_SITE_ID`                          | Public (inlined) | **Yes**            | Theme + favicon set (`theme-<id>`)                                                                                                                    |
| `NEXT_PUBLIC_SITE_NAME`                        | Public (inlined) | **Yes** (fallback) | Fallback for Strapi `Global → siteName`; edge 404 markdown                                                                                            |
| `NEXT_PUBLIC_SITE_DESCRIPTION`                 | Public (inlined) | **Yes** (fallback) | Fallback for Strapi `Global → siteDescription`                                                                                                        |
| `NEXT_PUBLIC_STRAPI_URL`                       | Public (inlined) | No                 | Browser media host; falls back to `NEXT_PUBLIC_API_URL`                                                                                               |
| `NEXT_PUBLIC_SITE_URL`                         | Public           | No                 | Not used by the current app; the sitemap uses `FRONT_URL`                                                                                             |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`               | Public           | No                 | Cloudflare Turnstile widget (currently commented out in UI)                                                                                           |
| `DOMAIN`                                       | Build            | No                 | `next.config.ts` image `remotePatterns`                                                                                                               |
| `BACK_PORT`                                    | Build            | No                 | Strapi upload port in image config                                                                                                                    |
| `IMAGE_HOSTNAME`                               | Build            | No                 | `allowedDevOrigins`                                                                                                                                   |
| `BACKEND_URL`                                  | Build / server   | No                 | Legacy media URLs; client media uses `NEXT_PUBLIC_API_URL`                                                                                            |
| `WEBSITE_URL`                                  | Server           | No                 | `config.ts` canonical host                                                                                                                            |
| `PORT`                                         | Server / runtime | No                 | Listen port fallback in `config.ts` (Docker image sets `4000`)                                                                                        |
| `PREVIEW_SECRET`                               | Server           | No                 | `app/api/preview`                                                                                                                                     |
| `TURNSTILE_SECRET_KEY`                         | Server           | No                 | Contact route Turnstile verify                                                                                                                        |
| `ALTCHA_HMAC_SECRET`                           | Server runtime   | No                 | ALTCHA challenge signing; missing → contact form fails loudly                                                                                         |
| `NOTIFICATION_PROVIDER`                        | Server runtime   | No                 | `bale`, `telegram` or `web3forms` (defaults to `web3forms`)                                                                                           |
| `BALE_BOT_TOKEN`, `BALE_ADMIN_CHAT_ID`         | Server runtime   | No                 | Bale provider                                                                                                                                         |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` | Server runtime   | No                 | Telegram provider                                                                                                                                     |
| `CONTACT_EMAIL_ACCESS_KEY`                     | Server runtime   | No                 | Web3Forms                                                                                                                                             |
| `CONTACT_EMAIL`                                | Server runtime   | No                 | Contact recipient; missing → Web3Forms fails loudly                                                                                                   |
| `SKIP_ENV_VALIDATION`                          | Tooling          | No                 | `1` / `true` skips validation (used by `yarn lint` / `yarn typecheck`)                                                                                |

Server-only values live in `next/env/server.ts` (`import 'server-only'`). Client code must use `next/env/client.ts` (`NEXT_PUBLIC_*` only).

Site identity is read from Strapi Global (`siteName` / `siteDescription`) in `[locale]/layout.tsx` and `llms.txt`. The `NEXT_PUBLIC_SITE_*` env values are the fallback when Strapi is unavailable, and `NEXT_PUBLIC_SITE_NAME` also feeds the edge 404 markdown.

## Escape hatch

```bash
SKIP_ENV_VALIDATION=1 yarn lint
SKIP_ENV_VALIDATION=1 yarn typecheck
```

Do **not** set this for `next build`, Docker image builds, or production deploys.

## CI and Docker

- **GitHub Actions** (`.github/workflows/studioarman-cicd.yml`): the quality job sets `NEXT_PUBLIC_API_URL` (and related build vars) for `yarn build`. Production Docker builds use the `STUDIOARMAN_ENV_LOCAL` secret as `next/.env.local`.
- **Dockerfile** (`next/Dockerfile`): `node:22-alpine`, `npm run build` after copying `.env.local`. Same validation rules apply.

Template: `next/.env.example`.

## Owner checklist (secrets / server)

**GitHub secrets** (Studioarman pipeline — see also `docs/DEPLOY-studioarman.md`):

| Secret                                                        | Purpose                                                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `STUDIOARMAN_ENV_LOCAL`                                       | Full `next/.env.local` for the image build (must include `FRONT_URL` and `NEXT_PUBLIC_API_URL`) |
| `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PORT` | SSH deploy                                                                                      |
| `GHCR_USERNAME`, `GHCR_PULL_TOKEN`                            | Pull image on server                                                                            |

**Minimum production `next/.env.local` content** (adjust hosts):

```env
FRONT_URL=https://studioarman.com
NEXT_PUBLIC_API_URL=https://studioarman.site:2087
NEXT_PUBLIC_STRAPI_URL=https://strapi.studioarman.com
NEXT_PUBLIC_SITE_ID=studioarman
NEXT_PUBLIC_SITE_NAME=Studio Arman
NEXT_PUBLIC_SITE_DESCRIPTION=Studio Arman — portfolio and blog of Erfan, a web developer and designer.
DOMAIN=studioarman.site
BACK_PORT=2087
IMAGE_HOSTNAME=studioarman.site:2087
BACKEND_URL=https://studioarman.site:2087
WEBSITE_URL=studioarman.site
PREVIEW_SECRET=<strong-secret>
ALTCHA_HMAC_SECRET=<strong-secret>
NOTIFICATION_PROVIDER=bale
BALE_BOT_TOKEN=<token>
BALE_ADMIN_CHAT_ID=<chat-id>
CONTACT_EMAIL_ACCESS_KEY=<key>
CONTACT_EMAIL=<email>
# Optional: TURNSTILE_SECRET_KEY when Turnstile is enabled
```
