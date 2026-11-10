import { Bot, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { toButtonVariant } from '../button-variant';
import RotatingText from '../effects/rotating-text';
import { Spotlight } from '../effects/spotlight';
import { resolveMedia } from '../media';
import type { LandingHeroProps } from '../types';
import { Button } from '@/components/ui/button';
import { localizeHref } from '@/lib/url';

export function LandingHero({
  heading_line_1,
  heading_highlight,
  rotating_words,
  sub_heading,
  CTAs,
  image,
  chat_label,
  chat_message,
  locale,
}: LandingHeroProps) {
  const media = resolveMedia(image, 'پیش‌نمایش اتاق بازطراحی‌شده');
  const words = (rotating_words ?? [])
    .map((word) => word?.text?.trim())
    .filter((word): word is string => Boolean(word));

  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
      <Spotlight />
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-4xl font-extrabold leading-[1.4] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          <span>{heading_line_1} </span>
          <span className="text-primary">{heading_highlight}</span>
        </h1>

        {sub_heading && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {sub_heading}
          </p>
        )}

        {words.length > 0 && (
          <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <Sparkles
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <RotatingText
              texts={words}
              mainClassName="font-semibold text-foreground"
            />
          </div>
        )}

        {CTAs && CTAs.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {CTAs.map((cta) =>
              cta?.text && cta.URL ? (
                <Button
                  key={cta.id ?? cta.URL}
                  asChild
                  size="lg"
                  variant={toButtonVariant(cta.variant)}
                  className={
                    toButtonVariant(cta.variant) === 'default'
                      ? 'px-8 text-base shadow-aceternity'
                      : 'px-8 text-base'
                  }
                >
                  <Link href={localizeHref(cta.URL, locale)}>{cta.text}</Link>
                </Button>
              ) : null
            )}
          </div>
        )}

        {media && (
          <div className="relative mx-auto mt-14 max-w-4xl rounded-3xl border border-border/80 bg-card/60 p-2.5 shadow-2xl ring-1 ring-border/20 backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={media.src}
                alt={media.alt}
                width={1200}
                height={700}
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {(chat_label || chat_message) && (
              <div className="absolute bottom-6 start-6 end-6 rounded-2xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md md:end-auto md:max-w-md">
                {chat_label && (
                  <p className="text-start text-xs font-medium text-muted-foreground">
                    {chat_label}
                  </p>
                )}
                {chat_message && (
                  <div className="mt-2.5 flex items-start gap-2.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="size-3.5" />
                    </div>
                    <p className="text-start text-xs leading-relaxed text-foreground">
                      {chat_message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
