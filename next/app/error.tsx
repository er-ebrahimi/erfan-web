'use client';

import { Error500Client } from '@/components/error-500-client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <Error500Client onRetry={reset} />;
}
