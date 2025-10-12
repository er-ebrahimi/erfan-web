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
    <div className="mt-8 flex justify-center">
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
      className=" "
    >
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {item.title}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            {item.description}
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={item.icon}
              height={1000}
              width={1000}
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            {item.Buttons.map((x: any, index: number) => (
              <CardItem
                key={`${x.label}-${index}`}
                translateZ={20}
                as="button"
                variant={x.variant}
                className={
                  x.variant === 'simple'
                    ? 'px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold'
                    : x.variant === 'outline'
                      ? 'px-4 py-2 rounded-xl text-xs font-normal dark:text-white'
                      : ''
                }
                onClick={() => {
                  router.push(x.Link);
                }}
              >
                {x.text}
              </CardItem>
            ))}
          </div>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}
//
//   <div
//     className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity ${
//       isHover
//         ? "opacity-100 bg-gradient-to-br from-white/10 via-transparent to-transparent"
//         : "opacity-0"
//     }`}
//   />

//   <div className="flex items-center space-x-4 z-10 relative flex-col gap-4">
//     {/* image slot - expect consumer to pass a Next/Image node or similar */}
//     <div className="w-28 h-28 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
//       {item.icon}
//     </div>
//     <div className="text-4xl md:text-2xl font-bold text-neutral-600">
//       {item.title}
//     </div>
//     <p className="text-center">{item.description}</p>
//   </div>
