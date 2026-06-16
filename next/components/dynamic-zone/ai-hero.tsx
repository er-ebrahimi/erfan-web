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
  reassurance?: string;
  CTAs?: CTA[];
  Background?: any;
  locale: string;
}

export const AiHero = ({
  heading,
  sub_heading,
  badge_text,
  reassurance,
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

      {/* Large glow bloom behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/[0.12] rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <Container className="relative z-10 flex flex-col items-center text-center py-20">
        {/* Eyebrow pill */}
        {badge_text && (
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-sm text-indigo-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {badge_text}
            </span>
          </div>
        )}

        {/* Heading — gradient white→violet */}
        <h1
          className={cn(
            'relative z-10 mt-2 font-bold leading-tight tracking-tight text-balance',
            'text-4xl md:text-5xl lg:text-6xl',
            'bg-gradient-to-br from-white via-white to-violet-300 bg-clip-text text-transparent',
            isRTL ? 'font-iran-sans' : ''
          )}
        >
          {beforeLastWord && <>{beforeLastWord} </>}
          <Cover className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-violet-400">{lastWord}</Cover>
        </h1>

        {/* Subheading */}
        <Subheading className="mt-6 text-neutral-400 max-w-2xl mx-auto relative z-10">
          {sub_heading}
        </Subheading>

        {/* CTAs */}
        {CTAs && CTAs.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 relative z-10">
            {CTAs.map((cta) => {
              const href = cta.URL?.startsWith('http')
                ? cta.URL
                : `/${locale}${cta.URL}`;
              const isPrimary = (cta.variant ?? 'primary') === 'primary';
              return (
                <span key={cta.id ?? cta.text} className={isPrimary ? 'shadow-[0_0_32px_rgba(99,102,241,0.5)]' : ''}>
                  <Button
                    as={Link}
                    href={href}
                    variant={cta.variant ?? 'primary'}
                    {...(cta.target ? { target: cta.target } : {})}
                  >
                    {cta.text}
                  </Button>
                </span>
              );
            })}
          </div>
        )}

        {/* Risk-reversal microcopy under the CTAs */}
        {reassurance && (
          <p className="mt-4 text-xs text-neutral-500 relative z-10">
            {reassurance}
          </p>
        )}
      </Container>

      {/* Bottom gradient scrim */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};
