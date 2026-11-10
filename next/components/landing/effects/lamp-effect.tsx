'use client';

import React from 'react';

import { cn } from '@/lib/utils';

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'relative flex w-full flex-col items-center justify-center overflow-visible',
      className
    )}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-visible"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full md:size-[56rem]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--primary) 20%, transparent) 0%, color-mix(in oklch, var(--primary) 8%, transparent) 35%, color-mix(in oklch, var(--primary) 2%, transparent) 55%, transparent 70%)',
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full md:size-[34rem]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--primary) 28%, transparent) 0%, color-mix(in oklch, var(--primary) 12%, transparent) 35%, color-mix(in oklch, var(--primary) 2%, transparent) 55%, transparent 70%)',
        }}
      />
    </div>

    <div className="relative z-10 flex flex-col items-center text-center">
      {children}
    </div>
  </div>
);

export const Lamp = LampContainer;
