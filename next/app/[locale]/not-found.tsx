import { Metadata } from 'next';
import { NotFound } from '@/components/not-found';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.",
};

export default function RootNotFound() {
  return (
      <NotFound />
  );
}
