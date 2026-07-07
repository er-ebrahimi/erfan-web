import Link from 'next/link';

import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '../ui/strapi-image';
import { cn } from '@/lib/utils';
import { localizeHref } from '@/lib/url';

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  Background,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
  Background?: any[];
}) => {
  const backgroundImage = Background?.[0];

  return (
    <div className="h-[calc(100vh-1rem)] m-2 rounded-3xl dark:h-screen dark:m-0 dark:rounded-none overflow-hidden bg-background relative flex flex-col items-center justify-center bg-black">
      <div>
        {backgroundImage ? (
          <>
            <StrapiImage
              src={backgroundImage.url}
              alt={backgroundImage.alternativeText || 'Hero Background'}
              fill
              className="object-cover brightness-[0.6]"
              // loading="lazy"
              sizes='100vw'
            />
            <div className="absolute inset-0 bg-background/70" />
          </>
        ) : (
          <>
            <StarBackground />
            <ShootingStars />
          </>
        )}
      </div>
      <Heading
        as="h1"
        className={cn("text-4xl md:text-4xl lg:text-6xl text-foreground font-semibold max-w-7xl mx-auto text-center mt-6 relative z-10  py-6 text-white", "!leading-relaxed")}
      >
        {heading}
      </Heading>
      <Subheading className="text-center mt-2  dark:text-gray-200 text-lg md:mt-6 md:text-xl max-w-3xl mx-auto relative z-10 text-white px-3">
        {sub_heading}
      </Subheading>
      <div className="flex space-x-2 items-center mt-8">
        {CTAs &&
          CTAs.map((cta) => (
            <Button
              key={cta?.id}
              as={Link}
              href={localizeHref(cta.URL, locale)}
              {...(cta.variant && { variant: cta.variant })}
            >
              {cta.text}
            </Button>
          ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-background to-transparent hidden dark:block" />
    </div>
  );
};
