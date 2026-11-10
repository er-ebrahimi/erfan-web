# Kodom landing migration

The Kodom Tech landing was ported to the studioarman Next app in two phases:

1. **Hardcoded preview** at `/[locale]/landing-preview` (noindex). Visual parity first.
2. **Strapi zones** that render the same sections from the CMS. The preview route
   switches to the Strapi page when a `pages` entry with slug `landing-preview` exists.

The existing homepage and its dynamic-zone sections were not changed. Add the new
zones to `homepage` in Strapi when you are ready to replace the old composition.

## Frontend map

| Path                                             | Purpose                                                                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `next/components/landing/effects/*`              | Ported Aceternity/React Bits effects (spotlight, rotating text, hover cards, timeline, marquee, bento, count-up, lamp) |
| `next/components/landing/sections/*`             | Prop-driven landing sections                                                                                           |
| `next/components/landing/demo-data.ts`           | Kodom Persian copy used until the CMS content is authored                                                              |
| `next/components/landing/media.ts`               | Resolves local paths and Strapi media objects                                                                          |
| `next/components/landing/icons.ts`               | Icon enum → lucide map with fallback                                                                                   |
| `next/components/navbar/navigation-6-navbar.tsx` | Navigation-6 shell fed by `global.navbar`                                                                              |
| `next/components/footer.tsx`                     | Restyled global footer, same Strapi data                                                                               |

Porting notes:

- `motion/react` was replaced with `framer-motion`.
- Tailwind v4-only classes (`w-5xl`, `w-4xl`, `w-xs`, `size-4.5`) were replaced
  with v3-safe equivalents.
- `tracking-tight` was dropped from Persian headings because negative tracking
  collides connected script; line heights are at least `1.4`.
- `shadow-derek` / `shadow-aceternity` already exist in `tailwind.config.ts`.

## Strapi components

Add them to `page.dynamic_zone` (already listed in
`strapi/src/api/page/content-types/page/schema.json`) and author content in the
admin. There is no seed script; content is intentionally manual.

| Zone                                | Nested component                             | Fields                                                                                                   |
| ----------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `dynamic-zone.landing-hero`         | `landing.word`                               | heading line 1, highlight, rotating words, subheading, CTAs (`shared.button`), image, chat label/message |
| `dynamic-zone.landing-benefits`     | `landing.benefit`                            | heading, subheading, items (title, description, icon enum, url)                                          |
| `dynamic-zone.landing-how-it-works` | `landing.step`                               | heading, subheading, steps (title, description, icon enum)                                               |
| `dynamic-zone.landing-gallery`      | `landing.gallery-item`                       | heading, subheading, items (title, image)                                                                |
| `dynamic-zone.landing-showcase`     | `landing.showcase-chat` / `-image` / `-quiz` | heading, subheading, three optional bento cards                                                          |
| `dynamic-zone.landing-stats`        | `landing.stat`                               | items (value, suffix, label)                                                                             |
| `dynamic-zone.landing-cta`          | —                                            | heading, subheading, CTAs                                                                                |

Icons are stored as enums (`camera`, `eye`, `sliders`, `languages`, `upload`,
`clipboard`, `chat`, `sparkles`, `ruler`, `palette`, `home`, `image`, `help`).
Unknown values fall back to `sparkles`.

The navbar reads the existing `global.navbar` tree. Top-level items **without**
children become the quick-links column; items **with** children become mega-menu
columns. Nothing from the current navigation is dropped. `global.navbar.cta`
(`shared.button`) is optional; the preview falls back to “شروع کنید” → `/contact`
until it is filled.

## Authoring flow

1. Restart Strapi so the new components and the `cta` field are registered.
2. Create a `Pages` entry with slug `landing-preview` (fa) or edit `homepage`.
3. Add the `Landing …` components in the dynamic zone, fill the fields, upload media.
4. Add the navbar CTA in `Global → Navbar`.
5. Open `http://localhost:3000/fa/landing-preview`; it renders the CMS page.
   Without that page it keeps showing the hardcoded demo.

Media: Strapi uploads are resolved through `getBestFormat` + `getStrapiMedia`,
so the existing `remotePatterns` in `next.config.ts` apply.

## Verification

```bash
cd next
yarn test:unit
yarn typecheck
yarn lint
yarn test:e2e:smoke
yarn build
```

The preview is noindex and intended as a sandbox; delete it and
`components/landing/demo-data.ts` once the homepage composition is final.
