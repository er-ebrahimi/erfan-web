'use client';

import ContactUs from './contact-us';
import { StrapiImage } from '@/components/ui/strapi-image';
import type { StrapiImage as StrapiImageType } from '@/types/types';

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
  social_media_icon_links,
  image,
}: {
  heading: string;
  sub_heading: string;
  form: any;
  section: any;
  social_media_icon_links: any;
  image?: StrapiImageType | null;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      <div className="relative z-20 w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <ContactUs Title={heading} Description={sub_heading} />
      </div>
      <div className="relative w-full hidden md:flex border-l border-border overflow-hidden bg-muted">
        {image?.url ? (
          <StrapiImage
            src={image.url}
            alt={image.alternativeText}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted" />
        )}
      </div>
    </div>
  );
}
