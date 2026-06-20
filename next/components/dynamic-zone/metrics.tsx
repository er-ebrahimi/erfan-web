'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { IconChartBar } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { getLocaleConfig } from '@/lib/fonts';
import { getTablerIcon } from '@/lib/constants/icon-map';
import { cn } from '@/lib/utils';

interface Metric {
  id?: number;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon?: string;
  note?: string;
}

interface MetricsProps {
  heading: string;
  sub_heading: string;
  metrics?: Metric[];
  locale: string;
}

// ---------------------------------------------------------------------------
// Number formatter — always uses fa-IR numerals
// ---------------------------------------------------------------------------
function formatMetricValue(n: number): string {
  // If the original value has a decimal component, keep one decimal place
  const isDecimal = !Number.isInteger(n);
  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: isDecimal ? 1 : 0,
  }).format(Math.round(n * (isDecimal ? 10 : 1)) / (isDecimal ? 10 : 1));
}

// ---------------------------------------------------------------------------
// Individual metric card
// ---------------------------------------------------------------------------
const MetricCard = ({
  metric,
  isRTL,
}: {
  metric: Metric;
  isRTL: boolean;
}) => {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const [displayText, setDisplayText] = useState<string>(() =>
    (metric.prefix ?? '') +
    formatMetricValue(metric.value) +
    (metric.suffix ?? '')
  );

  useEffect(() => {
    // If reduced motion or already in view tracking is done, show final value immediately
    if (reduced || !inView) {
      setDisplayText(
        (metric.prefix ?? '') +
          formatMetricValue(metric.value) +
          (metric.suffix ?? '')
      );
      return;
    }

    // Count up animation
    const controls = animate(motionValue, metric.value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        const isDecimal = !Number.isInteger(metric.value);
        const rounded = isDecimal
          ? Math.round(latest * 10) / 10
          : Math.round(latest);
        setDisplayText(
          (metric.prefix ?? '') +
            formatMetricValue(rounded) +
            (metric.suffix ?? '')
        );
      },
    });

    return () => controls.stop();
  }, [inView, reduced, metric.prefix, metric.suffix, metric.value, motionValue]);

  const IconComponent = getTablerIcon(metric.icon);

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-6',
        'rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
        'shadow-md dark:shadow-[0_4px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]',
        'text-center min-h-[10rem]'
      )}
    >
      {metric.icon && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-700/60 dark:bg-neutral-800 dark:text-indigo-300 mb-1">
          <IconComponent className="h-5 w-5" />
        </div>
      )}

      <motion.span
        className={cn(
          'text-4xl font-bold tabular-nums',
          'text-neutral-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-indigo-300',
          isRTL ? 'font-iran-sans' : ''
        )}
      >
        {displayText}
      </motion.span>

      <span className={cn('text-sm text-neutral-600 dark:text-neutral-400', isRTL ? 'font-iran-sans' : '')}>
        {metric.label}
      </span>

      {metric.note && (
        <span className={cn('text-[11px] text-neutral-600 dark:text-neutral-400', isRTL ? 'font-iran-sans' : '')}>
          {metric.note}
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export const Metrics = ({
  heading,
  sub_heading,
  metrics,
  locale,
}: MetricsProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);

  return (
    <section className={cn('py-20 relative overflow-hidden', fontClass)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/[0.04] dark:bg-violet-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconChartBar className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {/* Metrics grid */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <MetricCard
                key={metric.id ?? idx}
                metric={metric}
                isRTL={isRTL}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
