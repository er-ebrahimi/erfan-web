'use client';

import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
  /** When true the modal overlay and card labels render RTL. Defaults to true to preserve existing behaviour. */
  isRTL?: boolean;
}

type Card = {
  src?: string;
  visual?: React.ReactNode;
  title: string;
  category: string;
  content: React.ReactNode;
  link?: string;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
  isRTL: boolean;
}>({
  onCardClose: () => {},
  currentIndex: 0,
  isRTL: true,
});

export const Carousel = ({ items, initialScroll = 0, isRTL = true }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    // Use rAF so scrollWidth is computed after first paint.
    // dir="ltr" on the scroll container normalises scroll coords (0=left, max=right).
    // For RTL carousels we start at max so the first card (rightmost) is visible.
    // setTimeout(0) defers until after Framer Motion init and Strict Mode double-mount.
    // Direct scrollLeft= fails in RTL parent contexts; scrollTo() works.
    const id = setTimeout(() => {
      el.scrollTo({ left: isRTL ? el.scrollWidth - el.clientWidth : initialScroll, behavior: 'instant' });
      checkScrollability();
    }, 0);
    return () => clearTimeout(id);
  }, [initialScroll, isRTL]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex, isRTL }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
          dir="ltr"
        >
          <div
            className="flex flex-row gap-4 px-10"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: 'easeOut',
                  },
                }}
                key={'card' + index}
                className="rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            title="Scroll left"
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            title="Scroll right"
          >
            <IconArrowNarrowRight className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex, isRTL } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    if (card.link) {
      // If there's a link, navigate to it
      window.open(card.link, '_blank');
    } else {
      // If no link, open the modal
      setOpen(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className={cn('fixed inset-0 z-50 h-screen overflow-auto', isRTL ? 'dir-rtl' : 'dir-ltr')} dir={isRTL ? 'rtl' : 'ltr'}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
                aria-label="Close"
                title="Close"
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.category}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-neutral-100 md:h-[40rem] md:w-96 dark:bg-neutral-900"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className={cn('font-sans text-sm font-medium text-white md:text-base', isRTL ? 'text-right' : 'text-left')}
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className={cn('mt-2 max-w-xs font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl', isRTL ? 'text-right' : 'text-left')}
          >
            {card.title}
          </motion.p>
        </div>
        {card.visual ? (
          <div className="absolute inset-0 z-10">{card.visual}</div>
        ) : (
          <BlurImage
            src={card.src ?? ''}
            alt={card.title}
            fill
            className="absolute inset-0 z-10 object-cover"
          />
        )}
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  return (
    <Image
      className={cn('h-full w-full', className)}
      src={src as string}
      width={width}
      height={height}
      loading="eager"
      decoding="async"
      alt={alt ? alt : 'Background of a beautiful view'}
      {...rest}
    />
  );
};
