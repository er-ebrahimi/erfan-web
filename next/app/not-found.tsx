import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';

import { NotFound } from '@/components/not-found';
import { defaultLocale, locales } from '@/config';
import { notFoundMarkdown } from '@/lib/not-found-markdown';
import enMessages from '@/messages/en.json';
import faMessages from '@/messages/fa.json';
import frMessages from '@/messages/fr.json';

type Messages = typeof faMessages | typeof enMessages | typeof frMessages;

const messages: Record<string, Messages> = {
  en: enMessages,
  fa: faMessages,
  fr: frMessages,
};

export default async function RootNotFound() {
  const headersList = await headers();
  const accept = headersList.get('accept') || '';

  if (accept.includes('text/markdown')) {
    return (
      <main className="min-h-screen bg-background text-foreground p-8">
        <pre dir="ltr" className="whitespace-pre-wrap font-mono text-sm">
          {notFoundMarkdown()}
        </pre>
      </main>
    );
  }

  const rawLocale = await getLocale();
  const locale = locales.includes(rawLocale) ? rawLocale : defaultLocale;
  const currentMessages =
    messages[locale] ?? messages[defaultLocale] ?? faMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={currentMessages}>
      <NotFound />
    </NextIntlClientProvider>
  );
}
