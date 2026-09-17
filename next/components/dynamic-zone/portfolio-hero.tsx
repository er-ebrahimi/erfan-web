import {
  IconBrandDribbble,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconLink,
  IconUser,
} from '@tabler/icons-react';
import { useId } from 'react';

import { BlurImage } from '@/components/blur-image';
import { Container } from '@/components/container';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { PortfolioSocialLink } from '@/types/types';

const socialIconMap: Record<string, any> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  twitter: IconBrandTwitter,
  telegram: IconBrandTelegram,
  whatsapp: IconBrandWhatsapp,
  youtube: IconBrandYoutube,
  dribbble: IconBrandDribbble,
};

const normalizeIcon = (icon?: string) =>
  (icon || '')
    .toLowerCase()
    .replace(/^iconbrand/, '')
    .trim();

export const PortfolioHero = ({
  name,
  title,
  bio,
  circular_text,
  avatar,
  social_links = [],
}: {
  name?: string;
  title?: string;
  bio?: string;
  circular_text?: string;
  avatar?: any;
  social_links?: PortfolioSocialLink[];
}) => {
  const hasContent =
    name || title || bio || circular_text || avatar || social_links.length > 0;

  if (!hasContent) {
    return null;
  }

  const ringId = `portfolio-circular-text-${useId().replace(/:/g, '')}`;

  return (
    <Container className="relative py-20 md:py-28">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center md:text-start">
          {title && (
            <p className="text-primary font-medium tracking-wide mb-2">
              {title}
            </p>
          )}
          {name && (
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              {name}
            </h1>
          )}
          {bio && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              {bio}
            </p>
          )}
          {social_links.length > 0 && (
            <div className="flex items-center justify-center md:justify-start gap-3 mt-8">
              {social_links.map((social, idx) => {
                const Icon =
                  socialIconMap[normalizeIcon(social.icon)] ?? IconLink;
                return (
                  <a
                    key={`social-${idx}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name || social.url}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          {circular_text && (
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] text-muted-foreground animate-[spin_20s_linear_infinite]"
            >
              <defs>
                <path
                  id={ringId}
                  d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
                  fill="none"
                />
              </defs>
              <text className="fill-current" fontSize="12.5" letterSpacing="2">
                <textPath href={`#${ringId}`} startOffset="0%">
                  {(circular_text + ' ').repeat(2)}
                </textPath>
              </text>
            </svg>
          )}
          {avatar ? (
            <BlurImage
              src={strapiImage(avatar.url)}
              alt={avatar.alternativeText || name || 'Portfolio avatar'}
              width={256}
              height={256}
              className="h-44 w-44 md:h-52 md:w-52 rounded-full object-cover border-4 border-card shadow-derek"
            />
          ) : (
            <div className="h-44 w-44 md:h-52 md:w-52 rounded-full bg-muted flex items-center justify-center">
              <IconUser className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
