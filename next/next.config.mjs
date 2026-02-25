import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: process.cwd().replace('/next', ''),
  },
   allowedDevOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_API_URL,
    process.env.IMAGE_HOSTNAME,
    process.env.DOMAIN,
    process.env.BACKEND_URL
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
      protocol: 'http',
      hostname: 'localhost',
      port: '1337',
      pathname: '/uploads/**',
    },
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '1337',
      pathname: '/uploads/**',
    },
    {
      protocol: "https",
      hostname: 'trustseal.enamad.ir'
    }
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    let redirections = [];
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/redirections`
      );
      const result = await res.json();
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      return [];
    }
  },
};

export default withNextIntl(nextConfig);
