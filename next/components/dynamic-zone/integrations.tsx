'use client';

import { IconPlugConnected } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { FloatingDock } from '../ui/floating-dock';
import { getStrapiMedia, StrapiImage } from '../ui/strapi-image';
import { getLocaleConfig } from '@/lib/fonts';
import { getTablerIcon } from '@/lib/constants/icon-map';
import { cn } from '@/lib/utils';

interface Integration {
  id?: number;
  title: string;
  icon?: any;
  iconName?: string;
  href?: string;
}

interface IntegrationsProps {
  heading: string;
  sub_heading: string;
  integrations?: Integration[];
  locale: string;
}

export const Integrations = ({
  heading,
  sub_heading,
  integrations,
  locale,
}: IntegrationsProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);

  const dockItems = (integrations ?? []).map((integration) => {
    let iconNode: React.ReactNode;

    const iconUrl: string | null = integration.icon?.url
      ? getStrapiMedia(integration.icon.url)
      : null;

    if (iconUrl) {
      iconNode = (
        <StrapiImage
          src={integration.icon.url}
          alt={integration.icon.alternativeText ?? integration.title}
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      );
    } else {
      // Fall back to tabler icon name, then 'IconPlug' as final default
      const IconComponent = getTablerIcon(integration.iconName ?? 'IconPlug');
      iconNode = <IconComponent className="h-6 w-6" />;
    }

    // Integrations are display-only proof badges, not navigation. When there is
    // no real destination, render them non-clickable instead of a dead '#' link
    // (which would otherwise jump the visitor to the top of the page).
    const hasRealLink = !!integration.href && integration.href !== '#';

    return {
      title: integration.title,
      href: integration.href ?? '#',
      icon: iconNode,
      ...(hasRealLink ? {} : { onClick: () => {} }),
    };
  });

  return (
    <section className={cn('py-20 relative overflow-hidden', fontClass)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-400/30 to-transparent" />
      <Container>
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconPlugConnected className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {/* Floating dock — centered */}
        {dockItems.length > 0 && (
          <div className="flex justify-center">
            <FloatingDock
              items={dockItems}
              desktopClassName="bg-white border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700/60"
              mobileClassName="mx-auto"
            />
          </div>
        )}
      </Container>
    </section>
  );
};
