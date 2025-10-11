'use client';

import { useTranslations } from 'next-intl';

interface TranslatedTextProps {
  namespace: string;
  key: string;
  className?: string;
}

export function TranslatedText({
  namespace,
  key,
  className,
}: TranslatedTextProps) {
  const t = useTranslations(namespace);

  return <span className={className}>{t(key)}</span>;
}
