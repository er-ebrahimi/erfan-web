import type { Core } from '@strapi/strapi';

// ---------------------------------------------------------------------------
// AI Solutions page seed
// Guard: only runs when SEED_AI_SOLUTIONS=true is set at startup.
// Idempotent: bails out silently if the page already exists.
// Failures are caught and logged as warnings — they NEVER block Strapi boot.
// ---------------------------------------------------------------------------

async function seedAiSolutionsPage(strapi: Core.Strapi): Promise<void> {
  if (process.env.SEED_AI_SOLUTIONS !== 'true') return;

  try {
    // -----------------------------------------------------------------------
    // Idempotency check
    // -----------------------------------------------------------------------
    const existing = await strapi.documents('api::page.page').findMany({
      filters: { slug: 'ai-solutions' },
      locale: 'fa',
    });

    if (existing.length > 0) {
      strapi.log.info('[seed] AI Solutions page already exists, skipping');
      return;
    }

    // -----------------------------------------------------------------------
    // 1. Create FAQ entries first so we can capture their documentIds
    // -----------------------------------------------------------------------
    const faqData = [
      {
        question: 'پروژه‌ی هوش مصنوعی چقدر زمان می‌برد؟',
        answer:
          'بسته به دامنه، از چند هفته برای یک نمونه‌ی اولیه تا چند ماه برای یک راهکار کامل.',
      },
      {
        question: 'داده‌های ما امن می‌مانند؟',
        answer:
          'بله؛ امنیت و حریم خصوصی داده‌ها در تمام مراحل اولویت ماست و امکان استقرار درون‌سازمانی وجود دارد.',
      },
      {
        question: 'اگر داده‌ی کافی نداشته باشیم چه؟',
        answer:
          'با مدل‌های پیش‌آموزش‌دیده و راهکارهای کم‌داده شروع می‌کنیم و به‌مرور بهبود می‌دهیم.',
      },
      {
        question: 'هزینه چگونه محاسبه می‌شود؟',
        answer:
          'پس از نیازسنجی رایگان، پیشنهاد قیمت شفاف بر اساس دامنه‌ی پروژه ارائه می‌کنیم.',
      },
    ];

    const faqDocumentIds: string[] = [];

    for (const faq of faqData) {
      // NOTE: api::faq.faq has draftAndPublish:false — no status param needed.
      const created = await strapi.documents('api::faq.faq').create({
        data: faq as any,
        locale: 'fa',
      });
      faqDocumentIds.push(created.documentId);
    }

    strapi.log.info(`[seed] Created ${faqDocumentIds.length} FAQ entries`);

    // -----------------------------------------------------------------------
    // 2. Build SEO object
    // -----------------------------------------------------------------------
    const seo = {
      metaTitle: 'راهکارهای هوش مصنوعی | استودیو آرمان',
      metaDescription:
        'خدمات هوش مصنوعی، اتوماسیون فرایندها، چت‌بات هوشمند و تحلیل داده برای کسب‌وکار شما — همین امروز مشاوره‌ی رایگان بگیرید.',
      keywords:
        'هوش مصنوعی, اتوماسیون, چت‌بات, یادگیری ماشین, راهکار سازمانی',
      metaRobots: 'index,follow',
      canonicalURL: 'https://studioarman.com/fa/ai-solutions',
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://studioarman.com/#organization',
            name: 'استودیو آرمان',
            url: 'https://studioarman.com',
            logo: 'https://studioarman.com/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              url: 'https://studioarman.com/fa/contact',
              availableLanguage: ['fa', 'en'],
            },
          },
          {
            '@type': 'Service',
            name: 'راهکارهای هوش مصنوعی',
            serviceType: 'AI consulting and development',
            description:
              'طراحی و پیاده‌سازی عامل‌های هوشمند، اتوماسیون فرایندها، بینایی ماشین و تحلیل داده برای کسب‌وکارها.',
            provider: { '@id': 'https://studioarman.com/#organization' },
            areaServed: 'IR',
            url: 'https://studioarman.com/fa/ai-solutions',
          },
          {
            '@type': 'HowTo',
            name: 'چطور با هم کار می‌کنیم',
            description: 'یک مسیر شفاف و چهار مرحله‌ای از نیاز تا نتیجه.',
            step: [
              { '@type': 'HowToStep', position: 1, name: 'کشف و نیازسنجی', text: 'فرایندها و داده‌های شما را می‌شناسیم و فرصت‌های هوش مصنوعی را مشخص می‌کنیم.' },
              { '@type': 'HowToStep', position: 2, name: 'طراحی راهکار', text: 'معماری، مدل و تجربه‌ی کاربری متناسب با هدف کسب‌وکار را طراحی می‌کنیم.' },
              { '@type': 'HowToStep', position: 3, name: 'پیاده‌سازی', text: 'راهکار را می‌سازیم، آزمایش می‌کنیم و با سیستم‌های شما یکپارچه می‌کنیم.' },
              { '@type': 'HowToStep', position: 4, name: 'استقرار و پشتیبانی', text: 'راه‌اندازی، پایش و بهبود مستمر پس از تحویل.' },
            ],
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'خانه', item: 'https://studioarman.com/fa' },
              { '@type': 'ListItem', position: 2, name: 'راهکارهای هوش مصنوعی', item: 'https://studioarman.com/fa/ai-solutions' },
            ],
          },
          {
            '@type': 'WebPage',
            name: 'راهکارهای هوش مصنوعی',
            url: 'https://studioarman.com/fa/ai-solutions',
            description:
              'خدمات هوش مصنوعی، اتوماسیون فرایندها، چت‌بات هوشمند و تحلیل داده برای کسب‌وکار شما توسط استودیو آرمان.',
            inLanguage: 'fa-IR',
            isPartOf: { '@type': 'WebSite', name: 'استودیو آرمان', url: 'https://studioarman.com' },
            primaryImageOfPage: 'https://studioarman.com/og/ai-solutions.png',
            dateModified: '2026-06-16',
          },
        ],
      },
    };

    // -----------------------------------------------------------------------
    // 3. Build the dynamic_zone (8 sections, exact field names from schemas)
    // -----------------------------------------------------------------------
    const dynamic_zone: any[] = [
      // ── Section 1: AI Hero ──────────────────────────────────────────────
      {
        __component: 'dynamic-zone.ai-hero',
        heading: 'هوش مصنوعی سفارشی برای کاهش هزینه و افزایش سرعت',
        sub_heading:
          'از نیازسنجی تا استقرار، عامل‌های هوشمند و اتوماسیون را متناسب با فرایندهای شما می‌سازیم؛ امن، یکپارچه و با نتایج قابل‌اندازه‌گیری.',
        badge_text: 'استودیو هوش مصنوعی',
        reassurance: 'بدون تعهد؛ ظرف ۲۴ ساعت پاسخ می‌دهیم.',
        CTAs: [
          { text: 'رزرو جلسه‌ی ۳۰ دقیقه‌ای رایگان', URL: '/contact', variant: 'primary' },
          { text: 'نمونه‌کارها', URL: '/ai-solutions#case-studies', variant: 'outline' },
        ],
      },

      // ── Section 2: Capabilities ─────────────────────────────────────────
      {
        __component: 'dynamic-zone.capabilities',
        heading: 'چه کاری برای شما انجام می‌دهیم',
        sub_heading:
          'مجموعه‌ای کامل از خدمات هوش مصنوعی، از مشاوره تا محصول نهایی.',
        capabilities: [
          {
            title: 'دستیار و چت‌بات هوشمند',
            description:
              'پاسخ‌گویی خودکار، پشتیبانی ۲۴ساعته و دستیار داخلی سازمان بر پایه‌ی مدل‌های زبانی.',
            icon: 'IconMessageChatbot',
            span: 'two', // bento wide card
          },
          {
            title: 'اتوماسیون فرایندها',
            description:
              'حذف کارهای تکراری با گردش‌کارهای هوشمند و یکپارچه‌سازی ابزارها.',
            icon: 'IconRobot',
            span: 'one',
          },
          {
            title: 'بینایی ماشین',
            description:
              'پردازش تصویر و ویدئو برای کنترل کیفیت، تشخیص و دسته‌بندی.',
            icon: 'IconEye',
            span: 'one',
          },
          {
            title: 'تحلیل و پیش‌بینی داده',
            description:
              'مدل‌های پیش‌بینی، داشبورد و بینش‌های تصمیم‌ساز از داده‌های شما.',
            icon: 'IconChartHistogram',
            span: 'two', // bento wide card
          },
          {
            title: 'جست‌وجوی دانش سازمانی (RAG)',
            description:
              'پاسخ دقیق از روی اسناد و دانش داخلی شرکت شما.',
            icon: 'IconDatabaseSearch',
            span: 'one',
          },
          {
            title: 'یکپارچه‌سازی مدل‌های زبانی',
            description:
              'اتصال امن LLMها به محصولات و APIهای موجود شما.',
            icon: 'IconPlugConnected',
            span: 'one',
          },
        ],
      },

      // ── Section 3: Process ──────────────────────────────────────────────
      {
        __component: 'dynamic-zone.process',
        heading: 'چطور با هم کار می‌کنیم',
        sub_heading: 'یک مسیر شفاف و چهار مرحله‌ای از نیاز تا نتیجه.',
        steps: [
          {
            title: 'کشف و نیازسنجی',
            description:
              'فرایندها و داده‌های شما را می‌شناسیم و فرصت‌های هوش مصنوعی را مشخص می‌کنیم.',
            icon: 'IconSearch',
          },
          {
            title: 'طراحی راهکار',
            description:
              'معماری، مدل و تجربه‌ی کاربری متناسب با هدف کسب‌وکار را طراحی می‌کنیم.',
            icon: 'IconPencilBolt',
          },
          {
            title: 'پیاده‌سازی',
            description:
              'راهکار را می‌سازیم، آزمایش می‌کنیم و با سیستم‌های شما یکپارچه می‌کنیم.',
            icon: 'IconCode',
          },
          {
            title: 'استقرار و پشتیبانی',
            description:
              'راه‌اندازی، پایش و بهبود مستمر پس از تحویل.',
            icon: 'IconRocket',
          },
        ],
      },

      // ── Section 4: Use Cases ────────────────────────────────────────────
      {
        __component: 'dynamic-zone.use-cases',
        heading: 'کاربردها در صنایع مختلف',
        sub_heading: 'کاربردهایی که در صنایع مختلف پیاده‌سازی می‌کنیم.',
        use_cases: [
          {
            title: 'پشتیبانی مشتری هوشمند',
            category: 'خرده‌فروشی',
            description:
              'چت‌بات هوشمند که به‌صورت خودکار سوالات مشتریان را پاسخ می‌دهد و تجربه خرید را بهبود می‌بخشد.',
          },
          {
            title: 'تحلیل تصاویر پزشکی',
            category: 'سلامت',
            description:
              'پردازش تصویر برای کمک به تشخیص بیماری‌ها و بهبود دقت نتایج آزمایشگاهی.',
          },
          {
            title: 'تشخیص تقلب',
            category: 'مالی',
            description:
              'مدل‌های یادگیری ماشین که تراکنش‌های مشکوک را در لحظه شناسایی می‌کنند.',
          },
          {
            title: 'کنترل کیفیت بصری',
            category: 'تولید',
            description:
              'سیستم‌های بینایی ماشین که نقص‌های محصول را در خط تولید شناسایی می‌کنند.',
          },
          {
            title: 'دستیار یادگیری شخصی',
            category: 'آموزش',
            description:
              'محتوای آموزشی شخصی‌سازی‌شده که با سرعت و سبک یادگیری هر دانش‌آموز تطبیق می‌یابد.',
          },
        ],
      },

      // ── Section 5: Metrics ──────────────────────────────────────────────
      {
        __component: 'dynamic-zone.metrics',
        heading: 'نتایجی که می‌سازیم',
        sub_heading: 'نمونه‌ای از تأثیری که هوش مصنوعی می‌تواند بر شاخص‌های کلیدی بگذارد.',
        metrics: [
          {
            value: 40,
            suffix: '٪',
            label: 'کاهش هزینه‌ی عملیات',
            icon: 'IconTrendingDown',
          },
          {
            value: 3,
            suffix: 'x',
            label: 'سرعت پاسخ‌گویی',
            icon: 'IconBolt',
          },
          {
            value: 95,
            suffix: '٪',
            label: 'دقت تشخیص نقص',
            icon: 'IconEye',
            note: 'منبع: پروژه‌ی بازرسی بصری',
          },
          {
            value: 60,
            suffix: '٪',
            label: 'کاهش زمان بازرسی',
            icon: 'IconClock',
            note: 'منبع: پروژه‌ی بازرسی بصری',
          },
        ],
      },

      // ── Section 6: Integrations ─────────────────────────────────────────
      {
        __component: 'dynamic-zone.integrations',
        heading: 'با ابزارهای شما کار می‌کند',
        sub_heading:
          'اتصال امن به مدل‌ها، پایگاه‌های داده و سرویس‌های شما.',
        integrations: [
          { title: 'OpenAI', iconName: 'IconBrandOpenai', href: '#' },
          { title: 'Hugging Face', iconName: 'IconBrain', href: '#' },
          { title: 'PostgreSQL', iconName: 'IconCloud', href: '#' },
          { title: 'Docker', iconName: 'IconBrandDocker', href: '#' },
          { title: 'Python', iconName: 'IconBrandPython', href: '#' },
          { title: 'Zapier', iconName: 'IconBrandZapier', href: '#' },
        ],
      },

      // ── Section 7: FAQ ──────────────────────────────────────────────────
      {
        __component: 'dynamic-zone.faq',
        heading: 'سوال‌های پرتکرار',
        sub_heading: 'پاسخ سوالاتی که بیشترین بار می‌شنویم.',
        // Relations are set by passing documentIds
        faqs: faqDocumentIds,
      },

      // ── Section 8: CTA closer ───────────────────────────────────────────
      // ── Section 8: Case studies (real work) ─────────────────────────────
      {
        __component: 'dynamic-zone.case-studies',
        heading: 'نمونه‌کارها',
        sub_heading: 'چند نمونه از پروژه‌هایی که اجرا کرده‌ایم.',
        case_studies: [
          {
            title: 'بازرسی بصری هوشمند خط تولید',
            category: 'تولید',
            summary:
              'در خط تولید، هر ثانیه مهم است. یک سامانه‌ی کنترل کیفیت بصری هوش مصنوعی به‌صورت درون‌سازمانی پیاده کردیم که لبه‌ها را تشخیص و سوراخ‌ها را در لحظه می‌شمارد، برچسب واضح PASS/FAIL می‌زند و فریم‌ها و ماسک‌ها را برای ممیزی ذخیره می‌کند. داشبورد React و گزارش‌های روزانه‌ی KPI، دقت و نرخ خطا را به تفکیک مدل دنبال می‌کنند.',
            outcomes: ['~۹۵٪ دقت تشخیص', '~۶۰٪ کاهش زمان بازرسی', 'درون‌سازمانی و شیفت‌پایدار'],
            tags: ['Computer Vision', 'OpenCV', 'Python', 'Object Detection'],
          },
          {
            title: 'استخراج هوشمند اطلاعات از رسیدهای دست‌نویس فارسی',
            category: 'مالی و حسابداری',
            summary:
              'افزونه‌ی مرورگر به‌همراه سرویس هوش مصنوعی که تصویر رسید را با OCR می‌خواند، فیلدهای کلیدی (نام کالا، مبلغ، جمع کل) را استخراج و فرم مقصد را به‌صورت خودکار تکمیل می‌کند؛ با امکان اصلاح دستی و ثبت KPI. قابل توسعه به انبارداری و لجستیک، سیستم‌های ERP و پردازش اسناد دست‌نویس فارسی.',
            outcomes: ['تکمیل خودکار فرم', 'اصلاح دستی + پایش KPI', 'قابل‌توسعه به ERP/انبار'],
            tags: ['OCR', 'NLP', 'Python', 'Document AI'],
          },
        ],
      },

      // ── Section 9: Lead form (inline closer) ────────────────────────────
      {
        __component: 'dynamic-zone.lead-form',
        heading: 'آماده‌اید هوش مصنوعی را وارد کسب‌وکار خود کنید؟',
        sub_heading:
          'یک پیام کوتاه بفرستید تا نیازتان را بررسی کنیم و مسیر شروع را پیشنهاد دهیم.',
        reassurance: 'بدون تعهد؛ ظرف ۲۴ ساعت پاسخ می‌دهیم.',
      },
    ];

    // -----------------------------------------------------------------------
    // 4. Create the page
    // -----------------------------------------------------------------------
    const page = await strapi.documents('api::page.page').create({
      data: {
        slug: 'ai-solutions',
        seo,
        dynamic_zone,
      } as any,
      locale: 'fa',
      status: 'published',
    });

    strapi.log.info(
      `[seed] AI Solutions page created — documentId: ${page.documentId}`
    );

    // -----------------------------------------------------------------------
    // 5. Update global nav + footer (wrapped in its OWN try/catch)
    // -----------------------------------------------------------------------
    try {
      // NOTE: global is a single-type; findFirst resolves it without a filter.
      // We populate navbar and footer to inspect existing items.
      const g = await (strapi.documents('api::global.global') as any).findFirst({
        locale: 'fa',
        populate: { navbar: { populate: { left_navbar_items: true } }, footer: { populate: { internal_links: true } } },
      });

      if (!g) {
        strapi.log.warn('[seed] Global single-type not found — skipping nav/footer update');
        return;
      }

      // --- Navbar: add to left_navbar_items if not already present ----------
      const leftItems: any[] = g.navbar?.left_navbar_items ?? [];
      const hasNavItem = leftItems.some((item: any) => item.URL === '/ai-solutions');

      const newLeftItems = hasNavItem
        ? leftItems
        : [
            ...leftItems,
            { text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions', target: '_self' },
          ];

      // --- Footer: add to internal_links if not already present -------------
      const footerLinks: any[] = g.footer?.internal_links ?? [];
      const hasFooterLink = footerLinks.some((item: any) => item.URL === '/ai-solutions');

      const newFooterLinks = hasFooterLink
        ? footerLinks
        : [
            ...footerLinks,
            { text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions', target: '_self' },
          ];

      await (strapi.documents('api::global.global') as any).update({
        documentId: g.documentId,
        locale: 'fa',
        data: {
          navbar: {
            ...g.navbar,
            left_navbar_items: newLeftItems,
          },
          footer: {
            ...g.footer,
            internal_links: newFooterLinks,
          },
        },
      });

      strapi.log.info('[seed] Global nav/footer updated with AI Solutions link');
    } catch (navErr) {
      strapi.log.warn('[seed] Nav/footer update failed (non-fatal): ' + navErr);
    }
  } catch (e) {
    strapi.log.warn('[seed] AI Solutions seed failed: ' + e);
  }
}

