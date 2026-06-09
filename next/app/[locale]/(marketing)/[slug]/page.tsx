import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import PageContent from "@/lib/shared/PageContent";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { generateMetadataObject } from "@/lib/shared/metadata";
import ClientSlugHandler from "../ClientSlugHandler";

export const revalidate = 60;

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
  const { isEnabled } = await draftMode();
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
    },
    true,
    { preview: isEnabled }
  );

  if (!pageData) {
    notFound();
  }

  const localizedSlugs = pageData?.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: params.slug }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
