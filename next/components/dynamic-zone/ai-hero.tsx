'use client';

import { useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { getStrapiMedia, StrapiImage } from '../ui/strapi-image';
import { SparklesCore } from '../ui/sparkles';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface CTA {
  id?: number;
  text: string;
  URL: string;
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  target?: string;
  image?: any;
}

interface AiHeroProps {
  heading: string;
  sub_heading: string;
  badge_text?: string;
  CTAs?: CTA[];
  Background?: any;
  locale: string;
}

export const AiHero = ({
  heading,
  sub_heading,
  badge_text,
  CTAs,
  Background,
  locale,
}: AiHeroProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);
  const prefersReducedMotion = useReducedMotion();

  // Background can be a single media object or array — normalise to single
  const backgroundImage = Array.isArray(Background)
    ? Background?.[0]
    : Background;
  const backgroundUrl = backgroundImage?.url
    ? getStrapiMedia(backgroundImage.url)
    : null;

  // Split heading: everything before the last word, and the last word itself
  const words = (heading ?? '').trim().split(/\s+/);
  const lastWord = words.pop() ?? '';
  const beforeLastWord = words.join(' ');

  return (
    <div
      className={cn(
        'relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center overflow-hidden bg-black',
        fontClass
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background layer */}
      <div className="absolute inset-0">
        {backgroundUrl ? (
          <>
            <StrapiImage
              src={backgroundImage.url}
              alt={backgroundImage.alternativeText || 'AI Hero Background'}
              fill
              className="object-cover brightness-[0.5]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </>
        ) : (
          <>
            {!prefersReducedMotion && <StarBackground />}
            {!prefersReducedMotion && <ShootingStars />}
            {!prefersReducedMotion && (
              <SparklesCore
                id="ai-hero-sparkles"
                background="transparent"
                minSize={0.4}
                maxSize={1.2}
                particleDensity={50}
                className="absolute inset-0 h-full w-full"
                particleColor="#a78bfa"
                speed={1}
              />
            )}
          </>
        )}
      </div>

      {/* Content */}
      <Container className="relative z-10 flex flex-col items-center text-center py-20">
        {/* Eyebrow pill */}
        {badge_text && (
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-neutral-300 backdrop-blur-sm">
              {badge_text}
            </span>
          </div>
        )}

        {/* Heading */}
        <Heading
          as="h1"
          size="xl"
          className="text-white relative z-10 mt-2"
        >
          {beforeLastWord && <>{beforeLastWord} </>}
          <Cover>{lastWord}</Cover>
        </Heading>

        {/* Subheading */}
        <Subheading className="mt-4 text-neutral-300 max-w-2xl mx-auto relative z-10">
          {sub_heading}
        </Subheading>

        {/* CTAs */}
        {CTAs && CTAs.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 relative z-10">
            {CTAs.map((cta) => {
              const href = cta.URL?.startsWith('http')
                ? cta.URL
                : `/${locale}${cta.URL}`;
              return (
                <Button
                  key={cta.id ?? cta.text}
                  as={Link}
                  href={href}
                  variant={cta.variant ?? 'primary'}
                  {...(cta.target ? { target: cta.target } : {})}
                >
                  {cta.text}
                </Button>
              );
            })}
          </div>
        )}
      </Container>

      {/* Bottom gradient scrim */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};
