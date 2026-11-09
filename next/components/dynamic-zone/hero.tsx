import Link from 'next/link';

import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '../ui/strapi-image';
import { localizeHref } from '@/lib/url';
import { cn } from '@/lib/utils';

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
    <div className="relative">
      {/* Ambient glow: sits behind the masked image, so the photo dissolves into its own colors */}
      {backgroundImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-96 overflow-hidden dark:hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 40%, rgba(0, 0, 0, 0.5) 70%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 40%, rgba(0, 0, 0, 0.5) 70%, transparent)',
          }}
        >
          <StrapiImage
            src={backgroundImage.url}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom blur-2xl saturate-150"
          />
        </div>
      )}
      <div
        className={cn(
          ' h-[115vh] dark:m-0 dark:rounded-none overflow-hidden relative flex flex-col items-center justify-center',
          !backgroundImage && 'bg-black'
        )}
      >
        <div className="absolute inset-0 overflow-hidden">
          {backgroundImage ? (
            <>
              <StrapiImage
                src={backgroundImage.url}
                alt={backgroundImage.alternativeText || 'Hero Background'}
                fill
                className="object-cover brightness-[0.6] [mask-image:linear-gradient(to_bottom,black_82%,rgba(0,0,0,0.6)_91%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,rgba(0,0,0,0.6)_91%,transparent)] dark:[mask-image:none] dark:[-webkit-mask-image:none]"
                // loading="lazy"
                sizes="100vw"
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
          className={cn(
            'text-4xl md:text-4xl lg:text-6xl text-foreground font-semibold max-w-7xl mx-auto text-center mt-6 relative z-10  py-6 text-white',
            '!leading-relaxed'
          )}
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
        {/* <div className="absolute inset-x-0 bottom-0 h-20 w-full bg-gradient-to-t from-background to-transparent  dark:hidden" /> */}
      </div>
    </div>
  );
};
