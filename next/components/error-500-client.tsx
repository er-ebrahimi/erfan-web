'use client';

import Link from 'next/link';

import { Button } from '@/components/elements/button';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';

interface Error500ClientProps {
  onRetry?: () => void;
}

export function Error500Client({ onRetry }: Error500ClientProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Heading as="h1" className="text-6xl font-bold text-primary mb-4">
            500
          </Heading>
          <Heading as="h2" className="text-2xl font-semibold mb-4">
            Internal Server Error
          </Heading>
          <Subheading className="text-muted-foreground mb-8">
            Something went wrong on our end. We&apos;re working to fix this
            issue. Please try again later.
          </Subheading>
        </div>

        <div className="space-y-4">
          <Button as={Link} href="/" variant="primary" className="w-full">
            Go Home
          </Button>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="w-full">
              Try Again
            </Button>
          )}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>If this problem persists, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
