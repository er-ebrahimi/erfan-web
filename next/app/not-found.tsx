import { headers } from 'next/headers';

import { defaultLocale } from '@/config';

const SITE_URL = (process.env.FRONT_URL || 'https://studioarman.com').replace(
  /\/$/,
  ''
);
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Studio Arman';

export default async function NotFound() {
  const headersList = await headers();
  const accept = headersList.get('accept') || '';
  const wantsMarkdown = accept.includes('text/markdown');

  if (wantsMarkdown) {
    const markdown = `# 404 - Not Found

The requested page does not exist on ${SITE_NAME}.

## Useful resources for agents

- Sitemap: ${SITE_URL}/sitemap.xml
- LLMs.txt: ${SITE_URL}/llms.txt
- Homepage: ${SITE_URL}/${defaultLocale}
`;
    return (
      <main className="min-h-screen bg-background text-foreground p-8">
        <pre dir="ltr" className="whitespace-pre-wrap font-mono text-sm">
          {markdown}
        </pre>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          {SITE_NAME} - Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <p className="text-sm text-muted-foreground">
          Agents: see {SITE_URL}/llms.txt or {SITE_URL}/sitemap.xml for a map of
          this site.
        </p>
      </div>
    </main>
  );
}
