'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { Button } from '../elements/button';
import { StrapiImage } from '../ui/strapi-image';
import { useLocaleConfig } from '@/hooks/use-locale-config';
import { cn } from '@/lib/utils';

export const CTA = ({
  heading,
  sub_heading,
  reassurance,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  reassurance?: string;
  CTAs: any[];
  locale: string;
}) => {
  const { isRTL, fontClass } = useLocaleConfig();
  return (
    <section
      className={cn('relative overflow-hidden py-24', fontClass)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-background to-violet-950/40 dark:from-indigo-950/80 dark:via-background dark:to-violet-950/60" />
      {/* Top + bottom accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/[0.06] dark:bg-indigo-500/[0.10] rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          {heading && (
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {heading}
            </motion.h2>
          )}
          {sub_heading && (
            <p className="text-sm md:text-base text-muted-foreground max-w-md">
              {sub_heading}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {CTAs &&
              CTAs.map((cta, index) => (
                <Button
                  as={Link}
                  key={index}
                  href={cta.URL?.startsWith('http') ? cta.URL : `/${locale}${cta.URL}`}
                  variant={cta.variant}
                  className="flex flex-row gap-1"
                  target={cta.target}
                >
                  <StrapiImage
                    src={cta.image?.url}
                    alt={cta.image?.alternativeText}
                    width={30}
                    height={30}
                  />
                  {cta.text}
                </Button>
              ))}
          </div>
          {reassurance && (
            <p className="text-xs text-muted-foreground">{reassurance}</p>
          )}
        </div>
      </Container>
    </section>
  );
};
