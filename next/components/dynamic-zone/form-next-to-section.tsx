'use client';

import ContactUs from './contact-us';
import { StrapiImage } from '@/components/ui/strapi-image';
import type { StrapiImage as StrapiImageType } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import logoWhite from '@/public/logo-white.png'
import logoBlack from '@/public/logo-black.png'
interface SocialLinkItem {
  id: number;
  image: {
    url: string;
    alternativeText: string | null;
    width?: number;
    height?: number;
  };
  link: Array<{
    id: number;
    text: string;
    URL: string;
    info: string;
    target: '_blank' | '_self' | '_parent' | '_top';
  }>;
}

export function FormNextToSection({
  heading,
  sub_heading,
  social_media_icon_links,
  image,
  title,
  description,
}: {
  heading: string;
  sub_heading: string;
  social_media_icon_links: SocialLinkItem[];
  image?: StrapiImageType | null;
  title: string;
  description: string;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      <div className="  px-4 pt-24 lg:pt-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24 flex flex-col border-l border-border overflow-hidden bg-muted">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground whitespace-pre-line">{description}</p>
        <ul className="mt-4 p-5">
          {social_media_icon_links.map((item, index) => {
            return <li key={index} className="flex items-center justify-center gap-2 my-2">
              <Link href={item.link[0]?.URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 flex-row bg-card shadow-sm rounded-lg p-2 hover:bg-accent/80 transition-colors w-72">
                <StrapiImage alt={item.image.alternativeText} src={item.image.url} width={40} height={40} />
                <div className="text-xs text-foreground flex flex-col gap-1">
                  <div>
                    {item.link[0]?.text}
                  </div>
                  <div>
                    {item.link[0]?.info}
                  </div>
                </div>
              </Link>
            </li>;
          })}
        </ul>
        <div className="flex-1 flex items-center justify-center absolute bottom-0">
          <Image src={logoWhite} alt="Logo" width={700} height={700} className="opacity-10 hidden dark:block" />
          <Image src={logoBlack} alt="Logo" width={700} height={700} className="opacity-10 dark:hidden" />
        </div>
      </div>
      <div className="relative z-20 w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24 overflow-hidden">
        {image?.url && (
          <StrapiImage
            alt={image.alternativeText ?? ''}
            src={image.url}
            fill
            className="object-cover -z-10"
          />
        )}
        <ContactUs Title={heading} Description={sub_heading} />
      </div>
    </div>
  );
}
