import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '@/types/types';

type CTA = {
  id: string;
  text: string;
  URL: string;
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
};

export const HeroPicture = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  background,
}: {
  heading: string;
  sub_heading: string;
  CTAs: CTA[];
  locale: string;
  background?: StrapiImage;
}) => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center">
      <div className="h-full w-full absolute inset-0 z-0">
        {background && background.formats && background.formats.large ? (
          <>
            <Image
              src={url + background.formats.large.url}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : null}
      </div>
      <Heading
        as="h1"
        className="text-3xl md:text-3xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-10 py-6 text-white"
      >
        {heading}
      </Heading>
      <Subheading className="text-center mt-2 md:mt-6 text-base md:text-xl text-white/90 max-w-3xl mx-auto relative z-10">
        {sub_heading}
      </Subheading>
      <div className="flex space-x-2 items-center mt-8">
        {CTAs &&
          CTAs.map((cta) => (
            <Button
              key={cta?.id}
              as={Link}
              href={`/${locale}${cta.URL}`}
              {...(cta.variant && { variant: cta.variant })}
              className="mx-2"
            >
              {cta.text}
            </Button>
          ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-slate-50 dark:from-charcoal to-transparent" />
    </div>
  );
};
