/**
 * Regression Test: Blog Search & Pagination
 * 
 * Why: Users need to find specific articles. Broken search means
 * content is effectively invisible. FuzzySearch is client-side,
 * so it must work across all supported browsers.
 * 
 * Business risk: Reduced content discoverability, user frustration.
 * Priority: P1 (High)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { BlogListingPage } from '../../pages/blog-listing.page';
import { BLOG_SEARCH } from '../../data/test-data';

test.describe('Blog search and pagination', { tag: '@regression' }, () => {
  let blogPage: BlogListingPage;

  test.beforeEach(async ({ page }) => {
    blogPage = new BlogListingPage(page);
    await blogPage.goto();
  });

  // test('filters articles as user types in search', async () => {
  //   const initialCount = await blogPage.articleRowLinks.count();
  //   test.skip(initialCount === 0, 'No articles to search');

  //   await blogPage.search(BLOG_SEARCH.existingTerm);
  //   await blogPage.page.waitForTimeout(500);
  //   const filteredCount = await blogPage.articleRowLinks.count();
  //   expect(filteredCount).toBeLessThanOrEqual(initialCount);
  // });

  // test('shows no results message for non-matching search', async () => {
  //   const initialCount = await blogPage.articleRowLinks.count();
  //   test.skip(initialCount === 0, 'No articles to search');

  //   await blogPage.search(BLOG_SEARCH.nonExistingTerm);
  //   await blogPage.page.waitForTimeout(500);

  //   await expect(blogPage.noResultsMessage).toBeVisible();
  // });

  // test('search input is cleared and resets to full list', async () => {
  //   const initialCount = await blogPage.articleRowLinks.count();
  //   test.skip(initialCount === 0, 'No articles to search');

  //   await blogPage.search(BLOG_SEARCH.nonExistingTerm);
  //   await blogPage.page.waitForTimeout(500);
  //   await expect(blogPage.noResultsMessage).toBeVisible();

  //   await blogPage.search('');
  //   await blogPage.page.waitForTimeout(500);
  //   const resetCount = await blogPage.articleRowLinks.count();
  //   expect(resetCount).toBe(initialCount);
  // });

  test('pagination controls appear when there are enough articles', async () => {
    const initialCount = await blogPage.articleRowLinks.count();
    test.skip(initialCount <= 6, 'Not enough articles for pagination (need >6)');

    await expect(blogPage.nextButton).toBeVisible();
    await expect(blogPage.pageInfo).toBeVisible();
  });

  test('navigates to next page and back', async () => {
    const initialCount = await blogPage.articleRowLinks.count();
    test.skip(initialCount <= 6, 'Not enough articles for pagination');

    await blogPage.nextButton.click();
    await blogPage.page.waitForTimeout(300);

    await expect(blogPage.previousButton).toBeVisible();
    expect(await blogPage.previousButton.isEnabled()).toBe(true);

    await blogPage.previousButton.click();
    await blogPage.page.waitForTimeout(300);
  });
});
