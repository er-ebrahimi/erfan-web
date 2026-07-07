'use client';

import Image from 'next/image';
import React from 'react';

import {
  DraggableCardBody,
  DraggableCardContainer,
} from '@/components/ui/draggable-card';
import { getBestFormat, getStrapiMedia } from '@/components/ui/strapi-image';

interface PicItem {
  Name: string;
  Image: any;
  ClassName: string;
  Rotate: string;
  Right: string;
  Top: string;
}

interface ProjectPicturesProps {
  Title: string;
  Description: string;
  Pics: PicItem[];
}

const ProjectPictures: React.FC<ProjectPicturesProps> = ({
  Title,
  Description,
  Pics,
}) => {
  return (
    <section className="w-full py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {Title}
        </h2>
      </div>
      <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
        <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-bold text-muted-foreground md:text-4xl">
          {Description}
        </p>
          {Pics.map((item) => {
          const img = item.Image?.[0];
          const best = img ? getBestFormat(img) : null;
          return (
            <DraggableCardBody
              key={item.Name}
              className="absolute"
              style={{
                rotate: item.Rotate + 'deg',
                right: 50 - parseFloat(item.Right) + '%',
                top: item.Top + 'rem',
              }}
            >
              {best && (
                <Image
                  src={getStrapiMedia(best.url)!}
                  alt={item.Name}
                  className="pointer-events-none relative z-10 h-80 w-80 object-cover"
                  width={best.width}
                  height={best.height}
                  sizes="320px"
                  loading="lazy"
                />
              )}
              <h3 className="mt-4 text-center text-2xl font-bold text-foreground">
                {item.Name}
              </h3>
            </DraggableCardBody>
          );
        })}
      </DraggableCardContainer>
    </section>
  );
};

export default ProjectPictures;
