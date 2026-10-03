# Next.js environment variables (`next/`)

The Next app validates environment variables with **Zod** in `next/env/validate.ts`. Validation runs when Next loads `next.config.ts` (including `next build`). A missing or invalid **required** variable fails the build with a message that names the variable.

## Required vs optional

| Variable                         | Scope            | Required at build | Purpose                                                                      |
| -------------------------------- | ---------------- | ----------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`            | Public (inlined) | **Yes**           | Strapi origin, auth, images, redirect fetch at build                         |
| `NEXT_PUBLIC_SITE_URL`           | Public           | No                | `next-sitemap` site URL (falls back to `DOMAIN`, then `https://example.com`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public           | No                | Cloudflare Turnstile widget (currently commented out in UI)                  |
| `DOMAIN`                         | Build            | No                | `next.config.ts` image `remotePatterns`                                      |
| `BACK_PORT`                      | Build            | No                | Strapi upload port in image config                                           |
| `IMAGE_HOSTNAME`                 | Build            | No                | `allowedDevOrigins`                                                          |
| `BACKEND_URL`                    | Build / server   | No                | Legacy media URLs; client media uses `NEXT_PUBLIC_API_URL`                   |
| `WEBSITE_URL`                    | Server           | No                | `config.ts` canonical host                                                   |
| `PORT`                           | Server / runtime | No                | Listen port fallback in `config.ts` (Docker image sets `4000`)               |
| `PREVIEW_SECRET`                 | Server           | No                | `app/api/preview`                                                            |
| `TURNSTILE_SECRET_KEY`           | Server           | No                | Contact route Turnstile verify                                               |
| `CONTACT_EMAIL_ACCESS_KEY`       | Server           | No                | Web3Forms                                                                    |
| `CONTACT_EMAIL`                  | Server           | No                | Contact recipient (defaults to placeholder if unset)                         |
| `SKIP_ENV_VALIDATION`            | Tooling          | No                | `1` / `true` skips validation (used by `yarn lint` / `yarn typecheck`)       |

Server-only values live in `next/env/server.ts` (`import 'server-only'`). Client code must use `next/env/client.ts` (`NEXT_PUBLIC_*` only).

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

**GitHub secrets** (Studioarman pipeline — see also `docs/DEPLOY-studioarman.md` when that workflow is merged):

| Secret                                                        | Purpose                                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `STUDIOARMAN_ENV_LOCAL`                                       | Full `next/.env.local` for image build (must include `NEXT_PUBLIC_API_URL`) |
| `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PORT` | SSH deploy                                                                  |
| `GHCR_USERNAME`, `GHCR_PULL_TOKEN`                            | Pull image on server                                                        |

**Minimum production `next/.env.local` content** (adjust hosts):

```env
NEXT_PUBLIC_API_URL=https://studioarman.site:2087
DOMAIN=studioarman.site
BACK_PORT=2087
IMAGE_HOSTNAME=studioarman.site:2087
BACKEND_URL=https://studioarman.site:2087
WEBSITE_URL=studioarman.site
PREVIEW_SECRET=<strong-secret>
# Optional contact / Turnstile when form is enabled
```
