'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { AmbientColor } from '../decorations/ambient-color';
import { Button } from '../elements/button';
import { StrapiImage } from '../ui/strapi-image';
import { useLocaleConfig } from '@/hooks/use-locale-config';
import { localizeHref } from '@/lib/url';
import { cn } from '@/lib/utils';

export const CTA = ({ CTAs, locale }: { CTAs: any[]; locale: string }) => {
  let localeConfig = useLocaleConfig();
  return (
    <div className="relative">
      {/* <AmbientColor /> */}
      <Container className="py-0 pt-0">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            <div
              className={cn(
                'flex flex-col justify-between items-center w-full pb-2'
              )}
            >
              <div className="flex items-center gap-4 mt-8 md:mt-0">
                {CTAs &&
                  CTAs.map((cta, index) => (
                    <Button
                      as={Link}
                      key={index}
                      href={localizeHref(cta.URL, locale)}
                      variant={cta.variant}
                      className="flex flex-row gap-1"
                      target={cta.target}
                    >
                      <StrapiImage
                        src={cta.image?.url}
                        alt={cta.image?.alternativeText}
                        width={30}
                        height={30}
                      ></StrapiImage>
                      {cta.text}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
