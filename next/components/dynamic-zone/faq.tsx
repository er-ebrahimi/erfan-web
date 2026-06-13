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
    <div className={fontClass} dir={direction}>
      <JsonLd data={faqLd} />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconHelpHexagonFilled className="h-6 w-6 text-primary-foreground" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {heading}
          </Heading>
          {sub_heading && (
            <Subheading className="mt-4">{sub_heading}</Subheading>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20">
          {faqs &&
            faqs.map((faq: { question: string; answer: string }) => (
              <div key={faq.question}>
                <h4
                  className={cn(
                    'text-lg font-bold text-foreground',
                    isRTL && 'text-right font-iran-sans'
                  )}
                >
                  {faq.question}
                </h4>
                <p
                  className={cn(
                    'mt-4 text-muted-foreground',
                    isRTL && 'text-right font-iran-sans'
                  )}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
        </div>
      </Container>
    </div>
  );
};
