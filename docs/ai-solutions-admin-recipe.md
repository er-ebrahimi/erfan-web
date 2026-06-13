# AI Solutions Page — Admin Recipe

> How to build or edit the `/fa/ai-solutions` page in Strapi admin, with all Persian copy.  
> The automated seed (`strapi/src/index.ts`) creates this page in one command; this recipe lets you recreate or tweak it by hand.

---

## 1. Run the automated seed (fastest path)

The seed is guarded by an environment variable so it never runs accidentally.

**Bash / macOS / Linux:**
```bash
SEED_AI_SOLUTIONS=true yarn develop
```

**PowerShell (Windows):**
```powershell
$env:SEED_AI_SOLUTIONS='true'; yarn develop
```

Start Strapi once with the flag set, wait for the log line:
```
[seed] AI Solutions page created — documentId: …
[seed] Global nav/footer updated with AI Solutions link
```

Then **unset the variable and restart normally:**
```bash
# Bash
unset SEED_AI_SOLUTIONS && yarn develop

# PowerShell
Remove-Item Env:SEED_AI_SOLUTIONS; yarn develop
```

Re-running with the flag set is safe — the seed checks for the slug and skips if the page already exists.

---

## 2. Create FAQ entries first

Before building the page, create the four FAQ entries the FAQ block will reference.

**Content-Type Manager → FAQ → Create new entry**

| # | Question | Answer |
|---|----------|--------|
| 1 | پروژه‌ی هوش مصنوعی چقدر زمان می‌برد؟ | بسته به دامنه، از چند هفته برای یک نمونه‌ی اولیه تا چند ماه برای یک راهکار کامل. |
| 2 | داده‌های ما امن می‌مانند؟ | بله؛ امنیت و حریم خصوصی داده‌ها در تمام مراحل اولویت ماست و امکان استقرار درون‌سازمانی وجود دارد. |
| 3 | اگر داده‌ی کافی نداشته باشیم چه؟ | با مدل‌های پیش‌آموزش‌دیده و راهکارهای کم‌داده شروع می‌کنیم و به‌مرور بهبود می‌دهیم. |
| 4 | هزینه چگونه محاسبه می‌شود؟ | پس از نیازسنجی رایگان، پیشنهاد قیمت شفاف بر اساس دامنه‌ی پروژه ارائه می‌کنیم. |

Set locale to **fa** for all entries. FAQ has `draftAndPublish: false` so there is no publish button — entries are live as soon as saved.

---

## 3. Create the page

**Content-Type Manager → Pages → Create new entry**

- **Slug:** `ai-solutions`
- **Locale:** `fa`

---

## 4. SEO component

Scroll to the **SEO** component and fill:

| Field | Value |
|-------|-------|
| metaTitle | `راهکارهای هوش مصنوعی \| استودیو آرمان` |
| metaDescription | `خدمات هوش مصنوعی، اتوماسیون فرایندها، چت‌بات هوشمند و تحلیل داده برای کسب‌وکار شما توسط استودیو آرمان.` |
| keywords | `هوش مصنوعی, اتوماسیون, چت‌بات, یادگیری ماشین, راهکار سازمانی` |
| metaRobots | `index,follow` |
| canonicalURL | `https://studioarman.com/fa/ai-solutions` |
| metaImage | *(upload an OG image 1200×630; optional — skip if not ready)* |

