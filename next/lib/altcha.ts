import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { CappedMap, create, randomInt } from 'altcha-lib/frameworks/nextjs';

const store = new CappedMap<string, boolean>({ maxSize: 1_000 });

function getSecret(): string {
  const secret = process.env.ALTCHA_HMAC_SECRET;

  if (!secret) {
    throw new Error(
      'ALTCHA_HMAC_SECRET is required. Set it in the container environment (see next/deploy/docker-compose.prod.yml).'
    );
  }

  return secret;
}

let instance: ReturnType<typeof create> | null = null;

function getAltcha() {
  if (!instance) {
    instance = create({
      hmacSignatureSecret: getSecret(),
      createChallengeParameters: () => ({
        algorithm: 'PBKDF2/SHA-256' as const,
        cost: 5_000,
        counter: randomInt(5_000, 10_000),
        expiresAt: new Date(Date.now() + 600_000),
      }),
      deriveKey,
      store,
    });
  }

  return instance;
}

export async function verifyAltchaPayload(payload: string) {
  return getAltcha().verify(payload, deriveKey, getSecret(), undefined, store);
}

export async function altchaChallenge(request: Request) {
  return getAltcha().challengeHandler(request);
}
