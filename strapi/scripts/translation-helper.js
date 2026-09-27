const fs = require('fs');
const path = require('path');

/**
 * Translation Helper Script for Strapi v5
 * This script helps identify content that needs translation from English to Persian
 */

// Content types that have i18n enabled
const contentTypes = [
  'page',
  'article',
  'faq',
  'product',
  'product-page',
  'blog-page',
  'category',
  'plan',
  'testimonial',
  'global',
];

// Dynamic zone components that need translation
const dynamicZoneComponents = [
  'dynamic-zone.hero',
  'dynamic-zone.features',
  'dynamic-zone.testimonials',
  'dynamic-zone.how-it-works',
  'dynamic-zone.brands',
  'dynamic-zone.pricing',
  'dynamic-zone.launches',
  'dynamic-zone.cta',
  'dynamic-zone.form-next-to-section',
  'dynamic-zone.faq',
  'dynamic-zone.guide',
  'dynamic-zone.related-articles',
  'dynamic-zone.related-products',
  'dynamic-zone.ask-hero',
  'dynamic-zone.ai-gateway',
];

console.log(' Strapi Translation Helper');
console.log('============================\n');

console.log(' Content Types with i18n enabled:');
contentTypes.forEach((type) => {
  console.log(`   ${type}`);
});

console.log('\n Dynamic Zone Components:');
dynamicZoneComponents.forEach((component) => {
  console.log(`   ${component}`);
});

console.log('\n Translation Steps:');
console.log('1. Start your Strapi server: npm run develop');
console.log('2. Go to your Strapi admin panel');
console.log('3. Navigate to Settings > Internationalization');
console.log('4. Add Persian (fa) as a new locale');
console.log('5. For each content type:');
console.log('   - Go to Content Manager');
console.log('   - Select your content type');
console.log('   - Click on an existing English entry');
console.log('   - Use the locale switcher to create Persian version');
console.log('   - Translate all localized fields');

console.log('\n API Usage for Translation:');
console.log('To fetch content in specific locale, use:');
console.log('GET /api/{content-type}?locale=fa');
console.log('GET /api/{content-type}?locale=en');

console.log('\n Fields that need translation:');
console.log('- All string fields with i18n: { localized: true }');
console.log('- All text fields with i18n: { localized: true }');
console.log('- All rich text (blocks) fields');
console.log('- SEO components (title, description, keywords)');
console.log('- Dynamic zone content');

console.log('\n Tips:');
console.log(
  '- Use a translation service or native speaker for accurate translations'
);
console.log('- Test your Persian content in the frontend');
console.log('- Consider RTL (Right-to-Left) layout for Persian text');
console.log('- Update your frontend to handle locale switching');

console.log(
  '\n Ready to translate! Start with your most important content first.'
);
