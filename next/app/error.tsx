'use client';

import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Error500Client } from '@/components/error-500-client';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';
import faMessages from '@/messages/fa.json';

const messages = {
  en: enMessages,
  fr: frMessages,
  fa: faMessages,
};

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] as keyof typeof messages) || 'fa';
  const currentMessages = messages[locale] || messages['fa'];

  return (
    <NextIntlClientProvider locale={locale} messages={currentMessages}>
      <Error500Client onRetry={reset} />
    </NextIntlClientProvider>
  );
}
