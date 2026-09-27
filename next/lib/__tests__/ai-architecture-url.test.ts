import { afterEach, describe, expect, it } from 'vitest';

import {
  buildAiArchitectureUrl,
  getAiArchitectureBaseUrl,
  resolveAiProductHref,
} from '../ai-architecture-url';

describe('ai-architecture-url', () => {
  const original = process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL;
    } else {
      process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL = original;
    }
  });

  it('defaults base URL when env is unset', () => {
    delete process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL;
    expect(getAiArchitectureBaseUrl()).toBe('http://localhost:3001');
  });

  it('strips trailing slash from env base URL', () => {
    process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL = 'https://ai.example.com/';
    expect(getAiArchitectureBaseUrl()).toBe('https://ai.example.com');
  });

  it('appends encoded prompt query param', () => {
    process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL = 'https://ai.example.com';
    expect(
      buildAiArchitectureUrl({ prompt: 'آشپزخانه مدرن' })
    ).toBe('https://ai.example.com?prompt=%D8%A2%D8%B4%D9%BE%D8%B2%D8%AE%D8%A7%D9%86%D9%87%20%D9%85%D8%AF%D8%B1%D9%86');
  });

  it('joins relative paths under the AI base', () => {
    process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL = 'https://ai.example.com';
    expect(buildAiArchitectureUrl({ path: '/chat' })).toBe(
      'https://ai.example.com/chat'
    );
  });

  it('passes through absolute URLs in resolveAiProductHref', () => {
    expect(resolveAiProductHref('https://other.test/q')).toBe(
      'https://other.test/q'
    );
  });
});
