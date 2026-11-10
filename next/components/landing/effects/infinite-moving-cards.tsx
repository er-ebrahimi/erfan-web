'use client';

import { useReducedMotion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import React, { useLayoutEffect } from 'react';

import { cn } from '@/lib/utils';

const RTL_LOCALES = ['ar', 'fa', 'he', 'ur', 'ps', 'ckb', 'sd', 'ug', 'yi'];

export type Item = {
  quote: string;
  name?: string;
  title?: string;
  image?: string;
};

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: Item[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const locale = useLocale();
  const isRtl = RTL_LOCALES.includes(locale.split('-')[0]);
  const shouldReduceMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    if (!scroller.dataset.duplicated) {
      const scrollerContent = Array.from(scroller.children);
      scrollerContent.forEach((item) => {
        scroller.appendChild(item.cloneNode(true));
      });
      scroller.dataset.duplicated = 'true';
    }

    container.style.setProperty(
      '--animation-direction',
      direction === 'left' ? 'forwards' : 'reverse'
    );
    container.style.setProperty(
      '--animation-duration',
      speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s'
    );
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className={cn(
        'relative z-20 mx-auto max-w-7xl overflow-hidden',
        className
      )}
    >
      <style>{`@keyframes landing-marquee { to { transform: translate(calc(-50% - 0.5rem)); } }`}</style>
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          !shouldReduceMotion &&
            'animate-[landing-marquee_var(--animation-duration,40s)_linear_var(--animation-direction,forwards)_infinite]',
          pauseOnHover &&
            !shouldReduceMotion &&
            'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          <li
            dir={isRtl ? 'rtl' : 'ltr'}
            className="relative w-[320px] max-w-full shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg sm:w-[380px]"
            key={`${item.name}-${idx}`}
          >
            {item.image ? (
              <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/50">
                <Image
                  src={item.image}
                  alt={item.name ?? item.quote}
                  fill
                  sizes="380px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 start-2.5 rounded-full bg-background/85 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur-md">
                  {item.quote}
                </span>
              </div>
            ) : (
              <span className="relative z-20 text-sm font-semibold text-foreground">
                {item.quote}
              </span>
            )}
            {item.name && (
              <p className="line-clamp-2 text-start text-xs leading-relaxed text-muted-foreground">
                {item.name}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-28"
      />
    </div>
  );
};
