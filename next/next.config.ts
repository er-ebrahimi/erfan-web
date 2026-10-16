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

/**
 * Legacy category URLs from the old nested `/{locale}/category/{parent}/{slug}`
 * structure, mapped to the current flat `/{locale}/category/{slug}` routes.
 * Each source is registered with and without a trailing slash so old inbound
 * links resolve in a single hop regardless of how they were indexed.
 */
const legacyCategoryRedirects: ReadonlyArray<readonly [string, string]> = [
  ['/fa/category/build-cabinet/shargh-pirozi', '/fa/category/cabinet-pirozi'],
  [
    '/fa/category/build-cabinet/shargh-Tehranpars',
    '/fa/category/cabinet-Tehranpars',
  ],
  [
    '/fa/category/build-cabinet/gharb-tehransar',
    '/fa/category/cabinet-tehransar',
  ],
  [
    '/fa/category/build-cabinet/gharb-ganatabad',
    '/fa/category/cabinet-ganatabad',
  ],
  ['/fa/category/build-cabinet/gharb-ferdos', '/fa/category/cabinet-ferdos'],
  [
    '/fa/category/build-cabinet/gharb-shahrara',
    '/fa/category/cabinet-shahrara',
  ],
  [
    '/fa/category/build-cabinet/shargh-afsariee',
    '/fa/category/cabinet-afsariee',
  ],
  [
    '/fa/category/build-cabinet/tehran-niyavaran',
    '/fa/category/cabinet-niyavaran',
  ],
  [
    '/fa/category/build-cabinet/tehran-elahiyeh',
    '/fa/category/cabinet-elahiyeh',
  ],
  [
    '/fa/category/build-cabinet/gharb-satarkhan',
    '/fa/category/cabinet-satarkhan',
  ],
  ['/fa/category/build-cabinet/gharb-ponak', '/fa/category/cabinet-ponak'],
  ['/fa/category/build-cabinet/gharb-chitgar', '/fa/category/cabint-chitgar'],
  [
    '/fa/category/build-cabinet/gharb-saadatabad',
    '/fa/category/cabinet-saadatabad',
  ],
  ['/fa/category/build-cabinet/tehran-gharb', '/fa/category/tehran-gharb'],
  ['/fa/category/build-cabinet/build-closet', '/fa/category/build-closet'],
  ['/fa/category/build-cabinet-shargh', '/fa/category/cabinet-shargh'],
  ['/fa/category/interior-design/beauty-salon', '/fa/category/beauty-salon'],
  ['/fa/category/interior-design/design-house', '/fa/category/design-house'],
  ['/fa/category/interior-design/apartment', '/fa/category/design-apartment'],
  [
    '/fa/category/interior-design/kitchen-design',
    '/fa/category/kitchen-design',
  ],
  [
    '/fa/category/interior-design/bedroom-design',
    '/fa/category/bedroom-design',
  ],
  ['/fa/category/interior-design/hall-design', '/fa/category/hall-design'],
  ['/fa/category/interior-design/office', '/fa/category/design-office'],
  ['/fa/build-cabinet/gharb-ferdos', '/fa/category/cabinet-ferdos'],
];

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
    // Static 301s for legacy nested category URLs. These are always present so
    // they survive a Strapi outage during build.
    const staticRedirects = legacyCategoryRedirects.flatMap(
      ([source, destination]) => [
        { source, destination, statusCode: 301 },
        { source: `${source}/`, destination, statusCode: 301 },
      ]
    );

    // `statusCode: 301` for the new static redirects, `permanent: true`
    // (served as 308) for the Strapi-managed ones.
    let redirections: (
      | { source: string; destination: string; statusCode: number }
      | { source: string; destination: string; permanent: boolean }
    )[] = [...staticRedirects];
    try {
      const rawApiUrl =
        process.env.STRAPI_INTERNAL_URL || env.NEXT_PUBLIC_API_URL;
      if (!rawApiUrl) {
        return redirections;
      }

      const apiUrl = rawApiUrl.replace(/\/+$/, '');
      const res = await fetch(`${apiUrl}/api/redirections?populate=*`);
      if (!res.ok) {
        return redirections;
      }

      const result = await res.json();
      if (!result?.data) {
        return redirections;
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
      return redirections;
    }
  },
};

export default withNextIntl(nextConfig);
