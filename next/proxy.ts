import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const SITE_URL = (process.env.FRONT_URL || 'https://studioarman.com').replace(
  /\/$/,
  ''
);

function notFoundResponse(request: NextRequest): NextResponse {
  const accept = request.headers.get('accept') || '';
  const wantsMarkdown = accept.includes('text/markdown');

  const body = wantsMarkdown
    ? `# 404 - Not Found

The requested page does not exist.

## Useful resources for agents

- Sitemap: ${SITE_URL}/sitemap.xml
- LLMs.txt: ${SITE_URL}/llms.txt
`
    : '404 - Not Found. See /llms.txt or /sitemap.xml for a map of this site.';

  return new NextResponse(body, {
    status: 404,
    headers: {
      'Content-Type': wantsMarkdown
        ? 'text/markdown; charset=utf-8'
        : 'text/plain; charset=utf-8',
      Vary: 'Accept, Accept-Encoding',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    request.nextUrl.pathname = `/${routing.defaultLocale}`;
    return NextResponse.rewrite(request.nextUrl);
  }

  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocalePrefix) {
    return notFoundResponse(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon-sets|[^/]+/favicon-sets|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|webp|jpg|jpeg|gif|ico|ttf|woff2?|mp4|webm)$).*)',
  ],
};
