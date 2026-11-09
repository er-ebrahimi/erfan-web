import { Metadata } from 'next';
import { headers } from 'next/headers';

import { NotFound } from '@/components/not-found';
import { notFoundMarkdown } from '@/lib/not-found-markdown';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.",
};

export default async function RootNotFound() {
  const accept = (await headers()).get('accept') || '';

  if (accept.includes('text/markdown')) {
    return (
      <main className="min-h-screen bg-background text-foreground p-8">
        <pre dir="ltr" className="whitespace-pre-wrap font-mono text-sm">
          {notFoundMarkdown()}
        </pre>
      </main>
    );
  }

  return <NotFound />;
}
