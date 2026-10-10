import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { validateEnv } from './env/validate';

const env = validateEnv();

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const remotePatterns = [
  ...(env.DOMAIN
    ? [
        {
          protocol: 'https' as const,
          hostname: env.DOMAIN,
          pathname: '/uploads/**',
        },
      ]
    : []),
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
    protocol: 'https' as const,
    hostname: 'studioarman.site',
    port: '2087',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: 'localhost',
    port: '8080',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: '127.0.0.1',
    port: '1337',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: '127.0.0.1',
    port: '8080',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: 'host.docker.internal',
    port: '8080',
    pathname: '/uploads/**',
  },
  {
    protocol: 'https' as const,
    hostname: 'strapi.studioarman.com',
    pathname: '/uploads/**',
  },
  {
    protocol: 'https' as const,
    hostname: 'strapi.painfoolsstudio.com',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http' as const,
    hostname: 'strapi.studioarman.com',
    pathname: '/uploads/**',
  },
  {
    protocol: 'https' as const,
    hostname: 'trustseal.enamad.ir',
  },
] satisfies NonNullable<NextConfig['images']>['remotePatterns'];

const nextConfig: NextConfig = {
  trailingSlash: false,
  compress: true,
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
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
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1248, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns,
  },
  pageExtensions: ['ts', 'tsx'],
  async headers() {
    return [
      {
        source: '/favicon-sets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:siteId/favicon-sets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path((?:robots\\.txt|sitemap\\.xml|llms\\.txt))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    let redirections: {
      source: string;
      destination: string;
      permanent: boolean;
    }[] = [];
    try {
      const rawApiUrl =
        process.env.STRAPI_INTERNAL_URL || env.NEXT_PUBLIC_API_URL;
      if (!rawApiUrl) {
        return [];
      }

      const apiUrl = rawApiUrl.replace(/\/+$/, '');
      const res = await fetch(`${apiUrl}/api/redirections?populate=*`);
      if (!res.ok) {
        return [];
      }

      const result = await res.json();
      if (!result?.data) {
        return [];
      }

      const redirectItems = result.data.map(
        ({ source, destination }: { source: string; destination: string }) => ({
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: true,
        })
      );

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      console.error(
        'Failed to fetch redirects from Strapi:',
        error instanceof Error ? error.message : error
      );
      return [];
    }
  },
};

export default withNextIntl(nextConfig);
