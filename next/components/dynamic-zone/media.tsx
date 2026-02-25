'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Container } from '@/components/container';
import { StrapiImage } from '@/types/types';

interface MediaProps {
  media: StrapiImage | StrapiImage[];
}

export const Media = ({ media }: MediaProps) => {
  const t = useTranslations('common');
  const mediaItem = Array.isArray(media) ? media[0] : media;

  if (!mediaItem?.url) return null;

  const url = mediaItem.url.startsWith('/')
    ? (process.env.BACKEND_URL || '') + mediaItem.url
    : mediaItem.url;

  return (
    <Container className="py-2 flex justify-center">
      <video
        controls
        playsInline
        className="w-full max-w-2xl rounded-lg shadow-lg"
        src={url}
        width={mediaItem.width || undefined}
        height={mediaItem.height || undefined}
      >
        {t('videoFallback')}
      </video>
    </Container>
  );
};
