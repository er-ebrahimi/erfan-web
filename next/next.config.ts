import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { validateEnv } from './env/validate';

const env = validateEnv();

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const remotePatterns = [
  ...(env.DOMAIN && env.BACK_PORT
    ? [
        {
          protocol: 'https' as const,
          hostname: env.DOMAIN,
          port: env.BACK_PORT,
          pathname: '/uploads/**',
        },
      ]
    : []),
  {
    protocol: 'https' as const,
    hostname: 'studioarman.com',
    port: '2087',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: 'localhost',
    port: '1337',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: '127.0.0.1',
    port: '1337',
    pathname: '/uploads/**',
  },
  {
    protocol: 'https' as const,
    hostname: 'trustseal.enamad.ir',
  },
] satisfies NonNullable<NextConfig['images']>['remotePatterns'];

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: process.cwd().replace('/next', ''),
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    env.NEXT_PUBLIC_API_URL,
    env.IMAGE_HOSTNAME,
    env.DOMAIN,
    env.BACKEND_URL,
  ].filter((origin): origin is string => Boolean(origin)),
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns,
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    let redirections: {
      source: string;
      destination: string;
      permanent: boolean;
    }[] = [];
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/redirections`);
      const result = await res.json();
      const redirectItems = result.data.map(
        ({ source, destination }: { source: string; destination: string }) => ({
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        })
      );

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch {
      return [];
    }
  },
};

export default withNextIntl(nextConfig);
