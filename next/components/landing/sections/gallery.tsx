import Image from 'next/image';

import { InfiniteMovingCards } from '../effects/infinite-moving-cards';
import { resolveMedia } from '../media';
import type { LandingGalleryProps } from '../types';

export function LandingGallery({
  heading,
  sub_heading,
  items,
}: LandingGalleryProps) {
  const resolved = (items ?? [])
    .map((item) => ({
      id: item.id,
      title: item.title ?? '',
      media: resolveMedia(item.image, item.alt ?? item.title ?? ''),
    }))
    .filter(
      (
        item
      ): item is {
        id: typeof item.id;
        title: string;
        media: { src: string; alt: string };
      } => Boolean(item.media)
    );

  if (!heading && !sub_heading && resolved.length === 0) return null;

  const marqueeItems = resolved.map((item) => ({
    quote: item.title,
    name: item.media.alt,
    image: item.media.src,
  }));

  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 text-center">
        {heading && (
          <h2 className="text-3xl font-extrabold leading-[1.5] text-foreground sm:text-4xl">
            {heading}
          </h2>
        )}
        {sub_heading && (
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">
            {sub_heading}
          </p>
        )}
      </div>

      {marqueeItems.length > 0 && (
        <div className="mt-12">
          <InfiniteMovingCards items={marqueeItems} speed="slow" pauseOnHover />
        </div>
      )}

      {resolved.length > 0 && (
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 px-4 sm:gap-6 md:grid-cols-4">
          {resolved.map((item, index) => (
            <figure
              key={item.id ?? `${item.title}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-1.5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={item.media.src}
                  alt={item.media.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <figcaption className="p-2.5 text-center text-sm font-semibold text-foreground">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
