import Image from 'next/image';
import React from 'react';

import { Timeline } from '@/components/ui/timeline';

const getImageUrl = (pic: any) => {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  if (!pic) return '/next.svg';

  // Support multiple possible shapes returned by Strapi or other APIs:
  // - pic.formats.large.url
  // - pic.attributes.formats.large.url
  // - pic.data.attributes.formats.large.url
  // - pic.url
  const attrs = pic?.attributes ?? pic?.data?.attributes ?? pic;

  const path =
    attrs?.formats?.large?.url ??
    attrs?.formats?.medium?.url ??
    attrs?.formats?.small?.url ??
    attrs?.url;

  if (!path || typeof path !== 'string') return '/next.svg';

  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return base + path;
  return base + '/' + path;
};

interface PlanItem {
  Title: string;
  Description: string;
  Pictures?: any[] | { data?: any[] };
}

interface PlansProps {
  Title: string;
  Description: string;
  Plan: PlanItem[];
  locale?: string;
}

const Plans: React.FC<PlansProps> = ({ Title, Description, Plan, locale }) => {
  const isRTL = locale === 'fa' || locale === 'ar';

  return (
    <section className="w-full py-32 px-4 bg-background">
      <div
        className={`max-w-4xl mx-auto text-center mb-12`}
      >
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 text-foreground ${isRTL ? 'font-iran-sans' : ''}`}
        >
          {Title}
        </h2>
        <p
          className={`text-lg md:text-xl text-muted-foreground ${isRTL ? 'font-iran-sans' : ''}`}
        >
          {Description}
        </p>
      </div>
      <Timeline
        locale={locale}
        data={Plan.map((item) => ({
          title: item.Title,
          content: (
            <div
              className={`flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`text-base md:text-lg text-muted-foreground mb-2 ${isRTL ? 'font-iran-sans' : ''}`}
              >
                {item.Description}
              </div>

              {/* Normalize pictures whether they are an array or nested under data */}
              {(() => {
                const pictures = Array.isArray(item.Pictures)
                  ? item.Pictures
                  : (item.Pictures?.data ?? []);
                if (!pictures || pictures.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-4 mt-2 justify-center">
                    {pictures.map((pic: any, idx: number) => (
                      <Image
                        key={idx}
                        src={getImageUrl(pic)}
                        alt={item.Title + ' image ' + (idx + 1)}
                        className="w-64 h-64 object-cover rounded-lg border border-border"
                        width={500}
                        height={500}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/next.svg';
                        }}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          ),
        }))}
      />
    </section>
  );
};

export default Plans;
