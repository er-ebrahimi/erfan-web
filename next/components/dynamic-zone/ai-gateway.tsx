'use client';

import Link from 'next/link';

import { Container } from '@/components/container';
import { Button } from '@/components/elements/button';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import {
  getAiArchitectureBaseUrl,
  resolveAiProductHref,
} from '@/lib/ai-architecture-url';

export type AiGatewayLink = {
  id?: number;
  text?: string;
  URL?: string;
  target?: string;
};

export const AiGateway = ({
  heading,
  sub_heading,
  primary_cta_label,
  action_links = [],
}: {
  heading?: string;
  sub_heading?: string;
  primary_cta_label?: string;
  action_links?: AiGatewayLink[];
}) => {
  const entryLabel = primary_cta_label?.trim() || 'ورود به محصول';
  const entryHref = getAiArchitectureBaseUrl();

  if (!heading && !sub_heading) {
    return null;
  }

  return (
    <section className="bg-[#08090a] text-[#f7f7f7]">
      <Container className="py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="text-center lg:text-start">
            {heading && (
              <Heading
                as="h2"
                size="md"
                className="text-[#f7f7f7] font-bold tracking-tight mx-0 text-center lg:text-start"
              >
                {heading}
              </Heading>
            )}
            {sub_heading && (
              <Subheading
                className="mt-3 text-[#f7f7f7]/65 text-base max-w-xl mx-0 text-center lg:text-start"
              >
                {sub_heading}
              </Subheading>
            )}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <Button
                as={Link}
                href={entryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f7f7f7] text-[#08090a] hover:bg-white border-[#f7f7f7] rounded-lg px-5"
              >
                {entryLabel}
              </Button>
              {action_links.map((link, index) => {
                const label = link.text?.trim();
                if (!label) return null;
                const href = resolveAiProductHref(link.URL);
                const external = href.startsWith('http');
                return (
                  <Button
                    key={link.id ?? `ai-gateway-link-${index}`}
                    as={Link}
                    href={href}
                    target={link.target || (external ? '_blank' : undefined)}
                    rel={
                      link.target === '_blank' || external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    variant="outline"
                    className="rounded-lg border-[#f7f7f7]/30 bg-transparent text-[#f7f7f7] hover:bg-[#f7f7f7]/10 hover:text-[#f7f7f7]"
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 md:p-6 text-sm leading-relaxed"
            aria-hidden
          >
            <div className="flex gap-3 mb-3">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-white/10 grid place-items-center text-[10px] font-bold">
                AI
              </div>
              <p className="rounded-xl bg-white/[0.06] px-3 py-2 text-[#f7f7f7]/85">
                برای شروع، فضا، متراژ یا سبک دلخواه را بنویسید — مثلاً پذیرایی
                نئوکلاسیک ۲۵ متری.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <p className="rounded-xl bg-white/[0.12] px-3 py-2 text-[#f7f7f7]/90 max-w-[85%]">
                آشپزخانه مدرن برای آپارتمان ۱۱۰ متری با کابینت هایگلاس
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
