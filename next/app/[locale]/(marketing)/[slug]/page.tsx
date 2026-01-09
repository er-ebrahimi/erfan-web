import { IconClipboardText } from '@tabler/icons-react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClientSlugHandler from '../ClientSlugHandler';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogPostRows } from '@/components/blog/blog-post-rows';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { Article, Category } from '@/types/types';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  
  // Fetch category to get name for title
  const categoriesData = await fetchContentType(
    'categories',
    {
      filters: { 
        slug: params.slug,
        // locale: params.locale // Categories might not be localized or handled differently, but let's try
      },
    },
    false
  );
  
  const category = categoriesData?.data?.[0];

  if (!category) {
    return {
      title: 'Category not found',
    };
  }

  const seo = {
    metaTitle: `${category.name} - Blog Category`,
    metaDescription: `Read articles about ${category.name}`,
  };
  
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const { locale, slug } = params;

  // Fetch category details
  const categoriesData = await fetchContentType(
    'categories',
    {
      filters: { 
        slug: slug,
      },
    },
    false
  );

  const category = categoriesData?.data?.[0];

  if (!category) {
    return notFound();
  }

  // Fetch articles for this category
  const articles = await fetchContentType(
    'articles',
    {
      filters: { 
        locale: locale,
        categories: {
          slug: {
            $eq: slug
          }
        }
      },
    },
    false
  );

  // We can't easily determine localized slugs for a category unless we fetch all localizations of the category
  // For now, we'll just map the current locale
  const localizedSlugs = { [locale]: `blog/category/${slug}` };

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconClipboardText className="h-6 w-6 text-primary-foreground" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {category.name}
          </Heading>
          <Subheading className="max-w-3xl mx-auto">
            Articles in {category.name}
          </Subheading>
        </div>

        {articles.data.length > 0 && (
           <div className="w-full">
            {/* Show first article as featured if it exists, similar to main blog page */}
            {articles.data.slice(0, 1).map((article: Article) => (
              <BlogCard
                article={article}
                locale={locale}
                key={article.title}
              />
            ))}
            
            <BlogPostRows articles={articles.data} />
           </div>
        )}
        
        {articles.data.length === 0 && (
            <p className="text-muted-foreground text-lg mt-10">No articles found in this category.</p>
        )}

      </Container>
    </div>
  );
}
