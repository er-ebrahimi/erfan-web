'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { Container } from '../container';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface LeadFormProps {
  heading: string;
  sub_heading?: string;
  reassurance?: string;
  locale: string;
}

interface FieldCopy {
  nameLabel: string;
  namePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  contactLabel: string;
  contactPlaceholder: string;
  needLabel: string;
  needPlaceholder: string;
  submit: string;
  submitting: string;
  requiredError: string;
  genericError: string;
}

const copyFor = (isRTL: boolean): FieldCopy =>
  isRTL
    ? {
        nameLabel: 'نام و نام خانوادگی',
        namePlaceholder: 'مثلاً علی رضایی',
        companyLabel: 'نام شرکت/سازمان (اختیاری)',
        companyPlaceholder: 'نام شرکت شما',
        contactLabel: 'ایمیل یا شماره تماس',
        contactPlaceholder: 'example@mail.com یا ۰۹۱۲…',
        needLabel: 'به چه چیزی نیاز دارید؟',
        needPlaceholder: 'کوتاه بنویسید چه مشکلی را می‌خواهید با هوش مصنوعی حل کنید.',
        submit: 'درخواست مشاوره‌ی رایگان',
        submitting: 'در حال ارسال…',
        requiredError: 'لطفاً نام، راه ارتباطی و توضیح نیاز را تکمیل کنید.',
        genericError: 'ارسال ناموفق بود. لطفاً دوباره تلاش کنید.',
      }
    : {
        nameLabel: 'Full name',
        namePlaceholder: 'e.g. Ali Rezaei',
        companyLabel: 'Company (optional)',
        companyPlaceholder: 'Your company',
        contactLabel: 'Email or phone',
        contactPlaceholder: 'example@mail.com or +98…',
        needLabel: 'What do you need?',
        needPlaceholder: 'Briefly describe the problem you want AI to solve.',
        submit: 'Request a free consultation',
        submitting: 'Sending…',
        requiredError: 'Please fill in your name, contact, and need.',
        genericError: 'Submission failed. Please try again.',
      };

export const LeadForm = ({
  heading,
  sub_heading,
  reassurance,
  locale,
}: LeadFormProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);
  const c = copyFor(isRTL);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    need: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.need.trim()
    ) {
      setStatus({ type: 'error', message: c.requiredError });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/ai-solutions-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ type: 'success', message: result.message });
        setFormData({ name: '', company: '', contact: '', need: '' });
      } else {
        setStatus({
          type: 'error',
          message: result.message || c.genericError,
        });
      }
    } catch {
      setStatus({ type: 'error', message: c.genericError });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = cn(
    'rounded-xl p-3 bg-background/80 text-foreground border border-input',
    'focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-none transition',
    isRTL ? 'text-right' : 'text-left'
  );

  return (
    <section
      className={cn('relative overflow-hidden py-24', fontClass)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Gradient background — matches the closing CTA treatment */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-background to-violet-950/40 dark:from-indigo-950/80 dark:via-background dark:to-violet-950/60" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/[0.06] dark:bg-indigo-500/[0.10] rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
          <div className="text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {heading}
            </motion.h2>
            {sub_heading && (
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                {sub_heading}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            {status.type && (
              <div
                className={cn(
                  'p-3 rounded-xl text-center text-sm',
                  status.type === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-200 border border-green-200 dark:border-green-700/60'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-700/60'
                )}
              >
                {status.message}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lead-name" className="text-sm font-medium text-foreground">
                  {c.nameLabel}
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={c.namePlaceholder}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lead-company" className="text-sm font-medium text-foreground">
                  {c.companyLabel}
                </label>
                <input
                  id="lead-company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={c.companyPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lead-contact" className="text-sm font-medium text-foreground">
                {c.contactLabel}
              </label>
              <input
                id="lead-contact"
                name="contact"
                type="text"
                required
                value={formData.contact}
                onChange={handleChange}
                placeholder={c.contactPlaceholder}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lead-need" className="text-sm font-medium text-foreground">
                {c.needLabel}
              </label>
              <textarea
                id="lead-need"
                name="need"
                required
                rows={4}
                value={formData.need}
                onChange={handleChange}
                placeholder={c.needPlaceholder}
                className={cn(inputClass, 'resize-none')}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'mt-2 w-full py-3 rounded-xl font-bold text-base transition',
                'bg-indigo-600 text-white hover:bg-indigo-500',
                'shadow-[0_0_32px_rgba(99,102,241,0.4)]',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? c.submitting : c.submit}
            </button>

            {reassurance && (
              <p className="text-center text-xs text-muted-foreground">
                {reassurance}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
};
