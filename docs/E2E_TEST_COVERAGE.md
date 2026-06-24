# E2E Test Coverage Matrix

Generated from test listing. All tests run against 3 viewport projects (chromium, tablet, mobile-chrome) — 156 total test instances.

## Smoke Tests (P0) — 18 tests

| Test | File | What it Covers | Business Risk |
|------|------|----------------|---------------|
| Homepage loads without JS errors | `homepage.spec.ts` | Core render, no runtime errors | Site blank for all visitors |
| Homepage displays a main heading | `homepage.spec.ts` | Dynamic zone content renders | Users see empty page |
| Homepage renders navigation bar | `homepage.spec.ts` | Navbar component exists | Users can't navigate |
| Homepage renders footer | `homepage.spec.ts` | Footer component exists | Missing brand info/links |
| Homepage has Farsi RTL direction | `homepage.spec.ts` | `dir="rtl"` on `<html>` | Broken RTL layout |
| Navigation links are valid pages | `homepage.spec.ts` | Every nav link returns 200 | Dead links, 404s |
| Desktop: home link navigates | `navigation.spec.ts` | Nav link → `/fa` | Home link broken |
| Desktop: blog link navigates | `navigation.spec.ts` | Nav link → blog listing | Blog link broken |
| Mobile: menu opens with links | `navigation.spec.ts` | Sheet dialog renders | Mobile users can't navigate |
| Mobile: nav link navigates | `navigation.spec.ts` | Mobile link → blog | Mobile nav broken |
| Blog heading renders | `blog.spec.ts` | Blog page heading | Blog appears empty |
| Blog has search input | `blog.spec.ts` | Search field exists | Content not findable |
| Blog articles display | `blog.spec.ts` | Articles render in list | Content marketing broken |
| Article detail navigates | `blog.spec.ts` | Click article → detail page | Individual content unreachable |
| Article has metadata | `blog.spec.ts` | Back link, categories, date | Missing article chrome |
| Contact form fields visible | `contact-form.spec.ts` | Inputs render | Leads can't submit |
| Empty form validation | `contact-form.spec.ts` | Error on empty submit | Bad UX, no feedback |
| ALTCHA error state | `contact-form.spec.ts` | Captcha failure shown | Security feedback broken |
| Valid form submission | `contact-form.spec.ts` | Success message on submit | Lead generation broken |

## Regression Tests (P1) — 23 tests

| Test | File | What it Covers | Business Risk |
|------|------|----------------|---------------|
| Search filters articles | `blog-search.spec.ts` | FuzzySearch reduces results | Content not filterable |
| No-results message | `blog-search.spec.ts` | Empty state renders | Missing feedback on no results |
| Search clears/resets | `blog-search.spec.ts` | Empty search restores list | UX broken |
| Pagination controls visible | `blog-search.spec.ts` | Next/prev buttons when >6 items | Can't browse older content |
| Pagination navigation | `blog-search.spec.ts` | Click next → previous enabled | Pagination broken |
| 3 viewports × 2 pages | `responsive.spec.ts` | Desktop/tablet/mobile render correctly | Mobile/tablet users get broken layout |
| Mobile menu button visible | `responsive.spec.ts` | Hamburger shows on small screens | Mobile nav inaccessible |
| Mobile sheet opens | `responsive.spec.ts` | Sheet dialog has links | Mobile nav broken |
| Tablet navbar style | `responsive.spec.ts` | Tablet uses desktop nav | Wrong nav at tablet size |
| RTL on homepage + blog | `rtl.spec.ts` | `dir="rtl"` on `<html>` | RTL layout broken |
| Body text direction | `rtl.spec.ts` | CSS `direction: rtl` | Text flows wrong direction |
| Theme toggle visible | `theme.spec.ts` | Toggle button in navbar | Users can't switch theme |
| Toggle switches dark class | `theme.spec.ts` | Click adds/removes `.dark` | Theme toggle broken |
| Dark mode persists on reload | `theme.spec.ts` | Theme stored in localStorage | Preference lost on navigation |
| 404 returns HTTP 404 | `error-states.spec.ts` | Correct status code | SEO broken |
| 404 shows helpful content | `error-states.spec.ts` | Farsi "صفحه یافت نشد" visible | Users stuck on error |
| 404 has home link | `error-states.spec.ts` | "برو به خانه" link works | Users can't recover |

## API Tests (P1) — 8 tests

| Test | File | What it Covers | Business Risk |
|------|------|----------------|---------------|
| Contact API missing fields | `contact-api.spec.ts` | 400 on empty/partial payload | Form submits without validation |
| Contact API Farsi errors | `contact-api.spec.ts` | Localized error messages | Persian users see English/empty errors |
| ALTCHA challenge structure | `altcha.spec.ts` | Valid algorithm, challenge, salt, signature | Contact form security broken |
| ALTCHA uniqueness | `altcha.spec.ts` | Challenge changes per request | Replay attack vulnerability |
| ALTCHA response time | `altcha.spec.ts` | < 2s response time | Slow form initialization |

## Priority Legend

| Priority | Meaning | Failure response |
|----------|---------|-----------------|
| **P0** | Critical — site is unusable | Block release, fix immediately |
| **P1** | High — feature is degraded | Fix before next deploy |
| **P2** | Medium — nice to have | Fix when convenient |
