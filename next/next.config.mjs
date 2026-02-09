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
    process.env.DOMAIN
  ],
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: process.env.DOMAIN,
      port: process.env.BACK_PORT,
      pathname: '/uploads/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
    },
    {
      protocol: 'http',
      hostname: '127.0.0.1',
    },
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
