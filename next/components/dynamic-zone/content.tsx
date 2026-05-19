'use client';

import {
  type BlocksContent,
  BlocksRenderer,
} from '@strapi/blocks-react-renderer';
import React from 'react';

import { Container } from '@/components/container';

export const Content = ({ content }: { content: BlocksContent }) => {
  if (!content) return null;

  return (
    <Container className="py-0 pt-0 flex justify-center">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <div className="pb-2 pt-1">
            <div className="mt-8 prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-full">
              <BlocksRenderer content={content} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
