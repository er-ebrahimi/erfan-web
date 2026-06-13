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
      populate: "seo.metaImage",
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
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
