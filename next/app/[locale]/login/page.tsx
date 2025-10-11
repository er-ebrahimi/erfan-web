import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { AuthFormsWithNavigation } from '@/components/auth/auth-forms-with-navigation';

export const metadata: Metadata = {
  title: 'Authentication | Your App',
  description: 'Sign in or create an account to access your dashboard.',
};

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('welcomeBack')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('signInDescription')}</p>
        </div>

        <AuthFormsWithNavigation />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t('agreementText')}{' '}
            <Link href="/terms" className="text-primary hover:underline">
              {t('termsOfService')}
            </Link>{' '}
            {t('and')}{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              {t('privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
