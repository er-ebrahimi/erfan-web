'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { IconSettings } from '@tabler/icons-react';
import React, {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { getLocaleConfig } from '@/lib/fonts';
import { getTablerIcon } from '@/lib/constants/icon-map';
import { cn } from '@/lib/utils';

interface Step {
  id?: number;
  title: string;
  description: string;
  icon?: string;
}

interface ProcessProps {
  heading: string;
  sub_heading: string;
  steps?: Step[];
  locale: string;
}

/** Convert a number to Persian (Eastern Arabic) digit string, e.g. 1 → "۰۱" */
function toPersianIndex(n: number): string {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const twoDigit = String(n).padStart(2, '0');
  return twoDigit
    .split('')
    .map((d) => persian[parseInt(d, 10)])
    .join('');
}

// ---------------------------------------------------------------------------
// Rail — the full-height scroll-grown beam that sits on the correct side
// ---------------------------------------------------------------------------
const ProcessRail = ({
  isRTL,
  containerRef,
}: {
  isRTL: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [height, setHeight] = useState(0);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.getBoundingClientRect().height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const sideClass = isRTL ? 'right-0 lg:right-8' : 'left-0 lg:left-8';

  return (
    <div ref={innerRef} className="absolute inset-0 pointer-events-none">
      <div
        style={{ height: height + 'px' }}
        className={cn(
          'absolute overflow-hidden w-[2px]',
          'bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]',
          'from-transparent from-[0%] via-neutral-300 dark:via-neutral-700 to-transparent to-[99%]',
          '[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]',
          'top-0',
          sideClass
        )}
      >
        <motion.div
          style={{ height: heightTransform, opacity: opacityTransform }}
          className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-800 via-blue-300 to-transparent from-[0%] via-[10%] rounded-full"
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Process visual panel — decorative workflow diagram
// ---------------------------------------------------------------------------
const ProcessVisual = ({
  steps,
  isRTL,
}: {
  steps: Step[];
  isRTL: boolean;
}) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, x: isRTL ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer glow blob */}
      <div className="absolute inset-0 bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08] rounded-3xl blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-xs rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/80 backdrop-blur-sm shadow-xl dark:shadow-[0_8px_48px_rgba(0,0,0,0.5)]">
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="p-7">
          {/* Title */}
          <div className={cn('flex items-center gap-2 mb-6', isRTL ? 'flex-row-reverse' : 'flex-row')}>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500 dark:text-indigo-400">
              {isRTL ? 'گردش‌کار هوش مصنوعی' : 'AI Workflow'}
            </span>
          </div>

          {/* Step nodes */}
          <div className="flex flex-col">
            {steps.map((step, i) => {
              const IconComponent = getTablerIcon(step.icon);
              const isLast = i === steps.length - 1;
              return (
                <div key={step.id ?? i}>
                  {/* Node row */}
                  <motion.div
                    className={cn('flex items-center gap-4', isRTL ? 'flex-row-reverse' : 'flex-row')}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    {/* Icon circle */}
                    <div className="relative shrink-0 h-11 w-11 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/25 dark:border-indigo-500/30">
                      <IconComponent className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                      <div className="absolute inset-0 rounded-full bg-indigo-400/10 blur-sm" />
                    </div>

                    {/* Text */}
                    <div className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
                      <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mb-0.5">
                        {isRTL ? toPersianIndex(i + 1) : String(i + 1).padStart(2, '0')}
                      </div>
                      <div className={cn('text-sm font-semibold text-neutral-800 dark:text-neutral-200', isRTL && 'font-iran-sans')}>
                        {step.title}
                      </div>
                    </div>

                    {/* Status dot */}
                    <div className="shrink-0 h-2 w-2 rounded-full bg-indigo-500/40 border border-indigo-500/60" />
                  </motion.div>

                  {/* Connector */}
                  {!isLast && (
                    <div className={cn('flex my-1', isRTL ? 'justify-end pr-[18px]' : 'justify-start pl-[18px]')}>
                      <div className="h-7 w-px bg-gradient-to-b from-indigo-500/40 to-indigo-500/10 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/40">
            <div className="flex items-center justify-between">
              <span className={cn('text-[11px] text-neutral-500 dark:text-neutral-400', isRTL && 'font-iran-sans')}>
                {isRTL ? 'گردش‌کار هوشمند' : 'Intelligent Process'}
              </span>
              <div className="flex gap-1">
                {[0, 1, 2].map((j) => (
                  <motion.div
                    key={j}
                    className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: j * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Step card — horizontal connector beam + mouse-tracked CanvasRevealEffect
// ---------------------------------------------------------------------------
const StepCard = ({
  step,
  index,
  isRTL,
  reduced,
}: {
  step: Step;
  index: number;
  isRTL: boolean;
  reduced: boolean;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['end end', 'start start'],
  });

  const rawWidth = useTransform(scrollYProgress, [0, 0.2], [0, 160]);
  const connectorWidth = useSpring(rawWidth, { stiffness: 500, damping: 90 });
  const displayWidth = reduced ? 160 : connectorWidth;

  const IconComponent = getTablerIcon(step.icon);

  return (
    <div
      ref={cardRef}
      className={cn(
        'flex items-start gap-4 py-10',
        isRTL ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Index / icon badge */}
      <div className="shrink-0 flex flex-col items-center gap-2 pt-1">
        <div
          className={cn(
            'h-12 w-12 rounded-full flex items-center justify-center',
            'border border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-700/60 dark:bg-neutral-800 dark:text-neutral-300'
          )}
        >
          {step.icon ? (
            <IconComponent className="h-5 w-5" />
          ) : (
            <span
              className={cn(
                'text-sm font-bold leading-none',
                isRTL ? 'font-iran-sans' : 'font-mono'
              )}
            >
              {isRTL ? toPersianIndex(index) : String(index).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      {/* Horizontal connector beam */}
      <motion.div
        className={cn(
          'h-px self-center hidden sm:block',
          'bg-gradient-to-r from-neutral-300 to-neutral-400 dark:from-neutral-800 dark:to-neutral-600 rounded-full',
          'relative overflow-hidden shrink-0'
        )}
        style={{ width: displayWidth }}
      />

      {/* Content card */}
      <div
        className={cn(
          'group flex-1 p-6 rounded-2xl relative overflow-hidden z-10',
          'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
          'shadow-md dark:shadow-[0_4px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]',
          'hover:border-blue-200 dark:hover:border-blue-900 transition-colors duration-200'
        )}
        onMouseMove={handleMouseMove}
      >
        {/* Mouse-follow glow — dark mode only, lightweight CSS (no WebGL) */}
        <motion.div
          className="hidden dark:block pointer-events-none absolute z-10 -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`radial-gradient(260px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.16), transparent 70%)`,
          }}
        />

        <div className="relative z-20">
          <h3
            className={cn(
              'text-lg font-semibold text-neutral-900 dark:text-white mb-2',
              isRTL ? 'text-right' : 'text-left'
            )}
          >
            {step.title}
          </h3>
          <p
            className={cn(
              'text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed',
              isRTL ? 'text-right' : 'text-left'
            )}
          >
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export const Process = ({
  heading,
  sub_heading,
  steps,
  locale,
}: ProcessProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);
  const reduced = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className={cn('py-20 relative overflow-hidden', fontClass)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-600/[0.04] dark:bg-blue-500/[0.06] rounded-full blur-3xl pointer-events-none" />
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconSettings className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {/* 2-col layout: steps + visual panel */}
        {steps && steps.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Step list */}
            <div
              ref={containerRef}
              className={cn(
                'relative',
                isRTL ? 'pr-12 lg:pr-16' : 'pl-12 lg:pl-16'
              )}
            >
              <ProcessRail isRTL={isRTL} containerRef={containerRef} />
              {steps.map((step, idx) => (
                <StepCard
                  key={step.id ?? idx}
                  step={step}
                  index={idx + 1}
                  isRTL={isRTL}
                  reduced={reduced}
                />
              ))}
            </div>

            {/* Visual panel — hidden on mobile */}
            <div className="hidden lg:block">
              <ProcessVisual steps={steps} isRTL={isRTL} />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
