import { describe, expect, it } from 'vitest';

import {
  buildOrganizationSchema,
  buildSiteStructuredData,
  buildWebSiteSchema,
  siteStructuredDataJsonLd,
} from '../shared/site-structured-data';

describe('site-structured-data', () => {
  it('builds an Organization schema with required identity fields', () => {
    const schema = buildOrganizationSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBeTruthy();
    expect(schema.url).toBeTruthy();
    expect(schema.description).toBeTruthy();
  });

  it('builds a WebSite schema with url and language', () => {
    const schema = buildWebSiteSchema();
    expect(schema['@type']).toBe('WebSite');
    expect(schema.url).toBeTruthy();
    expect(schema.inLanguage).toBe('fa');
  });

  it('site structured data contains both Organization and WebSite', () => {
    const data = buildSiteStructuredData();
    const types = data.map((node) => node['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
  });

  it('serializes JSON-LD without unescaped < characters', () => {
    const json = siteStructuredDataJsonLd();
    expect(json).toContain('"@context":"https://schema.org"');
    expect(json).not.toMatch(/<(?!!)/);
  });

  it('is valid JSON', () => {
    const parsed = JSON.parse(siteStructuredDataJsonLd());
    expect(Array.isArray(parsed)).toBe(true);
  });
});
