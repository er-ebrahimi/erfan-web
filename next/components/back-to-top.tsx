'use client';

import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BackToTop() {
  const t = useTranslations('common');

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t('backToTop')}
    >
      <ArrowUp className="size-3.5" />
    </button>
  );
}
