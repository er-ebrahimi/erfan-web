import type {
  LandingBenefitsProps,
  LandingCtaProps,
  LandingGalleryProps,
  LandingHeroProps,
  LandingHowItWorksProps,
  LandingShowcaseProps,
  LandingStatsProps,
} from './types';

/**
 * Kodom Tech landing copy, kept here only until the content is authored in
 * Strapi. Delete when `/[locale]/landing-preview` reads a real page.
 */

export const demoHero: LandingHeroProps = {
  heading_line_1: 'فضای خود را طراحی کنید',
  heading_highlight: 'با هوش مصنوعی',
  rotating_words: [
    { id: 1, text: 'دوباره طراحی' },
    { id: 2, text: 'شخصی‌سازی‌شده' },
    { id: 3, text: 'مدرن' },
    { id: 4, text: 'متعلق به شما' },
  ],
  sub_heading:
    'عکس اتاقتان را آپلود کنید و ببینید چطور به فضایی تبدیل می‌شود که دوستش دارید.',
  CTAs: [
    { id: 1, text: 'شروع طراحی', URL: '/contact', variant: 'primary' },
    {
      id: 2,
      text: 'ببینید چطور کار می‌کند',
      URL: '#how-it-works',
      variant: 'outline',
    },
  ],
  image: '/questioner/1/boho-rostik.jpg',
  chat_label: 'می‌خواهم نشیمن کوچکم روشن‌تر به نظر برسد.',
  chat_message:
    'یک فرش روشن‌تر و آینه‌های تزئینی امتحان کنید — این هم پیش‌نمایش بازطراحی‌شده.',
  locale: 'fa',
};

export const demoBenefits: LandingBenefitsProps = {
  heading: 'چرا کودم تک؟',
  sub_heading:
    'هر آنچه برای تبدیل یک اتاق معمولی به فضایی که دوستش دارید لازم دارید.',
  items: [
    {
      id: 1,
      title: 'ایده‌هایی از عکس خود اتاق',
      description:
        'عکس اتاقتان را آپلود کنید و ایده‌های طراحی‌ای بگیرید که با همان چیزی که دارید ساخته شده‌اند.',
      icon: 'camera',
      url: '/contact',
    },
    {
      id: 2,
      title: 'قبل از خرید، نتیجه را ببینید',
      description:
        'اتاقتان را قبل از خرج کردن حتی یک ریال برای مبلمان، با سبک‌های مختلف بازطراحی‌شده ببینید.',
      icon: 'eye',
      url: '/contact',
    },
    {
      id: 3,
      title: 'هماهنگ با سلیقه شما',
      description:
        'تست سلیقه می‌فهمد که به سبک بوهمی گرایش دارید یا کلاسیک یا صنعتی — و هر پیشنهاد را برای شما شخصی می‌کند.',
      icon: 'sliders',
      url: '/contact',
    },
    {
      id: 4,
      title: 'به زبان خودتان گفتگو کنید',
      description:
        'با هوش مصنوعی به فارسی یا انگلیسی صحبت کنید، هر کدام که برایتان راحت‌تر است.',
      icon: 'languages',
      url: '/contact',
    },
  ],
  locale: 'fa',
};

export const demoHowItWorks: LandingHowItWorksProps = {
  heading: 'چطور کار می‌کند؟',
  sub_heading: 'سه قدم ساده از عکس تا طراحی.',
  steps: [
    {
      id: 1,
      title: 'عکس اتاق را آپلود کنید',
      description:
        'از فضای خود عکس بگیرید و آپلود کنید — بدون نیاز به متر کردن یا نقشه.',
      icon: 'upload',
    },
    {
      id: 2,
      title: 'به تست سلیقه پاسخ دهید',
      description:
        'یک آزمون کوتاه درباره سلیقه شما در سبک، آباژور و فرش به هوش مصنوعی کمک می‌کند شما را بشناسد.',
      icon: 'clipboard',
    },
    {
      id: 3,
      title: 'گفتگو کنید و طرح بگیرید',
      description:
        'با هوش مصنوعی صحبت کنید، ایده‌هایتان را کامل کنید و طرح‌هایی مخصوص اتاق خودتان دریافت کنید.',
      icon: 'chat',
    },
  ],
  locale: 'fa',
};

