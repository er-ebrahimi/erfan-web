'use client';

import dynamic from 'next/dynamic';
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

// CanvasRevealEffect uses WebGL — must be client-only
const CanvasRevealEffect = dynamic(
  () =>
    import('../ui/canvas-reveal-effect').then((mod) => mod.CanvasRevealEffect),
  { ssr: false }
);

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
          'from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]',
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
  // In reduced-motion mode we skip the spring animation
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
            'border border-neutral-700 bg-neutral-900 text-neutral-300'
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
          'bg-gradient-to-r from-neutral-800 to-neutral-600 rounded-full',
          'relative overflow-hidden shrink-0'
        )}
        style={{ width: displayWidth }}
      />

      {/* Content card */}
      <div
        className={cn(
          'group flex-1 p-6 rounded-2xl relative overflow-hidden z-10',
          'border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)]',
          'shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]'
        )}
        onMouseMove={handleMouseMove}
      >
        {/* Radial-mask CanvasRevealEffect on hover */}
        <motion.div
          className="pointer-events-none absolute z-10 -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-40"
          style={{
            maskImage: useMotionTemplate`radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              var(--neutral-900, #171717),
              transparent 80%
            )`,
          }}
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [139, 92, 246],
            ]}
            dotSize={2}
            showGradient={false}
          />
        </motion.div>

        <div className="relative z-20">
          <h3
            className={cn(
              'text-lg font-semibold text-white mb-2',
              isRTL ? 'text-right' : 'text-left'
            )}
          >
            {step.title}
          </h3>
          <p
            className={cn(
              'text-sm text-neutral-400 leading-relaxed',
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
    <section className={cn('py-20', fontClass)} dir={isRTL ? 'rtl' : 'ltr'}>
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconSettings className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {/* Steps */}
        {steps && steps.length > 0 && (
          <div
            ref={containerRef}
            className={cn(
              'relative max-w-3xl',
              isRTL ? 'mr-auto ml-4 pl-4 lg:pl-0 pr-12 lg:pr-16' : 'ml-auto mr-4 pr-4 lg:pr-0 pl-12 lg:pl-16'
            )}
          >
            {/* Scroll-grown vertical rail */}
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
        )}
      </Container>
    </section>
  );
};
