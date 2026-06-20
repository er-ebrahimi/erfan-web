import { Metadata } from "next";
import PageContent from "@/lib/shared/PageContent";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { generateMetadataObject } from "@/lib/shared/metadata";
import ClientSlugHandler from "../ClientSlugHandler";
import { JsonLd } from "@/components/seo/json-ld";

function parseStructuredData(value: unknown) {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
      populate: { seo: { populate: "*" }, localizations: true },
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  // hreflang alternates — emit a language map across all localized versions
  const BASE = "https://studioarman.com";
  const languages: Record<string, string> = {
    [params.locale]: `${BASE}/${params.locale}/${params.slug}`,
  };
  for (const loc of pageData?.localizations ?? []) {
    if (loc?.locale && loc?.slug) {
      languages[loc.locale] = `${BASE}/${loc.locale}/${loc.slug}`;
    }
  }
  languages["x-default"] = languages["fa"] ?? languages[params.locale];
  metadata.alternates = { ...(metadata.alternates ?? {}), languages };

  return metadata;
}

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
    },
    true
  );

  const localizedSlugs = pageData?.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: params.slug }
  );

  return (
    <>
      <JsonLd data={parseStructuredData(pageData?.seo?.structuredData)} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
