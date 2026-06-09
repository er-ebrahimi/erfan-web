import Image from 'next/image';
import { ComponentProps } from 'react';

interface StrapiImageProps
  extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string;
  alt: string | null;
}

export interface StrapiFormat {
  url: string;
  width: number;
  height: number;
}

export type StrapiFormats = Record<string, StrapiFormat>;

export function getBestFormat(
  image: {
    url: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
  },
  preferred: string[] = ['large', 'medium', 'small']
): { url: string; width: number; height: number } {
  for (const name of preferred) {
    const fmt = image.formats?.[name] as
      | { url?: string; width?: number; height?: number }
      | undefined;
    if (fmt?.url && fmt?.width && fmt?.height) {
      return { url: fmt.url, width: fmt.width, height: fmt.height };
    }
  }
  return { url: image.url, width: image.width, height: image.height };
}

export function getStrapiMedia(url: string | null) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (url == null) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  if (url.startsWith('/')) {
    return strapiURL + url;
  }
  return `${strapiURL}${url}`;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;
  return (
    <Image
      src={imageUrl}
      alt={alt ?? 'No alternative text provided'}
      className={className}
      {...rest}
    />
  );
}
