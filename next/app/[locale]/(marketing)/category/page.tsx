import { IconCategory } from '@tabler/icons-react';
import { type Metadata } from 'next';
import { Link } from 'next-view-transitions';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { Category } from '@/types/types';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const seo = {
    metaTitle: 'Blog Categories',
    metaDescription: 'Browse our articles by category',
  };
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const categoriesData = await fetchContentType(
    'categories',
    {
      locale: params.locale,
    },
    false
  );

  const categories = categoriesData?.data || [];

  const localizedSlugs = { [params.locale]: 'category' };

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconCategory className="h-6 w-6 text-primary-foreground" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            Categories
          </Heading>
          <Subheading className="max-w-3xl mx-auto">
            Explore our latest articles by topic
          </Subheading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {categories.map((category: Category) => (
            <Link
              href={`/${params.locale}/category/${category.slug || category.name}`}
              key={category.slug || category.name}
              className="flex flex-col items-center p-6 bg-card border border-border rounded-xl hover:border-primary transition-colors group"
            >
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
