import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

import { NotFound } from '@/components/not-found';
import enMessages from '@/messages/en.json';

export const metadata: Metadata = {
  title: 'Page Not Found | ErfanWeb',
  description:
    "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.",
};

export default function RootNotFound() {
  return (
      <NotFound />
  );
}
