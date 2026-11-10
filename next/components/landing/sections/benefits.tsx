import { HoverEffect } from '../effects/card-hover-effect';
import { iconFor } from '../icons';
import type { LandingBenefitsProps } from '../types';
import { localizeHref } from '@/lib/url';

export function LandingBenefits({
  heading,
  sub_heading,
  items,
  locale,
}: LandingBenefitsProps) {
  if (!heading && !sub_heading && !items?.length) return null;

  const cards = (items ?? [])
    .filter((item) => item?.title)
    .map((item, index) => {
      const Icon = iconFor(item.icon);
      return {
        ...item,
        id: String(item.id ?? `benefit-${index}`),
        title: item.title ?? '',
        description: item.description ?? '',
        link: localizeHref(item.url, locale),
        icon: <Icon className="size-6" />,
      };
    });

  return (
    <section id="benefits" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        {heading && (
          <h2 className="text-center text-3xl font-extrabold leading-[1.5] text-foreground sm:text-4xl">
            {heading}
          </h2>
        )}
        {sub_heading && (
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">
            {sub_heading}
          </p>
        )}
        {cards.length > 0 && (
          <div className="mt-8">
            <HoverEffect
              items={cards}
              className="md:grid-cols-2 lg:grid-cols-4"
            />
          </div>
        )}
      </div>
    </section>
  );
}
