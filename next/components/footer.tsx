import { Link } from 'next-view-transitions';

import { BackToTop } from '@/components/back-to-top';
import { EnamadWrapper } from '@/components/enamad-wrapper';
import { Logo } from '@/components/logo';
import { localizeHref } from '@/lib/url';

export const Footer = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  if (!data) return null;

  return (
    <footer className="border-t border-border/80 bg-background/50 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-4 sm:px-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center text-center md:items-start md:text-start">
          {data?.logo?.image && (
            <Logo image={data.logo.image} locale={locale} />
          )}
          {data?.description && (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {data.description}
            </p>
          )}
          {data?.copyright && (
            <p className="mt-3 text-xs text-muted-foreground">
              {data.copyright}
            </p>
          )}
          <div className="mt-4">
            <EnamadWrapper />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 md:items-end">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 md:text-start">
            <LinkSection links={data?.internal_links} locale={locale} />
            <LinkSection links={data?.policy_links} locale={locale} />
            <LinkSection links={data?.social_media_links} locale={locale} />
          </div>

          <div className="flex items-center gap-4">
            {data?.designed_developed_by && (
              <span className="text-xs text-muted-foreground">
                {data.designed_developed_by}
              </span>
            )}
            {data?.built_with && (
              <span className="text-xs text-muted-foreground">
                {data.built_with}
              </span>
            )}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
};

const LinkSection = ({
  links,
  locale,
}: {
  links?: { text?: string | null; URL?: string | null }[] | null;
  locale: string;
}) => {
  if (!links?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {links.map((link, index) =>
        link?.text ? (
          <Link
            key={`${link.text}-${index}`}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground/80 sm:text-sm"
            href={localizeHref(link.URL, locale)}
          >
            {link.text}
          </Link>
        ) : null
      )}
    </div>
  );
};
