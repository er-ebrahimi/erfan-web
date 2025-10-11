'use client';

import { format } from 'date-fns';
import FuzzySearch from 'fuzzy-search';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from 'next-view-transitions';
import React, { useEffect, useState } from 'react';

import { truncate } from '@/lib/utils';
import { Article } from '@/types/types';

export const BlogPostRows = ({ articles }: { articles: Article[] }) => {
  const [search, setSearch] = useState('');
  const t = useTranslations('blog');
  const locale = useLocale();

  const searcher = new FuzzySearch(articles, ['title'], {
    caseSensitive: false,
  });

  const [results, setResults] = useState(articles);
  useEffect(() => {
    const results = searcher.search(search);
    setResults(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="w-full py-20">
      <div className="flex sm:flex-row flex-col justify-between gap-4 items-center mb-10">
        <p className="text-2xl font-bold text-foreground">{t('morePosts')}</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="text-sm min-w-full sm:min-w-96 p-2 rounded-md bg-input border border-border focus:ring-2 focus:ring-ring focus:outline-none outline-none text-foreground placeholder-muted-foreground"
        />
      </div>

      <div className="divide-y divide-border">
        {results.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">
            {t('noResults')}
          </p>
        ) : (
          results.map((article, index) => (
            <BlogPostRow article={article} key={article.slug + index} />
          ))
        )}
      </div>
    </div>
  );
};

export const BlogPostRow = ({ article }: { article: Article }) => {
  return (
    <Link
      href={`blog/${article.slug}`}
      key={`${article.slug}`}
      className="flex md:flex-row flex-col items-start justify-between md:items-center group py-4"
    >
      <div>
        <p className="text-foreground text-lg font-medium group-hover:text-primary transition duration-200">
          {article.title}
        </p>
        <p className="text-muted-foreground text-sm mt-2 max-w-xl group-hover:text-foreground transition duration-200">
          {truncate(article.description, 80)}
        </p>

        <div className="flex gap-2 items-center my-4">
          <p className="text-muted-foreground text-sm max-w-xl group-hover:text-foreground transition duration-200">
            {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
          </p>
          <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
          <div className="flex gap-4 flex-wrap ">
            {article.categories?.map((category, idx) => (
              <p
                key={`category-${idx}`}
                className="text-xs font-bold text-primary-foreground px-2 py-1 rounded-full bg-primary capitalize"
              >
                {category.name}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/* <Image
        src={blog.authorAvatar}
        alt={blog.author}
        width={40}
        height={40}
        className="rounded-full md:h-10 md:w-10 h-6 w-6 mt-4 md:mt-0 object-cover"
      /> */}
    </Link>
  );
};
