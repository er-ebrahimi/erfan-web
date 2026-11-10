'use client';

import { motion, useReducedMotion } from 'framer-motion';

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export const Spotlight = ({
  gradientFirst = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, color-mix(in oklch, var(--primary) 22%, transparent) 0, color-mix(in oklch, var(--primary) 8%, transparent) 50%, transparent 80%)',
  gradientSecond = 'radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--primary) 14%, transparent) 0, color-mix(in oklch, var(--primary) 5%, transparent) 80%, transparent 100%)',
  gradientThird = 'radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--primary) 10%, transparent) 0, color-mix(in oklch, var(--primary) 4%, transparent) 80%, transparent 100%)',
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  const reducedMotion = useReducedMotion();

  const sway = { x: reducedMotion ? 0 : [0, xOffset, 0] };

  const swayTransition = {
    duration,
    repeat: reducedMotion ? 0 : Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.div
        animate={sway}
        transition={swayTransition}
        className="pointer-events-none absolute start-0 top-0 z-0 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute start-0 top-0"
        />

        <div
          style={{
            transform: 'rotate(-45deg) translate(5%, -50%)',
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute start-0 top-0 origin-top-left rtl:origin-top-right"
        />

        <div
          style={{
            transform: 'rotate(-45deg) translate(-180%, -70%)',
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute start-0 top-0 origin-top-left rtl:origin-top-right"
        />
      </motion.div>

      <motion.div
        animate={{ x: reducedMotion ? 0 : [0, -xOffset, 0] }}
        transition={swayTransition}
        className="pointer-events-none absolute end-0 top-0 z-0 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute end-0 top-0"
        />

        <div
          style={{
            transform: 'rotate(45deg) translate(-5%, -50%)',
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute end-0 top-0 origin-top-right rtl:origin-top-left"
        />

        <div
          style={{
            transform: 'rotate(45deg) translate(180%, -70%)',
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute end-0 top-0 origin-top-right rtl:origin-top-left"
        />
      </motion.div>
    </motion.div>
  );
};
