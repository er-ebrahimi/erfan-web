import { afterEach, describe, expect, it, vi } from 'vitest';

import { validateEnv } from '@/env/validate';

describe('validateEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('fails when FRONT_URL is missing', () => {
    vi.stubEnv('FRONT_URL', '');
    expect(() => validateEnv()).toThrow(/FRONT_URL/);
  });

  it('fails when FRONT_URL has no protocol', () => {
    vi.stubEnv('FRONT_URL', 'example.com');
    expect(() => validateEnv()).toThrow(/FRONT_URL/);
  });

  it('accepts a valid FRONT_URL', () => {
    vi.stubEnv('FRONT_URL', 'https://example.com');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://strapi.example.com');
    expect(validateEnv().FRONT_URL).toBe('https://example.com');
  });
});
