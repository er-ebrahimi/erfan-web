'use client';

import React from 'react';

import { Carousel } from '@/components/ui/apple-cards-carousel';
import { Card } from '@/components/ui/apple-cards-carousel';
import { getBestFormat, getStrapiMedia } from '@/components/ui/strapi-image';
import { useLocaleConfig } from '@/hooks/use-locale-config';

interface PromiseItem {
  Subtitle: string;
  SubSubtitle: string;
  Pic: any;
  Link?: string;
  Description: string;
}

interface PromisedLandProps {
  Title: string;
  Description: string;
  Promise: PromiseItem[];
}

const PromisedLand: React.FC<PromisedLandProps> = ({
  Title,
  Description,
  Promise,
}) => {
  const { fontClass, direction } = useLocaleConfig();
  const cards = Promise.map((card, index) => {
    const best = card.Pic ? getBestFormat(card.Pic) : null;
    return (
    <Card
      key={card.Link}
      card={{
        title: card.Subtitle,
        src: best ? getStrapiMedia(best.url)! : '/next.svg',
        category: card.SubSubtitle,
        content: card.Description,
        link: card.Link,
      }}
      index={index}
    />
  )});
  return (
    <div
      className="w-full h-full my-32 flex justify-center flex-col items-center"
      dir="ltr"
    >
      <div
        dir={direction}
        className="mx-8 flex justify-center flex-col items-center max-w-4xl gap-4"
      >
        <h2 className={`max-w-7xl pl-4 mx-auto text-2xl md:text-4xl font-bold text-foreground text-center ${fontClass}`}>
          {Title}
        </h2>
        <p className={`max-w-7xl pt-4 pl-4 mx-auto text-sm md:text-base text-muted-foreground text-center ${fontClass}`}>
          {Description}
        </p>
      </div>
      <Carousel items={cards} />
    </div>
  );
};

export default PromisedLand;
