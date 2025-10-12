'use client';

import React from 'react';
import { MdCancel } from 'react-icons/md';

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

  return (
    <div
      className={`flex flex-col gap-12 ${isRTL ? 'rtl text-right' : 'ltr text-left'} justify-center items-center mx-8 py-32 bg-background`}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-bold text-foreground">{Title}</h1>
        <p className="text-muted-foreground text-base">{Description}</p>
      </div>
      <div
        className={`flex flex-col gap-12 ${isRTL ? 'rtl text-right' : 'ltr text-left'} max-w-5xl`}
      >
        {Cons.map((con, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className="text-red-500 text-4xl shrink-0">
              <MdCancel />
            </div>
            <div>
              <div className="font-bold text-xl mb-2 text-foreground">
                {con.Title}
              </div>
              <div className="text-muted-foreground text-base">
                {con.Description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cons;
