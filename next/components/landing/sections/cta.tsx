import Link from 'next/link';

import { toButtonVariant } from '../button-variant';
import { LampContainer } from '../effects/lamp-effect';
import type { LandingCtaProps } from '../types';
import { Button } from '@/components/ui/button';
import { localizeHref } from '@/lib/url';

export function LandingCta({
  heading,
  sub_heading,
  CTAs,
  locale,
}: LandingCtaProps) {
  if (!heading && !sub_heading && !CTAs?.length) return null;

  return (
    <section className="relative z-10 overflow-visible py-24 md:py-36">
      <LampContainer>
        <div className="mx-auto max-w-3xl px-4 text-center">
          {heading && (
            <h2 className="text-3xl font-extrabold leading-[1.5] text-foreground sm:text-4xl md:text-5xl">
              {heading}
            </h2>
          )}
          {sub_heading && (
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {sub_heading}
            </p>
          )}
          {CTAs && CTAs.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {CTAs.map((cta) =>
                cta?.text && cta.URL ? (
                  <Button
                    key={cta.id ?? cta.URL}
                    asChild
                    size="lg"
                    variant={toButtonVariant(cta.variant)}
                    className="px-8 text-base shadow-aceternity"
                  >
                    <Link href={localizeHref(cta.URL, locale)}>{cta.text}</Link>
                  </Button>
                ) : null
              )}
            </div>
          )}
        </div>
      </LampContainer>
    </section>
  );
}
