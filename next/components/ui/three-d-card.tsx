'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

type CardItem = {
  icon: string;
  content: React.ReactNode;
  title?: string;
  description?: string;
  Buttons: { text: string; variant?: string; Link: string; label: string }[];
};

export const ThreeDCard = ({ items }: { items: CardItem[] }) => {
  const router = useRouter();

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl gap-4 m-auto">
      {items.map((item, idx) => (
        <TiltCard key={idx} item={item} router={router} />
      ))}
    </div>
  );
};

function TiltCard({ item, router }: { item: CardItem; router: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 200, damping: 30 });
  const rotateY = useSpring(x, { stiffness: 200, damping: 30 });
  const [isHover, setIsHover] = useState(false);

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const ry = (px - 0.5) * 20; // rotateY
        const rx = (0.5 - py) * 20; // rotateX
        x.set(ry);
        y.set(rx);
      }}
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => {
        setIsHover(false);
        x.set(0);
        y.set(0);
      }}
      style={
        {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
        } as any
      }
      className="h-full flex flex-col"
    >
      <CardContainer className="inter-var m-4 w-full" containerClassName="items-stretch h-full">
        <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] dark:bg-card dark:border-border border-border w-full h-full flex flex-col rounded-xl p-6 border  ">
          <CardItem translateZ="100" className="w-full">
            <Image
              src={item.icon}
              height={1000}
              width={1000}
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <CardItem
            translateZ="50"
            className="pt-5 text-xl font-bold text-foreground"
          >
            {item.title}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-muted-foreground text-sm max-w-sm mt-2 flex-1"
          >
            {item.description}
          </CardItem>

          <div className="flex justify-between items-center mt-4">
            {item.Buttons.map((item: any, index: number) => {
              return <CardItem
                key={`${item.label}-${index}`}
                translateZ={20}
                as="button"
                variant={item.variant}
                className={
                  item.variant === 'simple'
                    ? 'px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold'
                    : item.variant === 'outline'
                      ? 'px-4 py-2 rounded-xl text-xs font-normal text-foreground'
                      : ''
                }
                onClick={() => {
                  router.push(item.URL);
                }}
              >
                {item.text}
              </CardItem>
            })}
          </div>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}