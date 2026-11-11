const FRONT_URL = process.env.FRONT_URL;

if (!FRONT_URL) {
  throw new Error(
    'FRONT_URL is required. Set it in next/.env.local for builds and in the container environment for runtime (see next/deploy/docker-compose.prod.yml).'
  );
}

export const SITE_URL = FRONT_URL.replace(/\/+$/, '');
