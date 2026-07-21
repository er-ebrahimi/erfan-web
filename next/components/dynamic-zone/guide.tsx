'use client';

import Image from 'next/image';
import React from 'react';

import { AmbientColor } from '@/components/decorations/ambient-color';

const getImageUrl = (profile: any) => {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (profile && typeof profile.url === 'string') {
    return url + profile.url;
  }
  return '/next.svg'; // fallback image
};

interface GuideProps {
  Title: string;
  Description: string;
  Profile: any;
}

const Guide: React.FC<GuideProps> = ({ Title, Description, Profile }) => {
  return (
    <section className="relative w-full bg-background py-32 px-4 rtl">
      <AmbientColor />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
        <div className="w-60 h-60 rounded-full overflow-hidden mb-8   shadow-lg">
          <Image
            src={getImageUrl(Profile)}
            alt="profile"
            className="object-cover w-full h-full"
            width={240}
            height={240}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/next.svg';
            }}
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          {Title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {Description}
        </p>
      </div>
    </section>
  );
};

export default Guide;
