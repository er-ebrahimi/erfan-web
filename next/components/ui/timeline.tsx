'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  locale?: string;
}

export const Timeline = ({ data, locale }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const isRTL = locale === 'fa' || locale === 'ar';
  const dir: 'rtl' | 'ltr' = isRTL ? 'rtl' : 'ltr';
  return (
    <div
      className="w-full dark:bg-background  lg:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        <div
          style={{
            height: height + 'px',
          }}
          className={
            'absolute overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] ' +
            (dir === 'rtl'
              ? ' lg:right-8 right-8 top-0 '
              : ' lg:left-8 left-8 top-0 ')
          }
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-primary via-primary to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 lg:pt-40 lg:gap-10"
          >
            <div className="sticky flex flex-col lg:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm lg:w-full">
              <div
                className={`h-10 absolute w-10 rounded-full bg-background flex items-center justify-center ${
                  dir === 'rtl' ? 'right-3 lg:right-3' : 'left-3 lg:left-3'
                }`}
              >
                <div className="h-4 w-4 rounded-full bg-muted border border-border p-2" />
              </div>
              <h3
                className={
                  'hidden lg:block text-xl lg:text-5xl font-bold text-foreground text-right ' +
                  (dir === 'rtl' ? ' lg:pr-20 font-iran-sans ' : ' lg:pl-20 ')
                }
              >
                {item.title}
              </h3>
            </div>

            <div
              className={
                ' relative  w-full ' +
                (dir === 'rtl'
                  ? ' pr-20 pl-4 lg:pr-4 '
                  : ' pl-20 pr-4 lg:pl-4 ')
              }
              dir={dir}
            >
              <h3
                className={`lg:hidden block text-2xl mb-4 font-bold text-foreground ${
                  dir === 'rtl' ? 'font-iran-sans' : ''
                }`}
              >
                {item.title}
              </h3>
              {item.content}{' '}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
