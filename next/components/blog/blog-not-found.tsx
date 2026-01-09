'use client';
import 'next-intl';
import { useLocale, useTranslations } from 'next-intl';
import { Container } from '../container';
import { cn } from '@/lib/utils';
export default function BlogNotFound() {
  const locale = useLocale();
  const t = useTranslations('common');
  return <Container className='flex justify-center h-screen items-center'>{t('blog-not-found')}</Container>;
}
