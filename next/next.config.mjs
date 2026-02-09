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
    process.env.IMAGE_HOSTNAME
  ],
  images: {
    remotePatterns: [
      { hostname: (process.env.IMAGE_HOSTNAME || 'localhost').split(':')[0] },
      { hostname: '127.0.0.1' },
      { hostname: 'localhost' },
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
