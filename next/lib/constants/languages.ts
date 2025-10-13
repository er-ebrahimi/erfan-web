export const languageLabels: Record<string, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇺🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
  fa: { label: 'فارسی', flag: '🇮🇷' },
  es: { label: 'Español', flag: '🇪🇸' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  it: { label: 'Italiano', flag: '🇮🇹' },
  pt: { label: 'Português', flag: '🇵🇹' },
  ru: { label: 'Русский', flag: '🇷🇺' },
  zh: { label: '中文', flag: '🇨🇳' },
  ja: { label: '日本語', flag: '🇯🇵' },
  ko: { label: '한국어', flag: '🇰🇷' },
  ar: { label: 'العربية', flag: '🇸🇦' },
  hi: { label: 'हिन्दी', flag: '🇮🇳' },
  tr: { label: 'Türkçe', flag: '🇹🇷' },
  nl: { label: 'Nederlands', flag: '🇳🇱' },
  sv: { label: 'Svenska', flag: '🇸🇪' },
  no: { label: 'Norsk', flag: '🇳🇴' },
  da: { label: 'Dansk', flag: '🇩🇰' },
  fi: { label: 'Suomi', flag: '🇫🇮' },
  pl: { label: 'Polski', flag: '🇵🇱' },
  cs: { label: 'Čeština', flag: '🇨🇿' },
  hu: { label: 'Magyar', flag: '🇭🇺' },
  ro: { label: 'Română', flag: '🇷🇴' },
  bg: { label: 'Български', flag: '🇧🇬' },
  hr: { label: 'Hrvatski', flag: '🇭🇷' },
  sk: { label: 'Slovenčina', flag: '🇸🇰' },
  sl: { label: 'Slovenščina', flag: '🇸🇮' },
  et: { label: 'Eesti', flag: '🇪🇪' },
  lv: { label: 'Latviešu', flag: '🇱🇻' },
  lt: { label: 'Lietuvių', flag: '🇱🇹' },
  el: { label: 'Ελληνικά', flag: '🇬🇷' },
  he: { label: 'עברית', flag: '🇮🇱' },
  th: { label: 'ไทย', flag: '🇹🇭' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
  id: { label: 'Bahasa Indonesia', flag: '🇮🇩' },
  ms: { label: 'Bahasa Melayu', flag: '🇲🇾' },
  tl: { label: 'Filipino', flag: '🇵🇭' },
};

// Helper functions
export const getLanguageLabel = (code: string): string => {
  return languageLabels[code]?.label || code;
};

export const getLanguageFlag = (code: string): string => {
  return languageLabels[code]?.flag || '🌐';
};

export const getSupportedLanguages = (): string[] => {
  return Object.keys(languageLabels);
};

export const isLanguageSupported = (code: string): boolean => {
  return code in languageLabels;
};

// Type definitions
export type LanguageCode = keyof typeof languageLabels;
export type LanguageInfo = {
  label: string;
  flag: string;
};
