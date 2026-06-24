# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression\blog-search.spec.ts >> Blog search and pagination >> pagination controls appear when there are enough articles
- Location: e2e\tests\regression\blog-search.spec.ts:59:7

# Error details

```
Error: locator.count: Target page, context or browser has been closed
```

# Test source

```ts
  1  | /**
  2  |  * Regression Test: Blog Search & Pagination
  3  |  * 
  4  |  * Why: Users need to find specific articles. Broken search means
  5  |  * content is effectively invisible. FuzzySearch is client-side,
  6  |  * so it must work across all supported browsers.
  7  |  * 
  8  |  * Business risk: Reduced content discoverability, user frustration.
  9  |  * Priority: P1 (High)
  10 |  */
  11 | 
  12 | import { expect } from '@playwright/test';
  13 | import { test } from '../../fixtures';
  14 | import { BlogListingPage } from '../../pages/blog-listing.page';
  15 | import { BLOG_SEARCH } from '../../data/test-data';
  16 | 
  17 | test.describe('Blog search and pagination', { tag: '@regression' }, () => {
  18 |   let blogPage: BlogListingPage;
  19 | 
  20 |   test.beforeEach(async ({ page }) => {
  21 |     blogPage = new BlogListingPage(page);
  22 |     await blogPage.goto();
  23 |   });
  24 | 
  25 |   // test('filters articles as user types in search', async () => {
  26 |   //   const initialCount = await blogPage.articleRowLinks.count();
  27 |   //   test.skip(initialCount === 0, 'No articles to search');
  28 | 
  29 |   //   await blogPage.search(BLOG_SEARCH.existingTerm);
  30 |   //   await blogPage.page.waitForTimeout(500);
  31 |   //   const filteredCount = await blogPage.articleRowLinks.count();
  32 |   //   expect(filteredCount).toBeLessThanOrEqual(initialCount);
  33 |   // });
  34 | 
  35 |   // test('shows no results message for non-matching search', async () => {
  36 |   //   const initialCount = await blogPage.articleRowLinks.count();
  37 |   //   test.skip(initialCount === 0, 'No articles to search');
  38 | 
  39 |   //   await blogPage.search(BLOG_SEARCH.nonExistingTerm);
  40 |   //   await blogPage.page.waitForTimeout(500);
  41 | 
  42 |   //   await expect(blogPage.noResultsMessage).toBeVisible();
  43 |   // });
  44 | 
  45 |   // test('search input is cleared and resets to full list', async () => {
  46 |   //   const initialCount = await blogPage.articleRowLinks.count();
  47 |   //   test.skip(initialCount === 0, 'No articles to search');
  48 | 
  49 |   //   await blogPage.search(BLOG_SEARCH.nonExistingTerm);
  50 |   //   await blogPage.page.waitForTimeout(500);
  51 |   //   await expect(blogPage.noResultsMessage).toBeVisible();
  52 | 
  53 |   //   await blogPage.search('');
  54 |   //   await blogPage.page.waitForTimeout(500);
  55 |   //   const resetCount = await blogPage.articleRowLinks.count();
  56 |   //   expect(resetCount).toBe(initialCount);
  57 |   // });
  58 | 
  59 |   test('pagination controls appear when there are enough articles', async () => {
> 60 |     const initialCount = await blogPage.articleRowLinks.count();
     |                                                         ^ Error: locator.count: Target page, context or browser has been closed
  61 |     test.skip(initialCount <= 6, 'Not enough articles for pagination (need >6)');
  62 | 
  63 |     await expect(blogPage.nextButton).toBeVisible();
  64 |     await expect(blogPage.pageInfo).toBeVisible();
  65 |   });
  66 | 
  67 |   test('navigates to next page and back', async () => {
  68 |     const initialCount = await blogPage.articleRowLinks.count();
  69 |     test.skip(initialCount <= 6, 'Not enough articles for pagination');
  70 | 
  71 |     await blogPage.nextButton.click();
  72 |     await blogPage.page.waitForTimeout(300);
  73 | 
  74 |     await expect(blogPage.previousButton).toBeVisible();
  75 |     expect(await blogPage.previousButton.isEnabled()).toBe(true);
  76 | 
  77 |     await blogPage.previousButton.click();
  78 |     await blogPage.page.waitForTimeout(300);
  79 |   });
  80 | });
  81 | 
```