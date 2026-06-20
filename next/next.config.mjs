import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      protocol: "https",
      hostname: 'trustseal.enamad.ir'
    },
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    // Single-product studio site: the generic template homepage is unused, so
    // the site root and the bare locale root land on the AI Solutions page.
    const baseRedirects = [
      { source: '/', destination: '/fa/ai-solutions', permanent: false },
      { source: '/fa', destination: '/fa/ai-solutions', permanent: false },
      // The hero's "view our work" CTA targets /projects (no such page); send it
      // to the case-studies section on the AI Solutions page instead.
      { source: '/:locale/projects', destination: '/:locale/ai-solutions#case-studies', permanent: false },
    ];
    try {
      const apiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${apiUrl}/api/redirections`
      );
      const result = await res.json();
      if (!result?.data) {
        return baseRedirects;
      }
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      return baseRedirects.concat(redirectItems);
    } catch (error) {
      console.error(
        'Failed to fetch redirects from Strapi:',
        error instanceof Error ? error.message : error
      );
      return baseRedirects;
    }
  },
};

export default withNextIntl(nextConfig);
