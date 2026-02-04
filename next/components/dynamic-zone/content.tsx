'use client';

import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import React from 'react';
import { Container } from '@/components/container';

export const Content = ({ content }: { content: BlocksContent }) => {
  if (!content) return null;
  
  return (
    <Container className="py-20 pt-0">
      <div className="prose max-w-none dark:prose-invert">
        <BlocksRenderer content={content} />
      </div>
    </Container>
  );
};
