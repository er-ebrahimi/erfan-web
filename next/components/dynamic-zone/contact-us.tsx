'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

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
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Use next-intl for translations
  const t = useTranslations('contact');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cloudflare Turnstile callback
  const handleTurnstileCallback = (token: string) => {
    setTurnstileToken(token);
  };

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Check initial state
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Load Turnstile script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Add global callback function
    (window as any).handleTurnstileCallback = handleTurnstileCallback;

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
      // Clean up global callback
      delete (window as any).handleTurnstileCallback;
    };
  }, []);

  const sendContactForm = async (
    contact: string,
    message: string,
    token: string
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
          turnstileToken: token,
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

    if (!turnstileToken) {
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
        turnstileToken
      );

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        setFormData({ contact: '', message: '' });
        setTurnstileToken('');
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
      <div className="container border border-border rounded-xl p-12 w-fit shadow-lg bg-card">
        <div className="max-w-lg text-center">
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
              className={`p-4 rounded-lg text-center ${
                submitStatus.type === 'success'
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

          {/* Cloudflare Turnstile Widget */}

          <div className="flex justify-center">
            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAABoVMFyRhby1F6w1"
              data-callback="handleTurnstileCallback"
              data-theme={isDarkMode ? 'dark' : 'light'}
              data-language="en"
            ></div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !turnstileToken}
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
