'use client';

import { IconRocket } from '@tabler/icons-react';
import { motion, useMotionValueEvent } from 'framer-motion';
import { useScroll } from 'framer-motion';
import { useRef, useState } from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { ThreeDCard } from '@/components/ui/three-d-card';
import { getBestFormat, getStrapiMedia } from '@/components/ui/strapi-image';

export const LaunchesCard = ({
  heading,
  sub_heading,
  launches,
}: {
  heading: string;
  sub_heading: string;
  launches: any[];
}) => {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  const launchesWithDecoration = launches.map((entry) => ({
    ...entry,
    icon: getStrapiMedia(getBestFormat(entry.Image).url),
  }));

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const backgrounds = [
    'var(--background)',
    'var(--muted)',
    'var(--background)',
  ];

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = launches.map(
      (_, index) => index / launches.length
    );
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
  });
  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-20 md:pt-40"
    >
      <div className="px-6">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-foreground" />
        </FeatureIconContainer>
        <Heading className="mt-4 text-foreground">{heading}</Heading>
        <Subheading className="text-muted-foreground">{sub_heading}</Subheading>
      </div>
      <ThreeDCard items={launchesWithDecoration} />
    </motion.div>
  );
};
