import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { JsonLd } from '../json-ld';

vi.mock('next/script', () => ({
  default: function MockScript({ id, type, dangerouslySetInnerHTML }: any) {
    return React.createElement('script', { id, type, dangerouslySetInnerHTML });
  },
}));

const validStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Test Page',
};

const seoWithData = {
  metaTitle: 'Test',
  metaDescription: 'Test description',
  structuredData: validStructuredData,
};

const seoWithoutStructuredData = {
  metaTitle: 'Test',
  metaDescription: 'Test description',
};

describe('JsonLd', () => {
  it('renders script tag when seo has structuredData', () => {
    render(React.createElement(JsonLd, { seo: seoWithData }));

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    expect(script?.getAttribute('id')).toBe('structured-data');

    const content = JSON.parse(script?.innerHTML || '{}');
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('WebPage');
  });

  it('renders nothing when seo is null', () => {
    const { container } = render(React.createElement(JsonLd, { seo: null }));
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts.length).toBe(0);
  });

  it('renders nothing when seo has no structuredData', () => {
    const { container } = render(
      React.createElement(JsonLd, { seo: seoWithoutStructuredData })
    );
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts.length).toBe(0);
  });

  it('uses custom id prop', () => {
    render(
      React.createElement(JsonLd, {
        seo: seoWithData,
        id: 'global-structured-data',
      })
    );

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script?.getAttribute('id')).toBe('global-structured-data');
  });

  it('defaults id to "structured-data"', () => {
    render(React.createElement(JsonLd, { seo: seoWithData }));

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script?.getAttribute('id')).toBe('structured-data');
  });

  it('escapes < characters in JSON output', () => {
    const dataWithHtml = {
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description: '<script>alert("xss")</script>',
      },
    };

    render(React.createElement(JsonLd, { seo: dataWithHtml }));

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    expect(script?.innerHTML).toContain('\\u003c');
    expect(script?.innerHTML).not.toContain('<script>');
  });
});
