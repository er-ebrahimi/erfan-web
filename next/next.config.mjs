import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    process.env.NEXT_PUBLIC_API_URL,
    process.env.IMAGE_HOSTNAME,
    process.env.DOMAIN,

  ],
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1248, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.DOMAIN,
        port: process.env.BACK_PORT,
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'studioarman.com',
        port: '2087',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'studioarman.site',
        port: '2087',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi.studioarman.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'strapi.studioarman.com',
        pathname: '/uploads/**',
      },
      {
        protocol: "https",
        hostname: 'trustseal.enamad.ir'
      }
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path((?:favicon\\.ico|robots\\.txt|sitemap\\.xml))',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    let redirections = [];
    try {
      const apiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${apiUrl}/api/redirections`
      );
      const result = await res.json();
      if (!result?.data) {
        return [];
      }
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: true,
        };
      });

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
