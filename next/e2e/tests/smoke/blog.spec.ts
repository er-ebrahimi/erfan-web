/**
 * Smoke Test: Blog Listing & Article Detail
 * 
 * Why: Blog content is the primary way users consume information.
 * If the blog or individual articles fail, content marketing efforts are wasted.
 * 
 * Business risk: Lost organic traffic, reduced SEO authority, user frustration.
 * Priority: P0 (Critical)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { BlogListingPage } from '../../pages/blog-listing.page';
import { ArticlePage } from '../../pages/article.page';
import { collectPageErrors } from '../../utils/helpers';

test.describe('Blog', { tag: '@smoke' }, () => {
  let blogPage: BlogListingPage;

  test.beforeEach(async ({ page }) => {
    blogPage = new BlogListingPage(page);
    await blogPage.goto();
  });

  test('loads with blog heading', async () => {
    await expect(blogPage.heading).toBeVisible();
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const { errors, stop } = collectPageErrors(page);
    await page.waitForTimeout(500);
    stop();
    expect(errors).toHaveLength(0);
  });

  test('has search input', async () => {
    await expect(blogPage.searchInput).toBeVisible();
  });

  test('displays articles when available', async () => {
    const articleCount = await blogPage.articleRowLinks.count();
    if (articleCount > 0) {
      await expect(blogPage.articleRowLinks.first()).toBeVisible();
    }
  });

  test('clicking an article navigates to article detail', async ({ page }) => {
    const articleCount = await blogPage.articleRowLinks.count();
    test.skip(articleCount === 0, 'No articles available to click');

    const firstArticle = blogPage.articleRowLinks.first();
    await firstArticle.click();
    await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});

    const articleDetail = new ArticlePage(page);
    await expect(articleDetail.title).toBeVisible();
    await expect(articleDetail.articleElement).toBeVisible();
  });

  test('article detail has back link, categories, and published date', async ({ page }) => {
    const articleCount = await blogPage.articleRowLinks.count();
    test.skip(articleCount === 0, 'No articles available');

    await blogPage.clickFirstArticle();
    const articleDetail = new ArticlePage(page);

    await expect(articleDetail.backLink).toBeVisible();

    const categoryCount = await articleDetail.categories.count();
    if (categoryCount > 0) {
      await expect(articleDetail.categories.first()).toBeVisible();
    }

    await expect(articleDetail.publishedDate).toBeVisible();
  });
});
