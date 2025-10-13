'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface DynamicZoneComponent {
  __component: string;
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
}

const componentMapping: { [key: string]: any } = {
  'dynamic-zone.hero': dynamic(() => import('./hero').then((mod) => mod.Hero), {
    ssr: true,
  }),
  'dynamic-zone.hero-picture': dynamic(
    () => import('./hero-picture').then((mod) => mod.HeroPicture),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.features': dynamic(
    () => import('./features').then((mod) => mod.Features),
    { ssr: true }
  ),
  'dynamic-zone.testimonials': dynamic(
    () => import('./testimonials').then((mod) => mod.Testimonials),
    { ssr: true }
  ),
  'dynamic-zone.how-it-works': dynamic(
    () => import('./how-it-works').then((mod) => mod.HowItWorks),
    { ssr: true }
  ),
  'dynamic-zone.brands': dynamic(
    () => import('./brands').then((mod) => mod.Brands),
    { ssr: true }
  ),
  'dynamic-zone.pricing': dynamic(
    () => import('./pricing').then((mod) => mod.Pricing),
    { ssr: true }
  ),
  'dynamic-zone.launches': dynamic(
    () => import('./launches-card').then((mod) => mod.LaunchesCard),
    { ssr: true }
  ),
  'dynamic-zone.cta': dynamic(() => import('./cta').then((mod) => mod.CTA), {
    ssr: true,
  }),
  'dynamic-zone.form-next-to-section': dynamic(
    () => import('./form-next-to-section').then((mod) => mod.FormNextToSection),
    { ssr: true }
  ),
  'dynamic-zone.faq': dynamic(() => import('./faq').then((mod) => mod.FAQ), {
    ssr: true,
  }),
  'dynamic-zone.related-products': dynamic(
    () => import('./related-products').then((mod) => mod.RelatedProducts),
    { ssr: true }
  ),
  'dynamic-zone.related-articles': dynamic(
    () => import('./related-articles').then((mod) => mod.RelatedArticles),
    { ssr: true }
  ),
  'dynamic-zone.cons': dynamic(
    () => import('./cons').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.promised-land': dynamic(
    () => import('./promised-land').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.guide': dynamic(
    () => import('./guide').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.plans': dynamic(
    () => import('./plans').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.project-pictures': dynamic(
    () => import('./project-pictures').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.contact': dynamic(
    () => import('./contact-us').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
  'dynamic-zone.team-members': dynamic(
    () => import('./team-members').then((mod) => mod.default),
    {
      ssr: true,
    }
  ),
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale }) => {
  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.__component];
        if (!Component) {
          console.warn(`No component found for: ${componentData.__component}`);
          return null;
        }
        return (
          <Component
            key={`${componentData.__component}-${componentData.id}-${index}`}
            {...componentData}
            locale={locale}
          />
        );
      })}
    </div>
  );
};

export default DynamicZoneManager;
