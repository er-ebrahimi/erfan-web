'use client';

import React from 'react';

import { Carousel } from '@/components/ui/apple-cards-carousel';
import { Card } from '@/components/ui/apple-cards-carousel';

const getImageUrl = (pic: any) => {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (
    pic &&
    pic.formats &&
    pic.formats.large &&
    typeof pic.formats.large.url === 'string'
  ) {
    return url + pic.formats.large.url;
  }
  return '/next.svg'; // fallback image
};

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
  const cards = Promise.map((card, index) => (
    <Card
      key={card.Link}
      card={{
        title: card.Subtitle,
        src: getImageUrl(card.Pic),
        category: card.SubSubtitle,
        content: card.Description,
        link: card.Link,
      }}
      index={index}
    />
  ));
  return (
    <div
      className="w-full h-full my-32 flex justify-center flex-col items-center"
      dir="ltr"
    >
      <div
        dir="rtl"
        className="mx-8 flex justify-center flex-col items-center max-w-4xl gap-4"
      >
        <h2 className="max-w-7xl pl-4 mx-auto text-2xl md:text-4xl font-bold text-foreground font-sans text-center">
          {Title}
        </h2>
        <p className="max-w-7xl pt-4 pl-4 mx-auto text-sm md:text-base text-muted-foreground font-sans text-center">
          {Description}
        </p>
      </div>
      <Carousel items={cards} />
    </div>
  );
};

export default PromisedLand;