### structuredData (paste this JSON into the JSON field)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "راهکارهای هوش مصنوعی",
      "serviceType": "AI consulting and development",
      "provider": {
        "@type": "Organization",
        "name": "استودیو آرمان",
        "url": "https://studioarman.com"
      },
      "areaServed": "IR",
      "url": "https://studioarman.com/fa/ai-solutions"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "خانه",
          "item": "https://studioarman.com/fa"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "راهکارهای هوش مصنوعی",
          "item": "https://studioarman.com/fa/ai-solutions"
        }
      ]
    },
    {
      "@type": "WebPage",
      "name": "راهکارهای هوش مصنوعی",
      "url": "https://studioarman.com/fa/ai-solutions"
    }
  ]
}
```

---

## 5. Dynamic Zone — 8 sections in order

Click **Add a component to Dynamic Zone** and add each section below in order.

---

### Section 1 — AI Hero (`dynamic-zone.ai-hero`)

| Field | Value |
|-------|-------|
| heading | `راهکارهای هوش مصنوعی که کسب‌وکار شما را متحول می‌کند` |
| sub_heading | `از ایده تا استقرار؛ ما عاملان هوشمند، اتوماسیون و تحلیل داده را متناسب با فرایندهای شما طراحی و پیاده‌سازی می‌کنیم.` |
| badge_text | `استودیو هوش مصنوعی` |
| Background | *(optional — upload a background image/video; falls back to animated particles)* |

**CTAs (shared.button, repeatable):**

| text | URL | variant |
|------|-----|---------|
| شروع پروژه | `/contact` | `primary` |
| مشاوره‌ی رایگان | `/contact` | `outline` |

---

### Section 2 — Capabilities (`dynamic-zone.capabilities`)

| Field | Value |
|-------|-------|
| heading | `چه کاری برای شما انجام می‌دهیم` |
| sub_heading | `مجموعه‌ای کامل از خدمات هوش مصنوعی، از مشاوره تا محصول نهایی.` |

**capabilities (shared.capability, repeatable) — 6 cards:**

| title | description | icon | span |
|-------|-------------|------|------|
| دستیار و چت‌بات هوشمند | پاسخ‌گویی خودکار، پشتیبانی ۲۴ساعته و دستیار داخلی سازمان بر پایه‌ی مدل‌های زبانی. | `IconMessageChatbot` | `two` |
| اتوماسیون فرایندها | حذف کارهای تکراری با گردش‌کارهای هوشمند و یکپارچه‌سازی ابزارها. | `IconRobot` | `one` |
| بینایی ماشین | پردازش تصویر و ویدئو برای کنترل کیفیت، تشخیص و دسته‌بندی. | `IconEye` | `one` |
| تحلیل و پیش‌بینی داده | مدل‌های پیش‌بینی، داشبورد و بینش‌های تصمیم‌ساز از داده‌های شما. | `IconChartHistogram` | `two` |
| جست‌وجوی دانش سازمانی (RAG) | پاسخ دقیق از روی اسناد و دانش داخلی شرکت شما. | `IconDatabaseSearch` | `one` |
| یکپارچه‌سازی مدل‌های زبانی | اتصال امن LLMها به محصولات و APIهای موجود شما. | `IconPlugConnected` | `one` |

> `span: two` makes a card take two columns in the bento grid.  
> Icon values are Tabler icon names used by the Next.js component.

---

### Section 3 — Process (`dynamic-zone.process`)

| Field | Value |
|-------|-------|
| heading | `چطور با هم کار می‌کنیم` |
| sub_heading | `یک مسیر شفاف و چهار مرحله‌ای از نیاز تا نتیجه.` |

**steps (shared.steps, repeatable) — 4 steps:**

| title | description | icon |
|-------|-------------|------|
| کشف و نیازسنجی | فرایندها و داده‌های شما را می‌شناسیم و فرصت‌های هوش مصنوعی را مشخص می‌کنیم. | `IconSearch` |
| طراحی راهکار | معماری، مدل و تجربه‌ی کاربری متناسب با هدف کسب‌وکار را طراحی می‌کنیم. | `IconPencilBolt` |
| پیاده‌سازی | راهکار را می‌سازیم، آزمایش می‌کنیم و با سیستم‌های شما یکپارچه می‌کنیم. | `IconCode` |
| استقرار و پشتیبانی | راه‌اندازی، پایش و بهبود مستمر پس از تحویل. | `IconRocket` |

---

### Section 4 — Use Cases (`dynamic-zone.use-cases`)

| Field | Value |
|-------|-------|
| heading | `کاربردها در صنایع مختلف` |
| sub_heading | `نمونه‌هایی از آنچه می‌توان ساخت.` |

**use_cases (shared.use-case, repeatable) — 5 cards:**

| title | category | description |
|-------|----------|-------------|
| پشتیبانی مشتری هوشمند | خرده‌فروشی | چت‌بات هوشمند که به‌صورت خودکار سوالات مشتریان را پاسخ می‌دهد و تجربه خرید را بهبود می‌بخشد. |
| تحلیل تصاویر پزشکی | سلامت | پردازش تصویر برای کمک به تشخیص بیماری‌ها و بهبود دقت نتایج آزمایشگاهی. |
| تشخیص تقلب | مالی | مدل‌های یادگیری ماشین که تراکنش‌های مشکوک را در لحظه شناسایی می‌کنند. |
| کنترل کیفیت بصری | تولید | سیستم‌های بینایی ماشین که نقص‌های محصول را در خط تولید شناسایی می‌کنند. |
| دستیار یادگیری شخصی | آموزش | محتوای آموزشی شخصی‌سازی‌شده که با سرعت و سبک یادگیری هر دانش‌آموز تطبیق می‌یابد. |

> `image` field is optional — the component shows a gradient placeholder when empty.

---

### Section 5 — Metrics (`dynamic-zone.metrics`)

| Field | Value |
|-------|-------|
| heading | `نتایجی که می‌سازیم` |
| sub_heading | `اعداد واقعی از پروژه‌های اجرا شده.` |

**metrics (shared.metric, repeatable) — 4 entries:**

| value | suffix | label | icon |
|-------|--------|-------|------|
| `40` | `٪` | کاهش هزینه‌ی عملیات | `IconTrendingDown` |
| `3` | `x` | سرعت پاسخ‌گویی | `IconBolt` |
| `2000` | `+` | ساعت صرفه‌جویی در سال | `IconClock` |
| `98` | `٪` | رضایت کاربران | `IconMoodSmile` |

> `value` is a decimal number (e.g. `40`, not `40٪`). The component animates a count-up to that value and appends `suffix`.

---

### Section 6 — Integrations (`dynamic-zone.integrations`)

| Field | Value |
|-------|-------|
| heading | `با ابزارهای شما کار می‌کند` |
| sub_heading | `اتصال امن به مدل‌ها، پایگاه‌های داده و سرویس‌های شما.` |

**integrations (shared.integration, repeatable):**

| title | iconName | href |
|-------|----------|------|
| OpenAI | `IconBrandOpenai` | `#` |
| Hugging Face | `IconBrandHuggingFace` | `#` |
| PostgreSQL | `IconBrandPostgresql` | `#` |
| Docker | `IconBrandDocker` | `#` |
| Python | `IconBrandPython` | `#` |
| Zapier | `IconBrandZapier` | `#` |