// ---------------------------------------------------------------------------
// Localize the English demo pages into `fa` so the navbar links + CTAs resolve
// instead of 404-ing. Idempotent (skips a slug whose fa version already exists).
// Mirrors the deepPopulate middleware so the full block tree is copied.
// Guard: only runs when SEED_AI_SOLUTIONS=true (same switch as the AI seed).
// ---------------------------------------------------------------------------
function getPageDeepPopulate(uid: any): any {
  const model: any = uid ? strapi.getModel(uid) : null;
  if (!model || !model.attributes) return {};
  return Object.entries(model.attributes).reduce((acc: any, [name, attr]: [string, any]) => {
    switch (attr.type) {
      case 'relation': {
        if (String(attr.relation).toLowerCase().startsWith('morph')) break;
        acc[name] = name === 'testimonials' ? { populate: 'user.image' } : { populate: '*' };
        break;
      }
      case 'media':
        acc[name] = { populate: '*' };
        break;
      case 'component':
        acc[name] = { populate: getPageDeepPopulate(attr.component) };
        break;
      case 'dynamiczone': {
        const on = (attr.components || []).reduce((o: any, c: any) => {
          o[c] = { populate: getPageDeepPopulate(c) };
          return o;
        }, {});
        acc[name] = { on };
        break;
      }
      default:
        break;
    }
    return acc;
  }, {});
}

