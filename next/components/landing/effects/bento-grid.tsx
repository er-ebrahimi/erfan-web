'use client';

import React from 'react';

import { cn } from '@/lib/utils';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      'mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3',
      className
    )}
  >
    {children}
  </div>
);

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div
    className={cn(
      'group/bento flex flex-col justify-between gap-5 rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg',
      className
    )}
  >
    <div className="flex flex-1 flex-col justify-center">{header}</div>
    <div className="transition-transform duration-300 group-hover/bento:-translate-y-0.5">
      {icon}
      <div className="mb-1.5 mt-3 text-base font-bold text-foreground">
        {title}
      </div>
      <div className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {description}
      </div>
    </div>
  </div>
);
