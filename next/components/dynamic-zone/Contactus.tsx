'use client';

import React, { useEffect, useState } from 'react';

const Contactus = ({
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
      console.log('Sending contact form...');

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
        console.log('Contact form sent successfully:', result);
        return { success: true, message: result.message };
      } else {
        console.error('Failed to send contact form:', result);
        return {
          success: false,
          message:
            result.message || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
        };
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      return {
        success: false,
        message: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contact.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'لطفاً تمام فیلدها را پر کنید.',
      });
      return;
    }

    if (!turnstileToken) {
      setSubmitStatus({
        type: 'error',
        message: 'لطفاً تأیید کنید که ربات نیستید.',
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
        message: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-background rtl" dir="rtl">
      <div className="max-w-lg mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {Title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          {Description}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-card rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        {submitStatus.type && (
          <div
            className={`p-4 rounded-lg text-center ${
              submitStatus.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="flex flex-col gap-2 text-right">
          <label
            htmlFor="contact"
            className="text-sm font-medium text-foreground"
          >
            شماره تماس یا ایمیل
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            required
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="شماره تماس یا ایمیل خود را وارد کنید"
            className="rounded-lg p-3 bg-input text-foreground border-none focus:ring-2 focus:ring-ring focus:outline-none transition"
            dir="rtl"
          />
        </div>
        <div className="flex flex-col gap-2 text-right">
          <label
            htmlFor="message"
            className="text-sm font-medium text-foreground"
          >
            پیام
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleInputChange}
            placeholder="پیام خود را بنویسید"
            rows={5}
            className="rounded-lg p-3 bg-input text-foreground border-none focus:ring-2 focus:ring-ring focus:outline-none transition resize-none"
            dir="rtl"
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
          className="mt-4 w-full py-3 rounded-lg bg-secondary text-primary hover:bg-secondary-dark font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
        </button>
      </form>
    </section>
  );
};

export default Contactus;
