import { getLocale } from 'next-intl/server';

// Import message files
import enMessages from '@/messages/en.json';
import faMessages from '@/messages/fa.json';
import frMessages from '@/messages/fr.json';

const messages = {
  en: enMessages,
  fa: faMessages,
  fr: frMessages,
};

export async function getApiMessage(
  key: string,
  locale?: string
): Promise<string> {
  const currentLocale = locale || (await getLocale()) || 'en';
  const messageKeys = key.split('.');

  let message: any =
    messages[currentLocale as keyof typeof messages] || messages.en;

  for (const messageKey of messageKeys) {
    message = message?.[messageKey];
    if (message === undefined) {
      // Fallback to English if key not found
      message = messages.en;
      for (const fallbackKey of messageKeys) {
        message = message?.[fallbackKey];
        if (message === undefined) {
          return key; // Return the key if no translation found
        }
      }
      break;
    }
  }

  return typeof message === 'string' ? message : key;
}

export function getApiMessageSync(key: string, locale: string = 'en'): string {
  const messageKeys = key.split('.');

  let message: any = messages[locale as keyof typeof messages] || messages.en;

  for (const messageKey of messageKeys) {
    message = message?.[messageKey];
    if (message === undefined) {
      // Fallback to English if key not found
      message = messages.en;
      for (const fallbackKey of messageKeys) {
        message = message?.[fallbackKey];
        if (message === undefined) {
          return key; // Return the key if no translation found
        }
      }
      break;
    }
  }

  return typeof message === 'string' ? message : key;
}
