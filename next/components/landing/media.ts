import type { LandingMedia } from './types';
import { getBestFormat, getStrapiMedia } from '@/components/ui/strapi-image';

export function resolveMedia(
  media: LandingMedia,
  fallbackAlt = ''
): { src: string; alt: string } | null {
  if (!media) return null;

  if (typeof media === 'string') {
    return media ? { src: media, alt: fallbackAlt } : null;
  }

  if (!media.url) return null;

  const best = getBestFormat({
    url: media.url,
    width: media.width ?? 0,
    height: media.height ?? 0,
    formats: media.formats,
  });
  const src = getStrapiMedia(best?.url ?? media.url);

  return src ? { src, alt: media.alternativeText ?? fallbackAlt } : null;
}
