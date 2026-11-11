export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  if (!process.env.FRONT_URL) {
    throw new Error(
      'FRONT_URL is required at runtime. Set it in the container environment (see next/deploy/docker-compose.prod.yml).'
    );
  }
}