const SYS_KEYS = new Set([
  'id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt',
  'locale', 'localizations', 'createdBy', 'updatedBy',
]);

// Strip system fields; turn media into id refs and content-relations into
// documentId refs so the copied tree can be re-created under a new locale.
function cleanForCopy(value: any): any {
  if (Array.isArray(value)) return value.map(cleanForCopy).filter((v) => v !== undefined && v !== null);
  if (value && typeof value === 'object') {
    if (value.mime !== undefined && value.url !== undefined && value.id !== undefined) {
      return value.id; // media file → reference by id
    }
    if (value.documentId !== undefined && value.__component === undefined) {
      // Related content entry. Connecting a fa page to an entry that has no fa
      // localization throws "locale fa not found", so drop the relation — the
      // page still renders; the relation can be re-linked in the admin.
      return undefined;
    }
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (SYS_KEYS.has(k)) continue;
      out[k] = cleanForCopy(v);
    }
    return out;
  }
  return value;
}

// Replace exact English strings with Persian ones during the en→fa copy.
// Walks the cleaned block tree; any leaf string that matches a dictionary key
// is swapped for its Persian value. Strings with no entry are left untouched.
function applyTranslations(value: any, dict: Record<string, string>): any {
  if (Array.isArray(value)) return value.map((v) => applyTranslations(v, dict));
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) out[k] = applyTranslations(v, dict);
    return out;
  }
  if (typeof value === 'string' && Object.prototype.hasOwnProperty.call(dict, value)) {
    return dict[value];
  }
  return value;
}

