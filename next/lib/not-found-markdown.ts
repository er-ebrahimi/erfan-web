import { defaultLocale } from '@/config';

const SITE_URL = (process.env.FRONT_URL || 'https://studioarman.com').replace(
  /\/$/,
  ''
);
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Studio Arman';

export function notFoundMarkdown(): string {
  return `# 404 - Not Found

The requested page does not exist on ${SITE_NAME}.

## Useful resources for agents

- Sitemap: ${SITE_URL}/sitemap.xml
- LLMs.txt: ${SITE_URL}/llms.txt
- Homepage: ${SITE_URL}/${defaultLocale}
`;
}
