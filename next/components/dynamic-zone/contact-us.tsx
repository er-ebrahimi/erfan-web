'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import 'altcha';

import type { AltchaWidgetElement } from 'altcha/types/generic';

import type { } from 'altcha/types/react';

const faI18n = {
  ariaLinkLabel: 'Altcha (وبسایت رسمی)',
  enterCode: 'کد را وارد کنید',
  enterCodeAria: 'کدی را که می‌شنوید وارد کنید. برای پخش صدا space را بزنید.',
  error: 'تأیید امنیتی ناموفق بود. دوباره تلاش کنید.',
  expired: 'اعتبار تأیید منقضی شد. دوباره تلاش کنید.',
  footer:
    'محافظت شده توسط <a href="https://altcha.org/" tabindex="-1" target="_blank" aria-label="Altcha (وبسایت رسمی)">ALTCHA</a>',
  getAudioChallenge: 'دریافت چالش صوتی',
  label: 'من ربات نیستم',
  loading: 'در حال بارگذاری...',
  reload: 'بارگذاری مجدد',
  verify: 'تأیید',
  verificationRequired: 'تأیید امنیتی الزامی است!',
  verified: 'تأیید شد',
  verifying: 'در حال تأیید...',
  waitAlert: 'در حال تأیید... لطفاً صبر کنید.',
  cancel: 'لغو',
  enterCodeFromImage: 'برای ادامه، کد تصویر زیر را وارد کنید.',
};

function AltchaWidget({
  widgetRef,
  locale,
}: {
  widgetRef: React.RefObject<HTMLElement | null>;
  locale: string;
}) {
  const isClient = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  useEffect(() => {
    if (locale === 'fa') {
      const $altcha = (globalThis as any).$altcha;
      if ($altcha?.i18n && !$altcha.i18n.store.fa) {
        $altcha.i18n.set('fa', faI18n);
      }
    }
  }, [locale]);

  if (!isClient) {
    return <div className="h-16" />;
  }

  return (
    <altcha-widget
      ref={widgetRef}
      challenge="/api/altcha/challenge"
      auto="onload"
      name="altcha"
      language={locale === 'fa' ? 'fa' : 'en'}
      className="w-full max-w-xs"
    />
  );
}

const ContactUs = ({
  Title,
  Description,
}: {
  Title: string;
  Description: string;
}) => {
  const [formData, setFormData] = useState({
    contact: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const widgetRef = useRef<HTMLElement>(null);

  const t = useTranslations('contact');
  const locale = useLocale();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getAltchaPayload = (): string | undefined => {
    const widget = widgetRef.current as AltchaWidgetElement | null;
    if (!widget || widget.getState() !== 'verified') {
      return undefined;
    }
    return (
      widget.querySelector<HTMLInputElement>('input[type="hidden"]')?.value ??
      undefined
    );
  };

  const sendContactForm = async (
    contact: string,
    message: string,
    altchaPayload: string
  ) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact,
          message,
          altcha: altchaPayload,
          locale,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: result.message };
      } else {
        return {
          success: false,
          message: result.message || t('sendError'),
        };
      }
    } catch (error) {
      return {
        success: false,
        message: t('sendError'),
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contact.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: t('fillFieldsError'),
      });
      return;
    }

    const altchaPayload = getAltchaPayload();
    if (!altchaPayload) {
      setSubmitStatus({
        type: 'error',
        message: t('captchaError'),
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await sendContactForm(
        formData.contact,
        formData.message,
        altchaPayload
      );

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        setFormData({ contact: '', message: '' });
        const widget = widgetRef.current as AltchaWidgetElement | null;
        widget?.reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('sendError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 flex justify-center items-center">
      <div className="container border border-border rounded-xl p-12 w-full shadow-lg bg-card">
        <div className="max-w-lg text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {Title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {Description}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg rounded-xl flex flex-col gap-6"
        >
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg text-center ${submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700'
                : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700'
                }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact"
              className="text-sm font-medium text-foreground"
            >
              {t('contactLabel')}
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              required
              value={formData.contact}
              onChange={handleInputChange}
              placeholder={t('contactPlaceholder')}
              className="rounded-lg p-3 bg-background text-foreground border border-input focus:ring-2 focus:ring-ring focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              {t('messageLabel')}
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('messagePlaceholder')}
              rows={5}
              className="rounded-lg p-3 bg-background text-foreground border border-input focus:ring-2 focus:ring-ring focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex justify-center">
            <AltchaWidget widgetRef={widgetRef} locale={locale} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('submittingButton') : t('submitButton')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
