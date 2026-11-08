/**
 * THROWAWAY preview route for eyeballing the new Bento Grid component with
 * real Tailwind + the real layout chrome. Delete alongside the hero-lab folder.
 */
import { BentoGrid } from '@/components/dynamic-zone/bento-grid';
import { StrapiImage } from '@/types/types';

const S = 'https://strapi.studioarman.com/uploads';

const img = (file: string, alt: string, w = 1600, h = 1200) =>
  ({ url: `${S}/${file}`, width: w, height: h, alternativeText: alt }) as unknown as StrapiImage;

const KITCHEN = img(
  'Luxury_White_Kitchen_Design_4e99f472e0.webp',
  'آشپزخانه سفید کلاسیک با جزیره سنگ مرمر'
);
const WOOD = img(
  'large_Neoclassical_kitchen_1aa4a7a6e1.webp',
  'آشپزخانه نئوکلاسیک با دیوار چوبی'
);
const TV = img(
  'large_odern_cream_tv_wall_wood_slat_design_7e33638609.webp',
  'دیوار تلویزیون با طراحی چوبی'
);
const LIGHT = img(
  'large_kitchen_lighting_ideas_7913c0bf58.webp',
  'نورپردازی آشپزخانه'
);

export default function BentoScreen() {
  return (
    <div className="pt-32">
      <BentoGrid
        locale="fa"
        heading="شرکت طراحی داخلی و معماری داخلی در تهران | استودیو آرمان"
        sub_heading="استودیو آرمان با بیش از ۱۰ سال تجربه، ارائه‌دهنده خدمات طراحی داخلی، بازسازی و اجرای فضاهای مسکونی، اداری، تجاری و ویلا؛ از طراحی و انتخاب متریال تا اجرای کامل پروژه."
        CTAs={[
          { id: 'c1', text: 'رزرو تماس', URL: '/contact', variant: 'primary' },
        ]}
        tiles={[
          { id: 1, Image: KITCHEN, Size: 'lead' },
          { id: 2, Image: WOOD, Size: 'wide' },
          { id: 3, Image: TV, Size: 'square' },
          { id: 4, Image: LIGHT, Size: 'square' },
        ]}
      />

      <div className="h-24" />

      <BentoGrid
        locale="fa"
        heading="هر چهار اندازه سلول"
        sub_heading="lead در دو محور، wide در ستون‌ها، tall در سطرها و square یک در یک. چیدمان با جریان dense جاهای خالی را پر می‌کند."
        tiles={[
          { id: 1, Image: KITCHEN, Size: 'lead' },
          { id: 2, Image: WOOD, Size: 'tall' },
          { id: 3, Image: TV, Size: 'wide' },
          { id: 4, Image: LIGHT, Size: 'square' },
          { id: 5, Image: WOOD, Size: 'square' },
          { id: 6, Image: TV, Size: 'wide' },
        ]}
      />
    </div>
  );
}
