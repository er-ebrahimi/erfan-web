// ⚠️ TEMPORARY local preview — NOT part of the feature.
// Renders the real AI Solutions blocks with the seed's placeholder content so
// the page can be viewed without the Strapi backend running. Delete after review.
import PageContent from '@/lib/shared/PageContent';

const dynamic_zone: any[] = [
  {
    __component: 'dynamic-zone.ai-hero',
    id: 1,
    heading: 'هوش مصنوعی سفارشی برای کاهش هزینه و افزایش سرعت',
    sub_heading:
      'از نیازسنجی تا استقرار، عامل‌های هوشمند و اتوماسیون را متناسب با فرایندهای شما می‌سازیم؛ امن، یکپارچه و با نتایج قابل‌اندازه‌گیری.',
    badge_text: 'استودیو هوش مصنوعی',
    reassurance: 'بدون تعهد؛ ظرف ۲۴ ساعت پاسخ می‌دهیم.',
    CTAs: [
      { id: 1, text: 'رزرو جلسه‌ی ۳۰ دقیقه‌ای رایگان', URL: '/contact', variant: 'primary' },
      { id: 2, text: 'نمونه‌کارها', URL: '/projects', variant: 'outline' },
    ],
  },
  {
    __component: 'dynamic-zone.capabilities',
    id: 2,
    heading: 'چه کاری برای شما انجام می‌دهیم',
    sub_heading: 'مجموعه‌ای کامل از خدمات هوش مصنوعی، از مشاوره تا محصول نهایی.',
    capabilities: [
      {
        id: 1,
        title: 'دستیار و چت‌بات هوشمند',
        description:
          'پاسخ‌گویی خودکار، پشتیبانی ۲۴ساعته و دستیار داخلی سازمان بر پایه‌ی مدل‌های زبانی.',
        icon: 'IconMessageChatbot',
        span: 'two',
      },
      {
        id: 2,
        title: 'اتوماسیون فرایندها',
        description:
          'حذف کارهای تکراری با گردش‌کارهای هوشمند و یکپارچه‌سازی ابزارها.',
        icon: 'IconRobot',
        span: 'one',
      },
      {
        id: 3,
        title: 'بینایی ماشین',
        description: 'پردازش تصویر و ویدئو برای کنترل کیفیت، تشخیص و دسته‌بندی.',
        icon: 'IconEye',
        span: 'one',
      },
      {
        id: 4,
        title: 'تحلیل و پیش‌بینی داده',
        description:
          'مدل‌های پیش‌بینی، داشبورد و بینش‌های تصمیم‌ساز از داده‌های شما.',
        icon: 'IconChartHistogram',
        span: 'two',
      },
      {
        id: 5,
        title: 'جست‌وجوی دانش سازمانی (RAG)',
        description: 'پاسخ دقیق از روی اسناد و دانش داخلی شرکت شما.',
        icon: 'IconDatabaseSearch',
        span: 'one',
      },
      {
        id: 6,
        title: 'یکپارچه‌سازی مدل‌های زبانی',
        description: 'اتصال امن LLMها به محصولات و APIهای موجود شما.',
        icon: 'IconPlugConnected',
        span: 'one',
      },
    ],
  },
  {
    __component: 'dynamic-zone.process',
    id: 3,
    heading: 'چطور با هم کار می‌کنیم',
    sub_heading: 'یک مسیر شفاف و چهار مرحله‌ای از نیاز تا نتیجه.',
    steps: [
      {
        id: 1,
        title: 'کشف و نیازسنجی',
        description:
          'فرایندها و داده‌های شما را می‌شناسیم و فرصت‌های هوش مصنوعی را مشخص می‌کنیم.',
        icon: 'IconSearch',
      },
      {
        id: 2,
        title: 'طراحی راهکار',
        description:
          'معماری، مدل و تجربه‌ی کاربری متناسب با هدف کسب‌وکار را طراحی می‌کنیم.',
        icon: 'IconPencilBolt',
      },
      {
        id: 3,
        title: 'پیاده‌سازی',
        description:
          'راهکار را می‌سازیم، آزمایش می‌کنیم و با سیستم‌های شما یکپارچه می‌کنیم.',
        icon: 'IconCode',
      },
      {
        id: 4,
        title: 'استقرار و پشتیبانی',
        description: 'راه‌اندازی، پایش و بهبود مستمر پس از تحویل.',
        icon: 'IconRocket',
      },
    ],
  },
  {
    __component: 'dynamic-zone.use-cases',
    id: 4,
    heading: 'کاربردها در صنایع مختلف',
    sub_heading: 'کاربردهایی که در صنایع مختلف پیاده‌سازی می‌کنیم.',
    use_cases: [
      {
        id: 1,
        title: 'پشتیبانی مشتری هوشمند',
        category: 'خرده‌فروشی',
        description:
          'چت‌بات هوشمند که به‌صورت خودکار سوالات مشتریان را پاسخ می‌دهد و تجربه خرید را بهبود می‌بخشد.',
        image: { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop' },
      },
      {
        id: 2,
        title: 'تحلیل تصاویر پزشکی',
        category: 'سلامت',
        description:
          'پردازش تصویر برای کمک به تشخیص بیماری‌ها و بهبود دقت نتایج آزمایشگاهی.',
        image: { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop' },
      },
      {
        id: 3,
        title: 'تشخیص تقلب',
        category: 'مالی',
        description:
          'مدل‌های یادگیری ماشین که تراکنش‌های مشکوک را در لحظه شناسایی می‌کنند.',
        image: { url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&auto=format&fit=crop' },
      },
      {
        id: 4,
        title: 'کنترل کیفیت بصری',
        category: 'تولید',
        description:
          'سیستم‌های بینایی ماشین که نقص‌های محصول را در خط تولید شناسایی می‌کنند.',
        image: { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80&auto=format&fit=crop' },
      },
      {
        id: 5,
        title: 'دستیار یادگیری شخصی',
        category: 'آموزش',
        description:
          'محتوای آموزشی شخصی‌سازی‌شده که با سرعت و سبک یادگیری هر دانش‌آموز تطبیق می‌یابد.',
        image: { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80&auto=format&fit=crop' },
      },
    ],
  },
  {
    __component: 'dynamic-zone.metrics',
    id: 5,
    heading: 'نتایجی که می‌سازیم',
    sub_heading: 'نمونه‌ای از تأثیری که هوش مصنوعی می‌تواند بر شاخص‌های کلیدی بگذارد.',
    metrics: [
      { id: 1, value: 40, suffix: '٪', label: 'کاهش هزینه‌ی عملیات', icon: 'IconTrendingDown' },
      { id: 2, value: 3, suffix: 'x', label: 'سرعت پاسخ‌گویی', icon: 'IconBolt' },
      { id: 3, value: 95, suffix: '٪', label: 'دقت تشخیص نقص', icon: 'IconEye', note: 'منبع: پروژه‌ی بازرسی بصری' },
      { id: 4, value: 60, suffix: '٪', label: 'کاهش زمان بازرسی', icon: 'IconClock', note: 'منبع: پروژه‌ی بازرسی بصری' },
    ],
  },
  {
    __component: 'dynamic-zone.integrations',
    id: 6,
    heading: 'با ابزارهای شما کار می‌کند',
    sub_heading: 'اتصال امن به مدل‌ها، پایگاه‌های داده و سرویس‌های شما.',
    integrations: [
      { id: 1, title: 'OpenAI', iconName: 'IconBrandOpenai', href: '#' },
      { id: 2, title: 'Hugging Face', iconName: 'IconBrain', href: '#' },
      { id: 3, title: 'PostgreSQL', iconName: 'IconCloud', href: '#' },
      { id: 4, title: 'Docker', iconName: 'IconBrandDocker', href: '#' },
      { id: 5, title: 'Python', iconName: 'IconBrandPython', href: '#' },
      { id: 6, title: 'Zapier', iconName: 'IconBrandZapier', href: '#' },
    ],
  },
  {
    __component: 'dynamic-zone.faq',
    id: 7,
    heading: 'سوال‌های پرتکرار',
    sub_heading: 'پاسخ سوالاتی که بیشترین بار می‌شنویم.',
    faqs: [
      {
        id: 1,
        question: 'پروژه‌ی هوش مصنوعی چقدر زمان می‌برد؟',
        answer:
          'بسته به دامنه، از چند هفته برای یک نمونه‌ی اولیه تا چند ماه برای یک راهکار کامل.',
      },
      {
        id: 2,
        question: 'داده‌های ما امن می‌مانند؟',
        answer:
          'بله؛ امنیت و حریم خصوصی داده‌ها در تمام مراحل اولویت ماست و امکان استقرار درون‌سازمانی وجود دارد.',
      },
      {
        id: 3,
        question: 'اگر داده‌ی کافی نداشته باشیم چه؟',
        answer:
          'با مدل‌های پیش‌آموزش‌دیده و راهکارهای کم‌داده شروع می‌کنیم و به‌مرور بهبود می‌دهیم.',
      },
      {
        id: 4,
        question: 'هزینه چگونه محاسبه می‌شود؟',
        answer:
          'پس از نیازسنجی رایگان، پیشنهاد قیمت شفاف بر اساس دامنه‌ی پروژه ارائه می‌کنیم.',
      },
    ],
  },
  {
    __component: 'dynamic-zone.case-studies',
    id: 9,
    heading: 'نمونه‌کارها',
    sub_heading: 'چند نمونه از پروژه‌هایی که اجرا کرده‌ایم.',
    case_studies: [
      {
        id: 1,
        title: 'بازرسی بصری هوشمند خط تولید',
        category: 'تولید',
        summary:
          'در خط تولید، هر ثانیه مهم است. یک سامانه‌ی کنترل کیفیت بصری هوش مصنوعی به‌صورت درون‌سازمانی پیاده کردیم که لبه‌ها را تشخیص و سوراخ‌ها را در لحظه می‌شمارد، برچسب واضح PASS/FAIL می‌زند و فریم‌ها و ماسک‌ها را برای ممیزی ذخیره می‌کند. داشبورد React و گزارش‌های روزانه‌ی KPI، دقت و نرخ خطا را به تفکیک مدل دنبال می‌کنند.',
        outcomes: ['~۹۵٪ دقت تشخیص', '~۶۰٪ کاهش زمان بازرسی', 'درون‌سازمانی و شیفت‌پایدار'],
        tags: ['Computer Vision', 'OpenCV', 'Python', 'Object Detection'],
      },
      {
        id: 2,
        title: 'استخراج هوشمند اطلاعات از رسیدهای دست‌نویس فارسی',
        category: 'مالی و حسابداری',
        summary:
          'افزونه‌ی مرورگر به‌همراه سرویس هوش مصنوعی که تصویر رسید را با OCR می‌خواند، فیلدهای کلیدی (نام کالا، مبلغ، جمع کل) را استخراج و فرم مقصد را به‌صورت خودکار تکمیل می‌کند؛ با امکان اصلاح دستی و ثبت KPI. قابل توسعه به انبارداری و لجستیک، سیستم‌های ERP و پردازش اسناد دست‌نویس فارسی.',
        outcomes: ['تکمیل خودکار فرم', 'اصلاح دستی + پایش KPI', 'قابل‌توسعه به ERP/انبار'],
        tags: ['OCR', 'NLP', 'Python', 'Document AI'],
      },
    ],
  },
  {
    __component: 'dynamic-zone.lead-form',
    id: 10,
    heading: 'آماده‌اید هوش مصنوعی را وارد کسب‌وکار خود کنید؟',
    sub_heading:
      'یک پیام کوتاه بفرستید تا نیازتان را بررسی کنیم و مسیر شروع را پیشنهاد دهیم.',
    reassurance: 'بدون تعهد؛ ظرف ۲۴ ساعت پاسخ می‌دهیم.',
  },
];

export default async function PreviewAiSolutions(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const pageData = { locale, dynamic_zone };
  return <PageContent pageData={pageData} />;
}
