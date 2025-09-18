'use client';

import Image from 'next/image';
import React from 'react';

import { Timeline } from '@/components/ui/timeline';

const getImageUrl = (pic: any) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
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

interface PlanItem {
  Title: string;
  Description: string;
  Picture: any[];
}

interface PlansProps {
  Title: string;
  Description: string;
  Plan: PlanItem[];
}

const Plans: React.FC<PlansProps> = ({ Title, Description, Plan }) => {
  return (
    <section className="w-full py-32 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {Title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          {Description}
        </p>
      </div>
      <Timeline
        data={Plan.map((item) => ({
          title: item.Title,
          content: (
            <div className="flex flex-col gap-4">
              <div className="text-base md:text-lg text-muted-foreground mb-2">
                {item.Description}
              </div>
              {item.Picture && item.Picture.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {item.Picture.map((pic, idx) => (
                    <Image
                      key={idx}
                      src={getImageUrl(pic)}
                      alt={item.Title + ' image ' + (idx + 1)}
                      className="w-32 h-32 object-cover rounded-lg border border-border"
                      width={128}
                      height={128}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/next.svg';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ),
        }))}
      />
    </section>
  );
};

export default Plans;
