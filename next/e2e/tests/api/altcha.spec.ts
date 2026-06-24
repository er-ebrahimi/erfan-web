/**
 * API Test: ALTCHA Challenge Endpoint
 * 
 * Why: ALTCHA protects the contact form from spam bots.
 * If the challenge endpoint is broken, the contact form becomes
 * unusable or vulnerable to spam.
 * 
 * Business risk: Form spam or broken contact functionality.
 * Priority: P1 (High)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const ALTCHA_CHALLENGE_URL = '/api/altcha/challenge';

test.describe('ALTCHA challenge endpoint', { tag: '@api' }, () => {
  test('returns a valid challenge structure', async ({ request }) => {
    const response = await request.get(ALTCHA_CHALLENGE_URL, {
      headers: { Accept: 'application/json' },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('parameters');
    expect(body.parameters).toHaveProperty('algorithm', 'PBKDF2/SHA-256');
    expect(body.parameters).toHaveProperty('nonce');
    expect(body.parameters).toHaveProperty('salt');
    expect(body.parameters).toHaveProperty('expiresAt');

    expect(typeof body.parameters.nonce).toBe('string');
    expect(body.parameters.nonce.length).toBeGreaterThan(0);
    expect(typeof body.parameters.salt).toBe('string');
    expect(body.parameters.salt.length).toBeGreaterThan(0);

    // signature is top-level when ALTCHA_HMAC_SECRET is configured
    if (body.signature) {
      expect(typeof body.signature).toBe('string');
      expect(body.signature.length).toBeGreaterThan(0);
    }
  });

  test('challenge changes on subsequent requests', async ({ request }) => {
    const first = await (await request.get(ALTCHA_CHALLENGE_URL)).json();
    const second = await (await request.get(ALTCHA_CHALLENGE_URL)).json();

    expect(first.parameters.nonce).not.toBe(second.parameters.nonce);
    expect(first.parameters.salt).not.toBe(second.parameters.salt);
    if (first.signature && second.signature) {
      expect(first.signature).not.toBe(second.signature);
    }
  });

  test('responds within acceptable time', async ({ request }) => {
    const start = Date.now();
    await request.get(ALTCHA_CHALLENGE_URL);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });
});
