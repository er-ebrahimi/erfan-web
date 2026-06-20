import { IconHelpHexagonFilled } from '@tabler/icons-react';

import { FeatureIconContainer } from './features/feature-icon-container';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { JsonLd } from '@/components/seo/json-ld';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  faqs: any[];
  locale: string;
}) => {
  const { isRTL, fontClass, direction } = getLocaleConfig(locale);

  const faqLd =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f: any) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <section className={cn('py-20 relative overflow-hidden', fontClass)} dir={direction}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-400/30 to-transparent" />
      <JsonLd data={faqLd} />
      <Container className="flex flex-col items-center justify-between">
        <div className="relative z-20 py-10 flex flex-col items-center text-center">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden mb-4">
            <IconHelpHexagonFilled className="h-6 w-6 text-primary-foreground" />
          </FeatureIconContainer>
          <Heading as="h2" className="mt-4">
            {heading}
          </Heading>
          {sub_heading && (
            <Subheading className="mt-4 max-w-2xl mx-auto">{sub_heading}</Subheading>
          )}
        </div>
        <div className="w-full max-w-4xl mx-auto divide-y divide-neutral-100 dark:divide-neutral-800 mt-4 mb-20">
          {faqs &&
            faqs.map((faq: { question: string; answer: string }) => (
              <div
                key={faq.question}
                className={cn(
                  'py-7 flex flex-col gap-3',
                  isRTL ? 'pr-4 border-r-2 border-indigo-500/30' : 'pl-4 border-l-2 border-indigo-500/30'
                )}
              >
                <h3
                  className={cn(
                    'text-base font-semibold text-foreground',
                    isRTL && 'text-right font-iran-sans'
                  )}
                >
                  {faq.question}
                </h3>
                <p
                  className={cn(
                    'text-sm leading-relaxed text-muted-foreground',
                    isRTL && 'text-right font-iran-sans'
                  )}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
        </div>
      </Container>
    </section>
  );
};
