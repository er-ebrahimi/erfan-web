'use client';

import React from 'react';
import { MdCancel } from 'react-icons/md';

import { AmbientColor } from '@/components/decorations/ambient-color';

interface ConItem {
  Title: string;
  Description: string;
}

interface ConsProps {
  Cons: ConItem[];
  Title: string;
  Description: string;
  locale?: string;
}

const Cons: React.FC<ConsProps> = ({ Cons, Title, Description, locale }) => {
  const isRTL = locale === 'fa' || locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="relative">
      <AmbientColor />
      <div
        dir={direction}
        className={`relative z-10 flex flex-col gap-12 ${isRTL ? 'text-right' : 'text-left'} justify-center items-center mx-4 md:mx-8 py-16 md:py-32 bg-background`}
      >
      <div className="flex flex-col gap-2 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{Title}</h2>
        <p className="text-muted-foreground text-base md:text-lg">{Description}</p>
      </div>
      <div
        className={`flex flex-col gap-8 md:gap-12 w-full max-w-5xl`}
      >
        {Cons.map((con, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 md:gap-6"
          >
            <div className="text-red-500 text-3xl md:text-4xl shrink-0 mt-1">
              <MdCancel />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-lg md:text-xl mb-1 md:mb-2 text-foreground">
                {con.Title}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                {con.Description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Cons;