export const demoGallery: LandingGalleryProps = {
  heading: 'سبک‌هایی برای کشف کردن',
  sub_heading:
    'از بوهمیِ آرام تا خطوط تمیز صنعتی — سبکی را پیدا کنید که شبیه شماست.',
  items: [
    {
      id: 1,
      title: 'بوهمی',
      alt: 'اتاق نشیمنی به سبک بوهمی با پارچه‌های لایه‌لایه و رنگ‌های گرم',
      image: '/questioner/1/boho-rostik.jpg',
    },
    {
      id: 2,
      title: 'کلاسیک',
      alt: 'اتاق نشیمنی به سبک کلاسیک با مبلمان شیک و جزئیات باشکوه',
      image: '/questioner/1/classic.jpg',
    },
    {
      id: 3,
      title: 'صنعتی',
      alt: 'اتاقی به سبک صنعتی با آجر نمایان و جزئیات فلزی',
      image: '/questioner/1/industrial.jpg',
    },
    {
      id: 4,
      title: 'نورپردازی',
      alt: 'اتاقی با نورپردازی گرم و چندلایه',
      image: '/questioner/2/lamp-aviz.jpg',
    },
  ],
  locale: 'fa',
};

export const demoShowcase: LandingShowcaseProps = {
  heading: 'یک دستیار، در تمام مسیر',
  sub_heading: 'گفتگو، ساخت تصویر و تست سلیقه — همه با هم.',
  chat_card: {
    id: 1,
    title: 'گفتگوی طراحی',
    description:
      'سوال بپرسید، مشورت بگیرید و ایده‌هایتان را در گفتگوی زنده کامل کنید.',
    user_message: 'می‌خواهم نشیمن کوچکم روشن‌تر به نظر برسد.',
    ai_message:
      'یک فرش روشن‌تر و آینه‌های تزئینی امتحان کنید — این هم پیش‌نمایش بازطراحی‌شده.',
  },
  image_card: {
    id: 2,
    title: 'پیش‌نمایش اتاق با هوش مصنوعی',
    description: 'قبل از هر تغییر، اتاق واقعی خودتان را بازطراحی‌شده ببینید.',
    prompt: 'نشیمن من را به سبک بوهمی گرم بازطراحی کن',
    status: 'در حال ساخت تصویر...',
    image: '/questioner/1/classic.jpg',
  },
  quiz_card: {
    id: 3,
    title: 'تست سلیقه',
    description:
      'چند سوال کوتاه باعث می‌شود هر پیشنهاد با سلیقه شما هماهنگ باشد.',
    question: 'کدام حال‌وهوا به فضای شما می‌خورد؟',
    option_a: 'دنج و پرمحتوا',
    option_b: 'مینیمال و مرتب',
  },
  locale: 'fa',
};

export const demoStats: LandingStatsProps = {
  items: [
    { id: 1, value: 10, suffix: '+', label: 'سبک طراحی' },
    { id: 2, value: 2, suffix: '', label: 'زبان' },
    { id: 3, value: 24, suffix: '/7', label: 'همیشه در دسترس' },
  ],
  locale: 'fa',
};

export const demoCta: LandingCtaProps = {
  heading: 'اتاق شما فقط یک عکس فاصله دارد',
  sub_heading:
    'عکس آپلود کنید، سلیقه‌تان را بگویید و بقیه را به هوش مصنوعی بسپارید.',
  CTAs: [{ id: 1, text: 'همین حالا شروع کنید', URL: '/contact' }],
  locale: 'fa',
};
