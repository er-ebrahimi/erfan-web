'use client';

import {
  IconArrowUpRight,
  IconBriefcase,
  IconExternalLink,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { BlurImage } from '@/components/blur-image';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { truncate } from '@/lib/utils';
import { Portfolio } from '@/types/types';

export const PortfolioCard = ({ portfolio }: { portfolio: Portfolio }) => {
  const t = useTranslations('portfolio');
  const isSideProject = portfolio.type === 'side-project';
  const link = portfolio.link;
  const label = link
    ? portfolio.link_text || (isSideProject ? t('viewLive') : t('viewProject'))
    : null;
  const image = portfolio.card_image;

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-3xl border border-transparent hover:border-border hover:bg-card/50 p-4 md:p-6 transition duration-200">
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          aria-label={label || portfolio.title}
          className="absolute inset-0 z-0"
        >
          <span className="sr-only">{label || portfolio.title}</span>
        </a>
      )}

      <div className="pointer-events-none z-10 shrink-0">
        {image ? (
          <BlurImage
            src={strapiImage(image.url)}
            alt={portfolio.title}
            width={128}
            height={128}
            className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-muted flex items-center justify-center">
            <IconBriefcase className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="pointer-events-none z-10 flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-lg md:text-xl font-bold text-foreground">
            {portfolio.title}
          </p>
          {isSideProject && portfolio.tag && (
            <span className="text-xs font-bold text-primary-foreground px-2 py-1 rounded-full bg-primary">
              {portfolio.tag}
            </span>
          )}
        </div>
        {portfolio.description && (
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
            {truncate(portfolio.description, 220)}
          </p>
        )}
        {portfolio.technologies && portfolio.technologies.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {portfolio.technologies.map((tech, idx) => (
              <SkillBadge
                key={`${portfolio.id}-tech-${idx}`}
                name={tech.name}
              />
            ))}
          </div>
        )}
      </div>

      {link && label && (
        <div className="pointer-events-auto z-20 flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex text-sm font-medium text-primary">
            {label}
          </span>
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-background text-foreground group-hover:text-primary group-hover:border-primary transition-colors">
            {isSideProject ? (
              <IconExternalLink className="h-4 w-4" />
            ) : (
              <IconArrowUpRight className="h-4 w-4" />
            )}
          </span>
        </div>
      )}
    </div>
  );
};
