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
        'خدمات هوش مصنوعی، اتوماسیون فرایندها، چت‌بات هوشمند و تحلیل داده برای کسب‌وکار شما توسط استودیو آرمان.',
      keywords:
        'هوش مصنوعی, اتوماسیون, چت‌بات, یادگیری ماشین, راهکار سازمانی',
      metaRobots: 'index,follow',
      canonicalURL: 'https://studioarman.com/fa/ai-solutions',
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: 'راهکارهای هوش مصنوعی',
            serviceType: 'AI consulting and development',
            provider: {
              '@type': 'Organization',
              name: 'استودیو آرمان',
              url: 'https://studioarman.com',
            },
            areaServed: 'IR',
            url: 'https://studioarman.com/fa/ai-solutions',
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'خانه',
                item: 'https://studioarman.com/fa',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'راهکارهای هوش مصنوعی',
                item: 'https://studioarman.com/fa/ai-solutions',
              },
            ],
          },
          {
            '@type': 'WebPage',
            name: 'راهکارهای هوش مصنوعی',
            url: 'https://studioarman.com/fa/ai-solutions',
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
        heading: 'راهکارهای هوش مصنوعی که کسب‌وکار شما را متحول می‌کند',
        sub_heading:
          'از ایده تا استقرار؛ ما عاملان هوشمند، اتوماسیون و تحلیل داده را متناسب با فرایندهای شما طراحی و پیاده‌سازی می‌کنیم.',
        badge_text: 'استودیو هوش مصنوعی',
        CTAs: [
          { text: 'شروع پروژه', URL: '/contact', variant: 'primary' },
          { text: 'مشاوره‌ی رایگان', URL: '/contact', variant: 'outline' },
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
        sub_heading: 'نمونه‌هایی از آنچه می‌توان ساخت.',
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
        sub_heading: 'اعداد واقعی از پروژه‌های اجرا شده.',
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
            value: 2000,
            suffix: '+',
            label: 'ساعت صرفه‌جویی در سال',
            icon: 'IconClock',
          },
          {
            value: 98,
            suffix: '٪',
            label: 'رضایت کاربران',
            icon: 'IconMoodSmile',
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
          { title: 'Hugging Face', iconName: 'IconBrandHuggingFace', href: '#' },
          { title: 'PostgreSQL', iconName: 'IconBrandPostgresql', href: '#' },
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
      {
        __component: 'dynamic-zone.cta',
        CTAs: [
          { text: 'مشاوره رایگان', URL: '/contact', variant: 'primary' },
          { text: 'نمونه کارها', URL: '/projects', variant: 'outline' },
        ],
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
  },
};
