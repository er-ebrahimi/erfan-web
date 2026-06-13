'use client';

import { IconBriefcase } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { Carousel, Card } from '../ui/apple-cards-carousel';
import { getStrapiMedia } from '../ui/strapi-image';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

// A simple SVG gradient used when no image is provided for a use-case card.
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%234f46e5'/%3E%3Cstop offset='100%25' stop-color='%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='600' fill='url(%23g)'/%3E%3C/svg%3E";

interface UseCase {
  id?: number;
  title: string;
  category?: string;
  description?: string;
  image?: any;
}

interface UseCasesProps {
  heading: string;
  sub_heading: string;
  use_cases?: UseCase[];
  locale: string;
}

export const UseCases = ({
  heading,
  sub_heading,
  use_cases,
  locale,
}: UseCasesProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);

  const cards = (use_cases ?? []).map((useCase, index) => {
    const rawUrl: string | null =
      useCase.image?.url ? getStrapiMedia(useCase.image.url) : null;
    const src = rawUrl ?? PLACEHOLDER_SRC;

    const content = (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'text-sm leading-relaxed text-neutral-300',
          isRTL ? 'text-right font-iran-sans' : 'text-left'
        )}
      >
        {useCase.description ?? ''}
      </div>
    );

    return (
      <Card
        key={useCase.id ?? index}
        card={{
          src,
          title: useCase.title,
          category: useCase.category ?? '',
          content,
        }}
        index={index}
        layout
      />
    );
  });

  return (
    <section className={cn('py-20', fontClass)} dir={isRTL ? 'rtl' : 'ltr'}>
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-4">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconBriefcase className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>
      </Container>

      {/* Carousel — full-bleed, intentionally outside Container */}
      {cards.length > 0 && <Carousel items={cards} isRTL={isRTL} />}
    </section>
  );
};
