'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { AmbientColor } from '../decorations/ambient-color';
import { Button } from '../elements/button';
import { useLocaleConfig } from '@/hooks/use-locale-config';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { StrapiImage } from '../ui/strapi-image';

export const CTA = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  let localeConfig = useLocaleConfig();
  return (
    <div className="relative py-5" >
      {/* <AmbientColor /> */}
      <Container className={cn("flex flex-col justify-between items-center w-full px-8", localeConfig.isRTL? "md:flex-row-reverse": "md:flex-row")}>
        <div className="flex flex-col">
          <motion.h2 className="text-foreground text-xl text-center md:text-left md:text-3xl font-bold mx-auto md:mx-0 max-w-xl ">
            {heading}
          </motion.h2>
          <p className="max-w-md mt-8 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-muted-foreground">
            {sub_heading}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {CTAs &&
            CTAs.map((cta, index) => (
              <Button
                as={Link}
                key={index}
                href={`/${locale}${cta.URL}`}
                variant={cta.variant}
                className="flex flex-row gap-1"
              >
                <StrapiImage src={cta.image?.url} alt={cta.image?.alternativeText} width={30} height={30}></StrapiImage>
                {cta.text}
              </Button>
            ))}
        </div>
      </Container>
    </div>
  );
};
