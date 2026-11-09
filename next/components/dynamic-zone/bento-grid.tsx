import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../elements/button';
import { getBestFormat, getStrapiMedia } from '../ui/strapi-image';
import { localizeHref } from '@/lib/url';
import { cn } from '@/lib/utils';
import { StrapiImage } from '@/types/types';

type BentoTileSize = 'lead' | 'wide' | 'tall' | 'square';

interface BentoTile {
  id?: number;
  Image?: StrapiImage | null;
  Size?: BentoTileSize | null;
}

type CTA = {
  id: string;
  text: string;
  URL: string;
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
};

/**
 * Two columns on mobile, four from `lg`. `lead` doubles on both axes, `wide`
 * doubles in columns, `tall` in rows, `square` stays 1x1. Below `lg` a `lead`
 * is flattened to a single row so it cannot swallow a phone screen.
 *
 * Note the deliberate absence of `heading`/`Subheading` from
 * `components/elements`: both hardcode `tracking-tight`, and negative tracking
 * squeezes a connected Persian script into collisions. Persian also needs a
 * line-height that `md:leading-tight` does not give it.
 */
const TILE_SIZE: Record<BentoTileSize, string> = {
  lead: 'col-span-2 row-span-1 lg:row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  square: 'col-span-1 row-span-1',
};

/**
 * `auto-rows` is a fixed length on purpose. With `1fr` rows or no explicit
 * track, the grid is sized by each image's intrinsic height and the layout
 * expands past whatever height its container was given.
 */
const GRID_CLASSES = cn(
  'grid grid-flow-row-dense grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4',
  'auto-rows-[clamp(120px,30vw,180px)] lg:auto-rows-[clamp(150px,10vw,240px)]'
);

export const BentoGrid = ({
  heading,
  sub_heading,
  CTAs,
  tiles,
  locale,
}: {
  heading?: string;
  sub_heading?: string;
  CTAs?: CTA[];
  tiles?: BentoTile[];
  locale: string;
}) => {
  const visibleTiles = (tiles ?? []).filter((tile) => tile?.Image?.url);
  const hasCopy = Boolean(heading || sub_heading || CTAs?.length);

  if (!hasCopy && visibleTiles.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="px-[clamp(20px,5vw,64px)]">
        {hasCopy && (
          <div className="mx-auto max-w-4xl text-center">
            {/* Gold hairline. Mixed against --foreground so it stays visible on
                the light canvas, where --primary (#bdac62) only reaches 1.9:1
                against #f2f3f4. */}
            <div
              aria-hidden="true"
              className="mx-auto mb-6 h-px w-12 bg-[color-mix(in_srgb,var(--primary)_62%,var(--foreground))]"
            />

            {heading && (
              <h2
                className="text-[clamp(1.5rem,3.2vw,3rem)] font-bold leading-[1.5] text-foreground [text-wrap:balance]"
                style={{ letterSpacing: 0 }}
              >
                {heading}
              </h2>
            )}

            {sub_heading && (
              <p className="mx-auto mt-4 max-w-[42rem] text-sm leading-[1.9] text-muted-foreground md:text-base">
                {sub_heading}
              </p>
            )}

            {CTAs && CTAs.length > 0 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {CTAs.map((cta) => (
                  <Button
                    key={cta?.id}
                    as={Link}
                    href={localizeHref(cta.URL, locale)}
                    {...(cta.variant && { variant: cta.variant })}
                  >
                    {cta.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {visibleTiles.length > 0 && (
          <div className={cn(GRID_CLASSES, hasCopy && 'mt-10 md:mt-14')}>
            {visibleTiles.map((tile, index) => {
              const image = tile.Image as StrapiImage;
              const src = getStrapiMedia(getBestFormat(image).url);

              if (!src) {
                return null;
              }

              return (
                <div
                  key={tile.id ?? index}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl bg-muted lg:rounded-3xl',
                    TILE_SIZE[tile.Size as BentoTileSize] ?? TILE_SIZE.square
                  )}
                >
                  <Image
                    src={src}
                    alt={image.alternativeText ?? ''}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={cn(
                      'object-cover',
                      'transition-transform duration-700 ease-out',
                      // decoration only, and never on a touch pointer where
                      // :hover fires on tap and then sticks
                      'motion-safe:[@media(hover:hover)]:group-hover:scale-[1.04]'
                    )}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
