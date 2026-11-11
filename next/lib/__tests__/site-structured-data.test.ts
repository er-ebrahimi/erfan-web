import { describe, expect, it } from 'vitest';

import {
  buildOrganizationSchema,
  buildSiteStructuredData,
  buildWebSiteSchema,
  siteStructuredDataJsonLd,
} from '../shared/site-structured-data';

const IDENTITY = {
  siteName: 'Test Site',
  siteDescription: 'Test site description',
};

describe('site-structured-data', () => {
  it('builds an Organization schema with required identity fields', () => {
    const schema = buildOrganizationSchema(IDENTITY);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe(IDENTITY.siteName);
    expect(schema.url).toBeTruthy();
    expect(schema.description).toBe(IDENTITY.siteDescription);
  });

  it('builds a WebSite schema with url and language', () => {
    const schema = buildWebSiteSchema(IDENTITY);
    expect(schema['@type']).toBe('WebSite');
    expect(schema.url).toBeTruthy();
    expect(schema.name).toBe(IDENTITY.siteName);
    expect(schema.inLanguage).toBe('fa');
  });

  it('site structured data contains both Organization and WebSite', () => {
    const data = buildSiteStructuredData(IDENTITY);
    const types = data.map((node) => node['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
  });

  it('serializes JSON-LD without unescaped < characters', () => {
    const json = siteStructuredDataJsonLd(IDENTITY);
    expect(json).toContain('"@context":"https://schema.org"');
    expect(json).not.toMatch(/<(?!!)/);
  });

  it('is valid JSON', () => {
    const parsed = JSON.parse(siteStructuredDataJsonLd(IDENTITY));
    expect(Array.isArray(parsed)).toBe(true);
  });
});
