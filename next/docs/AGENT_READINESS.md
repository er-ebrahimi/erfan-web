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

1. Middleware (`next/proxy.ts`) now returns a real HTTP `404` for any path that
   does not carry a supported locale prefix (e.g. `/some-path-that-does-not-exist`).
   Previously next-intl redirected such paths (307) to the default locale, and the
   final status depended on the client following redirects.
   - `curl -s -o /dev/null -w "%{http_code}" https://<domain>/nonexistent` now
     prints `404`.
   - The 404 body points agents at `/sitemap.xml` and `/llms.txt`, and serves a
     markdown body when `Accept: text/markdown` is present.
2. Root `not-found.tsx` (`next/app/not-found.tsx`) renders a markdown pre block
   for `Accept: text/markdown` requests and an HTML 404 for browsers.
3. The existing locale-prefixed `[locale]/not-found.tsx` is unchanged and still
   serves locale 404s with the full app shell.

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
