import {
  type BlocksContent,
  BlocksRenderer,
} from '@strapi/blocks-react-renderer';

import { notFound } from 'next/navigation';

import { Container } from '@/components/container';

function fixBlocksImageUrl(url: string): string {
  if (url.startsWith('http')) {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (base) {
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(base);
        if (urlObj.host !== baseObj.host) {
          urlObj.host = baseObj.host;
          return urlObj.toString();
        }
      } catch {
        // invalid URL, return as-is
      }
    }
  }
  return url;
}

export const Content = ({ content }: { content: BlocksContent }) => {
  if (!content) notFound();

  return (
    <Container className="py-0 pt-0 flex justify-center">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <div className="pb-2 pt-1">
            <div className="mt-8 prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-full">
              <BlocksRenderer
                content={content}
                blocks={{
                  image: ({ image }) => (
                    <img
                      src={fixBlocksImageUrl(image.url)}
                      alt={image.alternativeText || ''}
                    />
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
