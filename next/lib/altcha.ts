import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { CappedMap, create, randomInt } from 'altcha-lib/frameworks/nextjs';

const HMAC_SECRET = process.env.ALTCHA_HMAC_SECRET || '';

const store = new CappedMap<string, boolean>({ maxSize: 1_000 });

export const altcha = create({
  hmacSignatureSecret: HMAC_SECRET,
  createChallengeParameters: () => ({
    algorithm: 'PBKDF2/SHA-256' as const,
    cost: 5_000,
    counter: randomInt(5_000, 10_000),
    expiresAt: new Date(Date.now() + 600_000),
  }),
  deriveKey,
  store,
});

export async function verifyAltchaPayload(payload: string) {
  return altcha.verify(payload, deriveKey, HMAC_SECRET, undefined, store);
}
