import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, locales } from '@/config';

const SITE_URL = (process.env.FRONT_URL || 'https://studioarman.com').replace(
  /\/$/,
  ''
);
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Studio Arman';
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Studio Arman — portfolio and blog of Erfan, a web developer and designer.';

const MARKDOWN = `# ${SITE_NAME}

${SITE_DESCRIPTION}

## About

${SITE_NAME} is the personal portfolio and blog of Erfan, a web developer and
designer. The site is served as server-rendered HTML, so all content is
available without JavaScript.

## Key resources

- Sitemap: ${SITE_URL}/sitemap.xml
- Homepage: ${SITE_URL}/${defaultLocale}
- Blog index: ${SITE_URL}/${defaultLocale}/category/blog

## Supported locales

${locales.map((locale) => `- ${locale}: ${SITE_URL}/${locale}`).join('\n')}
`;

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  const wantsMarkdown = /(?:^|,)\s*text\/markdown(?:;|,|$)/i.test(accept);

  const headers: Record<string, string> = {
    Vary: 'Accept, Accept-Encoding',
    'Cache-Control': 'public, max-age=3600',
    'Content-Type': wantsMarkdown
      ? 'text/markdown; charset=utf-8'
      : 'text/plain; charset=utf-8',
  };

  return new NextResponse(MARKDOWN, { status: 200, headers });
}
