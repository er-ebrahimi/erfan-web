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

// Legacy category URLs that moved from /category/<parent>/<slug> to the flat
// /category/<slug>. Kept static (not Strapi-driven) so the 301s still fire when
// the CMS is unreachable. Keys are locale-less; they are prefixed with the
// locale segment below, matching the Strapi-driven redirects.
const legacyCategoryRedirects: Record<string, string> = {
  '/category/build-cabinet/shargh-pirozi': '/category/cabinet-pirozi',
  '/category/build-cabinet/shargh-Tehranpars': '/category/cabinet-Tehranpars',
  '/category/build-cabinet/gharb-tehransar': '/category/cabinet-tehransar',
  '/category/build-cabinet/gharb-ganatabad': '/category/cabinet-ganatabad',
  '/category/build-cabinet/gharb-ferdos': '/category/cabinet-ferdos',
  '/category/build-cabinet/gharb-shahrara': '/category/cabinet-shahrara',
  '/category/build-cabinet/shargh-afsariee': '/category/cabinet-afsariee',
  '/category/build-cabinet/tehran-niyavaran': '/category/cabinet-niyavaran',
  '/category/build-cabinet/tehran-elahiyeh': '/category/cabinet-elahiyeh',
  '/category/build-cabinet/gharb-satarkhan': '/category/cabinet-satarkhan',
  '/category/build-cabinet/gharb-ponak': '/category/cabinet-ponak',
  '/category/build-cabinet/gharb-chitgar': '/category/cabint-chitgar',
  '/category/build-cabinet/gharb-saadatabad': '/category/cabinet-saadatabad',
  '/category/build-cabinet/tehran-gharb': '/category/tehran-gharb',
  '/category/build-cabinet/build-closet': '/category/build-closet',
  '/category/build-cabinet-shargh': '/category/cabinet-shargh',
  '/category/interior-design/beauty-salon': '/category/beauty-salon',
  '/category/interior-design/design-house': '/category/design-house',
  '/category/interior-design/apartment': '/category/design-apartment',
  '/category/interior-design/kitchen-design': '/category/kitchen-design',
  '/category/interior-design/bedroom-design': '/category/bedroom-design',
  '/category/interior-design/hall-design': '/category/hall-design',
  '/category/interior-design/office': '/category/design-office',
  '/build-cabinet/gharb-ferdos': '/category/cabinet-ferdos',
};

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
    // Emit each legacy redirect twice - with and without a trailing slash - so
    // a request resolves in a single hop regardless of the URL form.
    const staticRedirectItems = Object.entries(legacyCategoryRedirects).flatMap(
      ([source, destination]) => [
        {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: true,
        },
        {
          source: `/:locale${source}/`,
          destination: `/:locale${destination}`,
          permanent: true,
        },
      ]
    );

    try {
      const rawApiUrl =
        process.env.STRAPI_INTERNAL_URL || env.NEXT_PUBLIC_API_URL;
      if (!rawApiUrl) {
        return staticRedirectItems;
      }

      const apiUrl = rawApiUrl.replace(/\/+$/, '');
      const res = await fetch(`${apiUrl}/api/redirections?populate=*`);
      if (!res.ok) {
        return staticRedirectItems;
      }

      const result = await res.json();
      if (!result?.data) {
        return staticRedirectItems;
      }

      const redirectItems = result.data.map(
        ({ source, destination }: { source: string; destination: string }) => ({
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: true,
        })
      );

      return staticRedirectItems.concat(redirectItems);
    } catch (error) {
      console.error(
        'Failed to fetch redirects from Strapi:',
        error instanceof Error ? error.message : error
      );
      return staticRedirectItems;
    }
  },
};

export default withNextIntl(nextConfig);
