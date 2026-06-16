'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { IconBriefcase } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface CaseStudy {
  id?: number;
  title: string;
  category?: string;
  summary?: string;
  outcomes?: string[];
  tags?: string[];
}

interface CaseStudiesProps {
  heading: string;
  sub_heading: string;
  case_studies?: CaseStudy[];
  locale: string;
}

// outcomes / tags may arrive from Strapi as a JSON array or a comma string —
// normalise to a clean string[].
const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/[,،]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};

const CaseStudyCard = ({
  study,
  isRTL,
  index,
  reduce,
}: {
  study: CaseStudy;
  isRTL: boolean;
  index: number;
  reduce: boolean | null;
}) => {
  const outcomes = toList(study.outcomes);
  const tags = toList(study.tags);

  return (
    <motion.article
      className={cn(
        'relative flex flex-col gap-4 overflow-hidden rounded-3xl p-7',
        'border border-neutral-200 bg-white shadow-md',
        'dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_4px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]',
        isRTL ? 'text-right' : 'text-left'
      )}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {study.category && (
        <span
          className={cn(
            'inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300',
            isRTL && 'font-iran-sans'
          )}
        >
          {study.category}
        </span>
      )}

      <h3
        className={cn(
          'text-lg font-semibold text-neutral-900 dark:text-neutral-100',
          isRTL && 'font-iran-sans'
        )}
      >
        {study.title}
      </h3>

      {study.summary && (
        <p
          className={cn(
            'text-sm leading-relaxed text-neutral-600 dark:text-neutral-400',
            isRTL && 'font-iran-sans'
          )}
        >
          {study.summary}
        </p>
      )}

      {outcomes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {outcomes.map((outcome, i) => (
            <span
              key={i}
              className={cn(
                'rounded-lg bg-gradient-to-br from-indigo-500/15 to-violet-500/15 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-200 border border-indigo-500/20',
                isRTL && 'font-iran-sans'
              )}
            >
              {outcome}
            </span>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div
          className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800"
          dir="ltr"
        >
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
};

export const CaseStudies = ({
  heading,
  sub_heading,
  case_studies,
  locale,
}: CaseStudiesProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);
  const reduce = useReducedMotion();

  return (
    <section
      className={cn('py-20 relative overflow-hidden', fontClass)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/[0.04] dark:bg-indigo-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconBriefcase className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {case_studies && case_studies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {case_studies.map((study, idx) => (
              <CaseStudyCard
                key={study.id ?? idx}
                study={study}
                isRTL={isRTL}
                index={idx}
                reduce={reduce}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
