import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, locales } from '@/config';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/shared/site-metadata';
import { SITE_URL } from '@/lib/shared/site-url';
import fetchContentType from '@/lib/strapi/fetchContentType';

export const dynamic = 'force-dynamic';

function buildMarkdown(siteName: string, siteDescription: string) {
  return `# ${siteName}

${siteDescription}

## About

${siteName} is served as server-rendered HTML, so all content is available
without JavaScript.

## Key resources

- Sitemap: ${SITE_URL}/sitemap.xml
- Homepage: ${SITE_URL}/${defaultLocale}
- Blog index: ${SITE_URL}/${defaultLocale}/category/blog

## Supported locales

${locales.map((locale) => `- ${locale}: ${SITE_URL}/${locale}`).join('\n')}
`;
}

export async function GET(request: NextRequest) {
  const global = await fetchContentType('global', {}, true);
  const siteName = global?.siteName || SITE_NAME;
  const siteDescription = global?.siteDescription || SITE_DESCRIPTION;

  const accept = request.headers.get('accept') || '';
  const wantsMarkdown = /(?:^|,)\s*text\/markdown(?:;|,|$)/i.test(accept);

  const headers: Record<string, string> = {
    Vary: 'Accept, Accept-Encoding',
    'Cache-Control': 'public, max-age=3600',
    'Content-Type': wantsMarkdown
      ? 'text/markdown; charset=utf-8'
      : 'text/plain; charset=utf-8',
  };

  return new NextResponse(buildMarkdown(siteName, siteDescription), {
    status: 200,
    headers,
  });
}
