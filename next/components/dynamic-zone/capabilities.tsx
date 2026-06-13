'use client';

import dynamic from 'next/dynamic';
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

// CanvasRevealEffect uses WebGL — must be client-only
const CanvasRevealEffect = dynamic(
  () =>
    import('../ui/canvas-reveal-effect').then((mod) => mod.CanvasRevealEffect),
  { ssr: false }
);

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

  // Resolve shader colors
  const accentRgb = capability.accent ? hexToRgb(capability.accent) : null;
  const shaderColors: number[][] = accentRgb
    ? [accentRgb]
    : [
        [59, 130, 246],
        [139, 92, 246],
      ];

  const colSpan =
    capability.span === 'two' ? 'md:col-span-2' : 'md:col-span-1';

  return (
    <div
      className={cn(
        colSpan,
        'group relative overflow-hidden rounded-3xl',
        'border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)]',
        'shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]',
        'p-8 min-h-[16rem] flex flex-col'
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Hover canvas reveal behind a radial cursor mask */}
      <motion.div
        className="pointer-events-none absolute z-10 -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-40"
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
          colors={shaderColors}
          dotSize={2}
          showGradient={false}
        />
      </motion.div>

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
            'text-lg font-semibold text-white mt-2',
            isRTL ? 'text-right' : 'text-left'
          )}
        >
          {capability.title}
        </h3>
        <p
          className={cn(
            'text-sm text-neutral-400 leading-relaxed',
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
      className={cn('py-20', fontClass)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
