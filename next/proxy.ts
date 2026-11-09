import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { routing } from './i18n/routing';
import { notFoundMarkdown } from '@/lib/not-found-markdown';

const intlMiddleware = createMiddleware(routing);

function markdownNotFoundResponse(): NextResponse {
  return new NextResponse(notFoundMarkdown(), {
    status: 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
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
    if ((request.headers.get('accept') || '').includes('text/markdown')) {
      return markdownNotFoundResponse();
    }
    // Internal prefix guarantees the rewrite matches no real route and renders
    // the server-side 404; the browser URL stays unchanged.
    request.nextUrl.pathname = `/${routing.defaultLocale}/_404${pathname}`;
    return NextResponse.rewrite(request.nextUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon-sets|[^/]+/favicon-sets|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|webp|jpg|jpeg|gif|ico|ttf|woff2?|mp4|webm)$).*)',
  ],
};
