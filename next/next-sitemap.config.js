/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.DOMAIN || 'https://example.com';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 50000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/sign-in', '/sign-up', '/dashboard/*'],
};
