# Environment rules — incident and guard map

## Incident: `sitemap.xml` served `https://website.com`

The sitemap was generated at request time (ISR) with a placeholder fallback instead of the real site URL.

Root cause chain:

1. `next/app/sitemap.ts` had `process.env.FRONT_URL || 'https://website.com'`. A missing env var did not fail; it silently emitted the template domain.
2. The sitemap is ISR (`revalidate = 86400`) and fetches Strapi at runtime, so it read `process.env.FRONT_URL` **in the container**, not at build time.
3. The container had no runtime environment:
   - `next/deploy/docker-compose.prod.yml` had no `environment:` or `env_file:`.
   - The Dockerfile copies only Next's standalone output. Next copies `.env` and `.env.production` into standalone, **not `.env.local`**.
   - `STUDIOARMAN_ENV_LOCAL` wrote `next/.env.local` before the build, so the value existed at build time only.
4. `robots.txt` is static, so it was built with the correct `FRONT_URL`. `sitemap.xml` is runtime, so it fell back to `https://website.com`. That mismatch was the tell.
5. WCDN cached the wrong sitemap with `max-age=31536000, immutable`, so the fix also required a cache purge.

## Rules

1. **No placeholder fallbacks for required env.** Required means the build fails (Zod) and the server fails to become ready (instrumentation). Never `process.env.X || 'https://…'`.
2. **Product config comes from the product's secret.** `FRONT_URL`, Strapi hosts and `NEXT_PUBLIC_SITE_ID` live in `<PRODUCT>_ENV_LOCAL` / `.env.<product>.example`. Site identity (`siteName` / `siteDescription`) lives in Strapi Global; the env values are fallbacks and the edge 404 source. Shared code, compose and scripts must not hardcode a product domain. Compose uses `${VAR:?VAR is required}`.
3. **`.env.local` is build-only.** Next standalone does not copy it. Any env read at request time must be passed in the container environment (`env_file: .env.runtime` or `environment:`).
4. **One site URL source.** `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD and 404 markdown import `SITE_URL` from `next/lib/shared/site-url.ts`. Do not read `process.env.FRONT_URL` anywhere else.
5. **CI/CD is the only deploy path.** Push to the product branch; GitHub Actions builds the image, pushes to GHCR and deploys. Never build or `docker run` by hand — the next deploy overwrites it.
6. **Adding a required env var touches all of:** `next/env/validate.ts`, `next/.env.example`, `docs/ENV-next.md`, the CI workflow fallback, the deploy runtime env, and a test.
7. **Purge the CDN after changing `sitemap.xml` or `robots.txt`.** WCDN caches them for a year.
8. **Run the checks before pushing:** `yarn lint`, `yarn typecheck`, `yarn test:unit`, `yarn build`.

## Guard map

| Rule                            | Enforced by                                                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No `FRONT_URL` fallback         | `next/lib/shared/site-url.ts` throws; `next/lib/__tests__/env-fallbacks.test.ts`                                                                                                                             |
| Required at build               | `next/env/validate.ts`; `next/lib/__tests__/env-validate.test.ts`                                                                                                                                            |
| Required at runtime             | `next/instrumentation.ts` — server fails to become ready                                                                                                                                                     |
| Product value from the secret   | `.github/workflows/studioarman-cicd.yml` (writes `.env.runtime` + resolves `FRONT_URL`); `next/deploy/docker-compose.prod.yml` (`env_file: .env.runtime`, `${FRONT_URL:?…}`); `next/deploy/remote-deploy.sh` |
| No placeholder in sitemap       | `next/e2e/tests/api/sitemap-seo.spec.ts`                                                                                                                                                                     |
| CI fails if the secret is empty | Workflow `grep -q '^FRONT_URL=.'`                                                                                                                                                                            |
| CDN purge after sitemap change  | `docs/DEPLOY-studioarman.md`                                                                                                                                                                                 |

## Multi-product checklist

- Secret `<PRODUCT>_ENV_LOCAL` contains `FRONT_URL=https://<domain>`, `NEXT_PUBLIC_API_URL` and the right `NEXT_PUBLIC_SITE_ID`.
- A separate caller workflow (or a reusable workflow) with its own branch, container name, host port, deploy dir and image tag prefix.
- The compose/script pattern is unchanged; pass `FRONT_URL` and it works for any product.
- Do not deploy a second product through `studioarman-cicd.yml`.

## Verification

```bash
# Must fail with "required variable FRONT_URL is missing a value"
docker compose -f next/deploy/docker-compose.prod.yml config

# Must pass
cd next && yarn test:unit
cd next && yarn build

# After deploy and CDN purge
curl -s https://<domain>/sitemap.xml | grep -m1 '<loc>'
```
