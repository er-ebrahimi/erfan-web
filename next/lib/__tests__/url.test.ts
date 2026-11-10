import { describe, expect, it } from 'vitest';

import { localizeHref } from '../url';

describe('localizeHref', () => {
  it('prefixes relative paths with the locale', () => {
    expect(localizeHref('contact', 'fa')).toBe('/fa/contact');
    expect(localizeHref('/contact', 'fa')).toBe('/fa/contact');
  });

  it('keeps absolute and protocol links untouched', () => {
    expect(localizeHref('https://example.com', 'fa')).toBe(
      'https://example.com'
    );
    expect(localizeHref('mailto:hi@example.com', 'fa')).toBe(
      'mailto:hi@example.com'
    );
    expect(localizeHref('tel:+98912', 'fa')).toBe('tel:+98912');
  });

  it('keeps in-page anchors on the current page', () => {
    expect(localizeHref('#how-it-works', 'fa')).toBe('#how-it-works');
  });

  it('falls back to the locale root for an empty URL', () => {
    expect(localizeHref(null, 'fa')).toBe('/fa');
  });
});