// Persian copy for the reusable template pages. Keyed by the exact English
// source string so the swap is precise (no fuzzy/partial matches).
const FA_PAGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  contact: {
    'Contact Us': 'با ما در تماس باشید',
    'Please reach out to us and we will get back to you at the speed of light.':
      'پیام یا شماره‌ی خود را بگذارید؛ در کوتاه‌ترین زمان (معمولاً ظرف ۲۴ ساعت) پاسخ می‌دهیم.',
    'LaunchPad is trusted by thousands of Astropreneurs':
      'کسب‌وکارها به استودیو آرمان اعتماد کرده‌اند',
    'Join the ranks of successful entrepreneurs who have used LaunchPad to turn their ideas into reality.':
      'به جمع کسب‌وکارهایی بپیوندید که فرایندهای خود را با هوش مصنوعی سفارشی متحول کرده‌اند.',
  },
};

// Persian page-level SEO (the template demos ship English/empty SEO, which
// renders a "Default Title" browser tab). Keyed by slug.
const FA_PAGE_SEO: Record<string, { metaTitle: string; metaDescription: string }> = {
  contact: {
    metaTitle: 'تماس با استودیو آرمان | مشاوره‌ی رایگان هوش مصنوعی',
    metaDescription:
      'برای دریافت مشاوره‌ی رایگان درباره‌ی راهکارهای هوش مصنوعی سفارشی، با استودیو آرمان در تماس باشید.',
  },
};

