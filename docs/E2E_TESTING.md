# Playwright E2E Testing Guide

## Overview

End-to-end testing suite for the ErfanWeb Next.js frontend using **Playwright** with **TypeScript** and the **Page Object Model (POM)**.

- **Config**: `next/playwright.config.ts`
- **Tests**: `next/e2e/tests/`
- **Pages**: `next/e2e/pages/`
- **Fixtures**: `next/e2e/fixtures/`

## Setup

### Prerequisites

- Node.js 20+
- Strapi CMS running on `localhost:1337`
- `ALTCHA_HMAC_SECRET` set in `next/.env.local`

### Install

```bash
# From next/ directory
yarn add -D @playwright/test
npx playwright install chromium
```

## Running Tests

### All tests (3 projects × all specs)

```bash
cd next
yarn test:e2e
```

### By tag

```bash
yarn test:e2e:smoke        # @smoke — critical P0 flows
yarn test:e2e:regression   # @regression — P1/P2 coverage
yarn test:e2e:api          # @api — API contract tests
```

### Development helpers

```bash
yarn test:e2e:debug        # Run with Playwright Inspector
yarn test:e2e:ui           # Run with Playwright UI mode
```

### Single file

```bash
npx playwright test e2e/tests/smoke/homepage.spec.ts
```

## Project Structure

```
next/
├── playwright.config.ts         # 3 projects, retries, webServer auto-start
└── e2e/
    ├── .env.example
    ├── fixtures/
    │   └── index.ts             # mockContactApi, mockContactApiWithFailure
    ├── pages/
    │   ├── base.page.ts         # Abstract: direction, dark mode, footer access
    │   ├── homepage.page.ts     # /fa
    │   ├── navbar.page.ts       # Desktop nav + mobile Sheet + theme toggle
    │   ├── blog-listing.page.ts # /fa/category/blog — search, pagination
    │   ├── article.page.ts      # Single article — title, content, categories
    │   ├── contact.page.ts      # ALTCHA widget, form fields, success/error
    │   └── cms-page.page.ts     # Generic CMS page by slug
    ├── tests/
    │   ├── smoke/               # P0 critical flows
    │   ├── regression/          # P1/P2 coverage
    │   └── api/                 # API contract validation
    ├── utils/
    │   ├── constants.ts         # LOCALE, ROUTES, VIEWPORTS, labels
    │   └── helpers.ts           # collectPageErrors, waitForPageStable
    └── data/
        └── test-data.ts         # CONTACT_FORM, BLOG_SEARCH fixtures
```

## Page Object Model

Every page extends `BasePage`:

```typescript
export class MyPage extends BasePage {
  get path(): string { return '/fa/my-route'; }

  // Role-based locators only — no fragile CSS
  get heading() { return this.page.getByRole('heading', { level: 1 }); }
  get submitBtn() { return this.page.getByRole('button', { name: 'ارسال' }); }
}
```

**Rules:**
- Always expose `get path()` — enables `goto()`
- Use `getByRole()`, `getByPlaceholder()`, `getByLabel()` — never CSS selectors
- Expose **locators** (not strings), let tests decide assertions
- Never add assertions inside page objects

## Fixtures

Two custom fixtures are available in `e2e/fixtures/index.ts`:

### `mockContactApi`

Intercepts `POST /api/contact` and returns `{ success: true }`. Prevents real email sending via web3forms.

```typescript
import { test } from '../../fixtures';

test('submits form', async ({ page, mockContactApi }) => {
  // POST to /api/contact is now mocked
});
```

### `mockContactApiWithFailure`

Intercepts `POST /api/contact` and returns 400 with `{ success: false }`.

## ALTCHA Strategy

The contact form uses ALTCHA for spam protection. The E2E suite handles it two ways:

### 1. Auto-verify (preferred)

The `contact.page.ts` `waitForAltchaVerification()` method polls the widget's state:

```typescript
const verified = await contactPage.waitForAltchaVerification();
if (!verified) test.skip(true, 'ALTCHA not verified');
```

This works because Chromium supports the Web Crypto API that ALTCHA uses.

### 2. Route interception (fallback)

For tests that need control, intercept `/api/altcha/challenge` to return a known payload. See `contact-form.spec.ts` for an example.

## Tag Conventions

| Tag | Priority | When to run | Failures mean |
|-----|----------|-------------|---------------|
| `@smoke` | P0 | Every deploy | Site is broken |
| `@regression` | P1 | Before release | Feature degraded |
| `@api` | P1 | After API changes | Contract broken |

## Writing Tests

### Template

```typescript
/**
 * Why: [user-centric reason]
 * Business risk: [what happens if this breaks]
 * Priority: P0/P1/P2
 */
import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { MyPage } from '../../pages/my.page';

test.describe('Feature', { tag: '@smoke' }, () => {
  test('loads successfully', async ({ page }) => {
    const myPage = new MyPage(page);
    await myPage.goto();
    await expect(myPage.heading).toBeVisible();
  });
});
```

### Handling dynamic content

The site content comes from Strapi, so tests must handle missing data gracefully:

```typescript
const count = await myPage.items.count();
test.skip(count === 0, 'No items available');
```

### Smart waiting

- `page.waitForLoadState('networkidle')` after navigation
- `page.waitForTimeout(300)` after client-side search/filter (FuzzySearch)
- Playwright's auto-waiting handles most cases — no manual `waitForSelector` needed

## CI/CD

The `.github/workflows/e2e.yml` workflow:

1. Starts on push/PR to `main` affecting `next/` or `e2e.yml`
2. Installs dependencies and Playwright browsers
3. Starts Strapi (if available)
4. Runs Playwright in 4 parallel shards
5. Uploads HTML reports per shard
6. Merges reports into one artifact

### Running CI locally

```bash
npx playwright test --shard=1/4
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Pages return 500 | Strapi not running | Start Strapi: `cd strapi && yarn develop` |
| ALTCHA never verifies | Rate-limited or secret mismatch | Ensure `ALTCHA_HMAC_SECRET` in `.env.local` |
| Mobile menu not found | Viewport too large | Set `test.use({ viewport: { width: 375, height: 667 } })` |
| Tests flaky | Race conditions | Add `waitForLoadState('networkidle')` after navigation |
| ESLint fails on e2e/| e2e dir not in .eslintignore | Already added to tsconfig exclude |
