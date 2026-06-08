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
    ? (process.env.NEXT_PUBLIC_STRAPI_URL || '') + mediaItem.url
    : mediaItem.url;

  return (
    <Container className="py-2 flex justify-center">
      <div
        className="w-full max-w-2xl"
        style={{ aspectRatio: mediaItem.width && mediaItem.height ? `${mediaItem.width}/${mediaItem.height}` : '16/9' }}
      >
        <video
          controls
          playsInline
          className="w-full h-full rounded-lg shadow-lg object-contain"
          src={url}
          width={mediaItem.width || 1280}
          height={mediaItem.height || 720}
        >
          {t('videoFallback')}
        </video>
      </div>
    </Container>
  );
};
