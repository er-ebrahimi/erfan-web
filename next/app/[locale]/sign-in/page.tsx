import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In | Your App',
  description: 'Sign in to your account to access your dashboard.',
};

export default async function SignInPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('welcomeBack')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('signInToContinue')}</p>
        </div>

        <LoginForm
          onSuccess={() => {
            // Redirect to dashboard after successful login
            redirect('/dashboard');
          }}
        />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/sign-up" className="text-primary hover:underline">
              {t('signUpHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
