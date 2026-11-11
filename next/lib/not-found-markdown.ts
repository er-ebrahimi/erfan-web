import { defaultLocale } from '@/config';
import { SITE_NAME } from '@/lib/shared/site-metadata';
import { SITE_URL } from '@/lib/shared/site-url';

export function notFoundMarkdown(): string {
  return `# 404 - Not Found

The requested page does not exist on ${SITE_NAME}.

## Useful resources for agents

- Sitemap: ${SITE_URL}/sitemap.xml
- LLMs.txt: ${SITE_URL}/llms.txt
- Homepage: ${SITE_URL}/${defaultLocale}
`;
}
