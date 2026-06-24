/**
 * API Test: Contact Form Endpoint
 * 
 * Why: Validates the contact API contract independently of the UI.
 * Tests validation logic, error responses, and payload structure.
 * 
 * Business risk: Broken API means all form submissions fail silently.
 * Priority: P1 (High)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const CONTACT_API = '/api/contact';

test.describe('Contact API', { tag: '@api' }, () => {
  test('returns 400 when required fields are missing', async ({ request }) => {
    const response = await request.post(CONTACT_API, {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('returns 400 with only contact field', async ({ request }) => {
    const response = await request.post(CONTACT_API, {
      data: { contact: 'test@example.com' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('returns 400 with only message field', async ({ request }) => {
    const response = await request.post(CONTACT_API, {
      data: { message: 'Hello' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('returns 400 with missing altcha payload', async ({ request }) => {
    const response = await request.post(CONTACT_API, {
      data: {
        contact: 'test@example.com',
        message: 'Test message',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('returns structured error response with Farsi message', async ({ request }) => {
    const response = await request.post(CONTACT_API, {
      data: {
        contact: '',
        message: '',
        altcha: '',
        locale: 'fa',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('success', false);
    expect(body).toHaveProperty('message');
    expect(typeof body.message).toBe('string');
    expect(body.message.length).toBeGreaterThan(0);
  });
});
