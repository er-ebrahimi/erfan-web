'use client';

import { Error500Client } from './error-500-client';
import { ErrorBoundary } from './error-boundary';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <Error500Client onRetry={resetError} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
