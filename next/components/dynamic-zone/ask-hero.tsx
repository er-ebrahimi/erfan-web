'use client';

import { IconArrowRight, IconClipboardList } from '@tabler/icons-react';
import Link from 'next/link';
import { FormEvent, useCallback, useState } from 'react';

import { Container } from '@/components/container';
import { Button } from '@/components/elements/button';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { buildAiArchitectureUrl } from '@/lib/ai-architecture-url';
import { localizeHref } from '@/lib/url';
import { cn } from '@/lib/utils';

export type AskHeroSuggestion = {
  id?: number;
  text: string;
};

export const AskHero = ({
  eyebrow,
  heading,
  sub_heading,
  input_placeholder,
  submit_label,
  suggestions = [],
  questionnaire_label,
  questionnaire_url,
  projects_link_label,
  projects_link_url,
  locale,
}: {
  eyebrow?: string;
  heading?: string;
  sub_heading?: string;
  input_placeholder?: string;
  submit_label?: string;
  suggestions?: AskHeroSuggestion[];
  questionnaire_label?: string;
  questionnaire_url?: string;
  projects_link_label?: string;
  projects_link_url?: string;
  locale?: string;
}) => {
  const [prompt, setPrompt] = useState('');

  const placeholder =
    input_placeholder?.trim() || 'فضای‌تان را توصیف کنید…';
  const submitText = submit_label?.trim() || 'پرسش از هوش مصنوعی';

  const goToAi = useCallback(
    (value: string) => {
      const target = buildAiArchitectureUrl({
        prompt: value || undefined,
      });
      window.location.assign(target);
    },
    []
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToAi(prompt);
  };

  const questionnaireHref = questionnaire_url?.trim()
    ? questionnaire_url.startsWith('http')
      ? questionnaire_url
      : buildAiArchitectureUrl({ path: questionnaire_url })
    : buildAiArchitectureUrl({ path: 'questionnaire' });

  const projectsHref =
    projects_link_url && locale
      ? localizeHref(projects_link_url, locale)
      : projects_link_url
        ? localizeHref(projects_link_url, 'fa')
        : undefined;

  if (!heading && !sub_heading) {
    return null;
  }

  return (
    <section className="relative border-b border-border/60 bg-muted/30">
      <Container className="max-w-3xl py-16 md:py-20 text-center">
        {eyebrow && (
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {eyebrow}
          </p>
        )}
        {heading && (
          <Heading as="h1" size="xl" className="font-bold tracking-tight">
            {heading}
          </Heading>
        )}
        {sub_heading && (
          <Subheading className="mt-3 text-base text-muted-foreground max-w-2xl">
            {sub_heading}
          </Subheading>
        )}

        <form
          onSubmit={onSubmit}
          className={cn(
            'mt-10 flex flex-col sm:flex-row items-stretch gap-0',
            'rounded-2xl border border-border bg-card shadow-derek overflow-hidden',
            'focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/5 transition-shadow'
          )}
        >
          <input
            type="text"
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 border-0 bg-transparent px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/70 outline-none text-right"
            dir="rtl"
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="primary"
            className="rounded-none sm:rounded-none px-6 py-4 h-auto text-sm font-semibold gap-2 shrink-0"
          >
            {submitText}
            <IconArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </form>

        {suggestions.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {suggestions.map((chip, index) => (
              <button
                key={chip.id ?? `suggestion-${index}`}
                type="button"
                onClick={() => {
                  setPrompt(chip.text);
                  goToAi(chip.text);
                }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground shadow-derek hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                {chip.text}
              </button>
            ))}
          </div>
        )}

        {(questionnaire_label || projects_link_label) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {questionnaire_label && (
              <Button
                as={Link}
                href={questionnaireHref}
                variant="outline"
                className="gap-2 rounded-full px-5 shadow-derek"
              >
                <IconClipboardList className="h-4 w-4" aria-hidden />
                {questionnaire_label}
              </Button>
            )}
            {projects_link_label && projectsHref && (
              <Link
                href={projectsHref}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
              >
                {projects_link_label}
              </Link>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};