// Localize the global single-type (navbar + footer) into Persian.
// The layout fetches `global` per-locale, so without an fa global every page
// renders the English template chrome. This also repoints the nav/footer links
// at destinations that actually exist in Persian (the AI Solutions page and the
// contact page) and drops the demo-only links (Products/Blog/Sign up) that 404.
async function seedGlobalFa(strapi: Core.Strapi): Promise<void> {
  if (process.env.SEED_AI_SOLUTIONS !== 'true') return;
  try {
    const enGlobal: any = await (strapi.documents('api::global.global') as any).findFirst({
      locale: 'en',
    });
    if (!enGlobal) {
      strapi.log.warn('[seed] en global not found — cannot localize navbar/footer');
      return;
    }

    const navMain = [
      { text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions' },
      { text: 'تماس با ما', URL: '/contact' },
    ];

    const data = {
      navbar: {
        left_navbar_items: navMain,
        right_navbar_items: [{ text: 'رزرو مشاوره‌ی رایگان', URL: '/contact' }],
      },
      footer: {
        description:
          'استودیو آرمان راهکارهای هوش مصنوعی سفارشی برای کسب‌وکارها می‌سازد؛ از نیازسنجی تا استقرار — امن، یکپارچه و قابل‌اندازه‌گیری.',
        copyright: '© ۲۰۲۶ استودیو آرمان. همه‌ی حقوق محفوظ است.',
        designed_developed_by: 'طراحی و توسعه: استودیو آرمان',
        built_with: '',
        internal_links: [
          { text: 'راهکارهای هوش مصنوعی', URL: '/ai-solutions' },
          { text: 'نمونه‌کارها', URL: '/ai-solutions' },
          { text: 'تماس با ما', URL: '/contact' },
        ],
        policy_links: [],
        social_media_links: [],
      },
      seo: {
        metaTitle: 'استودیو آرمان | راهکارهای هوش مصنوعی سفارشی',
        metaDescription:
          'استودیو آرمان عامل‌های هوشمند و اتوماسیون سفارشی برای کاهش هزینه و افزایش سرعت کسب‌وکارها می‌سازد.',
      },
    };

    await (strapi.documents('api::global.global') as any).update({
      documentId: enGlobal.documentId,
      locale: 'fa',
      status: 'published',
      data,
    });
    strapi.log.info('[seed] localized fa global (navbar + footer) from en');
  } catch (e) {
    strapi.log.warn(`[seed] fa global localization failed (non-fatal): ${e}`);
  }
}

async function seedFaLocalizations(strapi: Core.Strapi): Promise<void> {
  if (process.env.SEED_AI_SOLUTIONS !== 'true') return;
  // Only the contact page is linked from the (Persian) nav. The other template
  // demos (homepage/pricing/faq) are not surfaced, so we don't translate them.
  const slugs = ['contact'];

  for (const slug of slugs) {
    try {
      const enPages = await strapi.documents('api::page.page').findMany({
        filters: { slug }, locale: 'en', status: 'published',
        populate: getPageDeepPopulate('api::page.page'),
      });
      const enPage: any = enPages[0];
      if (!enPage) {
        strapi.log.warn(`[seed] en/${slug} not found — cannot localize`);
        continue;
      }

      // Re-localize on every seeded boot so translation edits take effect
      // (update creates the fa variant if missing, or overwrites it).
      const dict = FA_PAGE_TRANSLATIONS[slug] || {};
      const seo = FA_PAGE_SEO[slug];
      await (strapi.documents('api::page.page') as any).update({
        documentId: enPage.documentId,
        locale: 'fa',
        status: 'published',
        data: {
          slug,
          dynamic_zone: applyTranslations(cleanForCopy(enPage.dynamic_zone), dict),
          ...(seo ? { seo } : {}),
        },
      });
      strapi.log.info(`[seed] localized fa/${slug} from en (Persian copy)`);
    } catch (e) {
      strapi.log.warn(`[seed] fa/${slug} localization failed (non-fatal): ${e}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Strapi lifecycle hooks
// ---------------------------------------------------------------------------

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedAiSolutionsPage(strapi);
    await seedGlobalFa(strapi);
    await seedFaLocalizations(strapi);
  },
};
