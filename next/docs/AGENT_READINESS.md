# Agent Readiness (llms.txt, 404s, JSON-LD)

Machine-readability improvements that help AI crawlers and agents understand
the site. Implemented to raise the "Is Agentic" readiness score.

## What was added

### `/llms.txt` (markdown content negotiation)

Route handler at `next/app/llms.txt/route.ts`. Serves a markdown overview of the
site with links to `/sitemap.xml`, the homepage and supported locales.

- `Content-Type` is `text/markdown; charset=utf-8` when the request sends
  `Accept: text/markdown`, otherwise `text/plain; charset=utf-8`.
- Responds with `Vary: Accept, Accept-Encoding` so CDNs cache the two variants
  separately.
- `Cache-Control: public, max-age=3600`.
- The route is `force-dynamic` — without it Next.js may statically optimize the
  GET handler and serve a cached content-type instead of reading the request's
  Accept header at runtime.

Content comes from `process.env.FRONT_URL`, `NEXT_PUBLIC_SITE_NAME` and
`NEXT_PUBLIC_SITE_DESCRIPTION` (fallbacks: `https://studioarman.com`,
`Studio Arman`).

### Agent-friendly 404s

1. Middleware (`next/proxy.ts`) responds to any path without a supported locale
   prefix (e.g. `/some-path-that-does-not-exist`):
   - With `Accept: text/markdown`, it returns a real HTTP `404` with a markdown
     body pointing agents at `/sitemap.xml` and `/llms.txt`.
   - Otherwise it rewrites internally to `/{defaultLocale}/_404{pathname}`
     (browser URL unchanged), so the app renders its server-side 404 while the
     status stays `404`.
   - `curl -s -o /dev/null -w "%{http_code}" https://<domain>/nonexistent` still
     prints `404` (no redirect).
2. Unmatched nested URLs (e.g. `/fa/foo/bar`) fall through to the root
   `next/app/not-found.tsx`, which renders the same localized `<NotFound />`
   component and stays server-rendered. With `Accept: text/markdown`, the body
   contains the markdown agent payload.
3. Locale-prefixed `[locale]/not-found.tsx` serves `notFound()` calls from real
   routes (e.g. a deleted CMS slug). Its markdown body is rendered for
   `Accept: text/markdown` requests (the response is still HTML — a rendered
   page cannot set `text/markdown`).

### Server-side JSON-LD identity

`next/lib/shared/site-structured-data.ts` builds `Organization` and `WebSite`
schema.org JSON-LD. The root layout (`next/app/layout.tsx`) renders one
`application/ld+json` `<script>` per schema (`site-organization-structured-data`,
`site-website-structured-data`) so every page — including the homepage — carries
machine-readable identity in the raw HTML, independent of Strapi SEO data.

## Environment variables (`.env.example`)

- `NEXT_PUBLIC_SITE_NAME` — brand name for JSON-LD and llms.txt.
- `NEXT_PUBLIC_SITE_DESCRIPTION` — one-line description for JSON-LD and llms.txt.

## Testing

- `e2e/tests/api/agent-readiness.spec.ts` (`@api`): 404 status on bare + locale
  paths, 404 markdown body, llms.txt negotiation + `Vary`, homepage JSON-LD.
- `lib/__tests__/site-structured-data.test.ts` (vitest): schema shape, types,
  escaping, JSON validity.

```bash
cd next
yarn test:unit
BASE_URL=http://localhost:3000 npx playwright test agent-readiness
```

## Verification commands

```bash
curl -s -o /dev/null -w "%{http_code}" https://studioarman.com/some-path-that-does-not-exist   # 404
curl -s https://studioarman.com/llms.txt                                                        # markdown
curl -s -H "Accept: text/markdown" https://studioarman.com/llms.txt -D -                        # text/markdown + Vary: Accept
```