> `iconName` is a Tabler icon name used as a fallback when no `icon` media file is uploaded.  
> To use real logos: upload SVG/PNG to the `icon` media field instead (or in addition).

---

### Section 7 — FAQ (`dynamic-zone.faq`)

| Field | Value |
|-------|-------|
| heading | `سوال‌های پرتکرار` |
| sub_heading | `پاسخ سوالاتی که بیشترین بار می‌شنویم.` |

**faqs (relation → api::faq.faq):**  
Click **Add relation** and select the 4 FAQ entries created in Step 2.

---

### Section 8 — CTA (`dynamic-zone.cta`)

**CTAs (shared.button, repeatable):**

| text | URL | variant |
|------|-----|---------|
| مشاوره رایگان | `/contact` | `primary` |
| نمونه کارها | `/projects` | `outline` |

---

## 6. Optional sections (not seeded — require real assets)

### Trust bar / Brands (`dynamic-zone.brands`)

The seed intentionally omits this block because it needs real uploaded logo images.

To add it manually:
1. Upload client/partner logo files to the Media Library first.
2. Add a **Brands** component to the dynamic zone (position it between Hero and Capabilities).
3. Set `heading` to `مورد اعتماد تیم‌ها و کسب‌وکارها`.
4. Add each logo via the repeatable logos field.

### Testimonials (`dynamic-zone.testimonials`)

The seed omits this block because it requires real quotes and client photos.

To add it manually:
1. Add a **Testimonials** component after the Integrations section.
2. Set `heading` to `مشتریان ما چه می‌گویند`.
3. Add testimonial entries with: client name, role, company, quote text, and an optional avatar image.

---

## 7. Add the nav item and footer link

**Single Types → Global → Edit**

Set locale to **fa**.

### Navbar

Under **navbar → left_navbar_items**, click **Add an entry** and fill:

| Field | Value |
|-------|-------|
| text | `راهکارهای هوش مصنوعی` |
| URL | `/ai-solutions` |
| target | `_self` |

### Footer

Under **footer → internal_links**, click **Add an entry** and fill:

| Field | Value |
|-------|-------|
| text | `راهکارهای هوش مصنوعی` |
| URL | `/ai-solutions` |
| target | `_self` |

Click **Save** on the Global entry.

---

## 8. Publish

Back in the **Pages** entry for `ai-solutions`:

1. Review all sections in the preview.
2. Click **Publish** (top-right).
3. The page is now live at `/fa/ai-solutions`.

---

## 9. Verifying SEO

After publishing, check:

- `GET /fa/ai-solutions` — view source and confirm `<title>`, `<meta name="description">`, `<link rel="canonical">` are all populated.
- `GET /sitemap.xml` — confirm `/fa/ai-solutions` appears (requires the sitemap wiring in `next/app/sitemap.ts` described in the design spec).
- Paste the `structuredData` JSON into [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate schema.org markup.
- Check Open Graph with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) once the `metaImage` is uploaded.

---

## 10. Editing copy after creation

All section text is editable in **Content-Type Manager → Pages → ai-solutions**.  
Expand the relevant Dynamic Zone block, edit the fields, and click **Save** then **Publish**.

FAQ answers are edited in **Content-Type Manager → FAQ** — changes reflect immediately since FAQ has no draft/publish.
