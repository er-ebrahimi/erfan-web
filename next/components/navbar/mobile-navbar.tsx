'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useState } from 'react';
import { IoIosMenu } from 'react-icons/io';
import { IoIosClose } from 'react-icons/io';

import { LocaleSwitcher } from '../locale-switcher';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '@/components/elements/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { localizeHref } from '@/lib/url';

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  return (
    <div
      className={cn(
        'flex justify-between bg-card/80 backdrop-blur-sm border border-border/50 items-center w-full rounded-md px-2.5 py-1.5 transition duration-200',
        showBackground && ' bg-card border border-border shadow-lg'
      )}
    >
      <Logo image={logo?.image} />

      <IoIosMenu
        className="text-foreground h-6 w-6"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col items-start justify-start space-y-10  pt-5  text-xl text-muted-foreground  transition duration-200 hover:text-foreground">
          <div className="flex items-center justify-between w-full px-5">
            <Logo locale={locale} image={logo?.image} />
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LocaleSwitcher />
              <IoIosClose
                className="h-8 w-8 text-foreground"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {leftNavbarItems.map((navItem: any, idx: number) => (
              <>
                {navItem.children && navItem.children.length > 0 ? (
                  <>
                    {navItem.children.map((childNavItem: any, idx: number) => (
                      <Link
                        key={`link=${idx}`}
                        href={localizeHref(childNavItem.URL, locale)}
                        onClick={() => setOpen(false)}
                        className="relative max-w-[15rem] text-left text-2xl"
                      >
                        <span className="block text-foreground">
                          {childNavItem.text}
                        </span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    key={`link=${idx}`}
                    href={localizeHref(navItem.URL, locale)}
                    onClick={() => setOpen(false)}
                    className="relative"
                  >
                    <span className="block text-[26px] text-foreground">
                      {navItem.text}
                    </span>
                  </Link>
                )}
              </>
            ))}
          </div>
          <div className="flex flex-row w-full items-start gap-2.5  px-8 py-4 ">
            {rightNavbarItems.map((item, index) => (
              <Button
                key={item.text}
                variant={
                  index === rightNavbarItems.length - 1 ? 'primary' : 'simple'
                }
                as={Link}
                href={localizeHref(item.URL, locale)}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
