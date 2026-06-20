'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { IconRocket } from '@tabler/icons-react';
import React, { MouseEvent as ReactMouseEvent } from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { getLocaleConfig } from '@/lib/fonts';
import { getTablerIcon } from '@/lib/constants/icon-map';
import { cn } from '@/lib/utils';

interface Capability {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  span?: 'one' | 'two';
  accent?: string;
}

interface CapabilitiesProps {
  heading: string;
  sub_heading: string;
  capabilities?: Capability[];
  locale: string;
}

/** Parse a hex string like "#3b82f6" or "3b82f6" to [r, g, b] */
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

const CapabilityCard = ({
  capability,
  isRTL,
}: {
  capability: Capability;
  isRTL: boolean;
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

  const IconComponent = getTablerIcon(capability.icon);

  // Mouse-follow glow colour (accent, or indigo by default)
  const [gr, gg, gb] = (capability.accent && hexToRgb(capability.accent)) || [
    99, 102, 241,
  ];

  const colSpan =
    capability.span === 'two' ? 'md:col-span-2' : 'md:col-span-1';

  return (
    <div
      className={cn(
        colSpan,
        'group relative overflow-hidden rounded-3xl',
        'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
        'shadow-md dark:shadow-[0_4px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]',
        'hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors duration-200',
        'p-8 min-h-[16rem] flex flex-col'
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-follow glow — dark mode only, lightweight CSS (no WebGL) */}
      <motion.div
        className="hidden dark:block pointer-events-none absolute z-10 -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(260px circle at ${mouseX}px ${mouseY}px, rgba(${gr}, ${gg}, ${gb}, 0.18), transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col gap-4">
        {/* Icon badge */}
        <FeatureIconContainer
          className={cn(
            'flex items-center justify-center',
            isRTL ? 'mr-0' : 'ml-0'
          )}
        >
          <IconComponent className="h-6 w-6 text-neutral-300" />
        </FeatureIconContainer>

        <h3
          className={cn(
            'text-lg font-semibold text-neutral-900 dark:text-white mt-2',
            isRTL ? 'text-right' : 'text-left'
          )}
        >
          {capability.title}
        </h3>
        <p
          className={cn(
            'text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed',
            isRTL ? 'text-right' : 'text-left'
          )}
        >
          {capability.description}
        </p>
      </div>
    </div>
  );
};

export const Capabilities = ({
  heading,
  sub_heading,
  capabilities,
  locale,
}: CapabilitiesProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);

  return (
    <section
      className={cn('py-20 relative overflow-hidden', fontClass)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      {/* Radial glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/[0.05] dark:bg-indigo-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconRocket className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {/* Bento grid */}
        {capabilities && capabilities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {capabilities.map((cap) => (
              <CapabilityCard
                key={cap.id ?? cap.title}
                capability={cap}
                isRTL={isRTL}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
