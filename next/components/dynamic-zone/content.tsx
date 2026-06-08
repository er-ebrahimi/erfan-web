import {
  type BlocksContent,
  BlocksRenderer,
} from '@strapi/blocks-react-renderer';

import { notFound } from 'next/navigation';

import { Container } from '@/components/container';
import { StrapiImage, getBestFormat } from '@/components/ui/strapi-image';

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
                  image: ({ image }) => {
                    const best = getBestFormat(image);
                    return (
                      <StrapiImage
                        src={best.url}
                        alt={image.alternativeText || ''}
                        width={best.width}
                        height={best.height}
                        sizes="(max-width: 768px) 100vw, 672px"
                        loading="lazy"
                        className="w-full h-auto rounded-lg"
                      />
                    );
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
