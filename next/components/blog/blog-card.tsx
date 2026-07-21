import { format } from 'date-fns-jalali';
import { Link } from 'next-view-transitions';

import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { truncate } from '@/lib/utils';
import { Article } from '@/types/types';

export const BlogCard = ({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) => {
  return (
    <div
      className="shadow-derek grid grid-cols-1 md:grid-cols-2 rounded-3xl group border border-transparent hover:border-border w-full hover:bg-card/50 overflow-hidden hover:scale-[1.02] transition duration-200 relative max-h-[24rem]"
    >
      <Link
        href={`/${locale}/category/${article.slug}`}
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">Read more about {article.title}</span>
      </Link>

      <div className="pointer-events-none z-10 h-full">
        {article.image ? (
          <BlurImage
            src={strapiImage(article.image.url)}
            alt={article.title}
            height={1200}
            width={1200}
            className="h-full object-cover object-top w-full rounded-3xl"
          />
        ) : (
          <div className="h-full flex items-center justify-center group-hover:bg-card/50">
            {/* <Logo /> */}
          </div>
        )}
      </div>
      <div className="p-4 md:p-8 group-hover:bg-card/50 flex flex-col justify-between pointer-events-none z-10 relative">
        <div>
          <div className="flex gap-4 flex-wrap mb-4 pointer-events-auto">
            {article.categories?.map((category, idx) => (
              <Link
                key={`category-${idx}`}
                href={`/category/${category.slug || category.name}`}
                className="text-xs font-bold text-primary-foreground px-4 py-2 rounded-full bg-primary capitalize hover:opacity-80 transition-opacity relative z-20"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <p className="text-lg md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-balance">{article.title}</span>
          </p>
          <p className="text-base md:text-xl mt-2 text-primary-foreground-foreground">
            {truncate(article.description, 500)}
          </p>
        </div>
        <div className="flex space-x-2 items-center  mt-6">
          {/* <Image
            src={article.authorAvatar}
            alt={article.author}
            width={20}
            height={20}
            className="rounded-full h-5 w-5"
          /> */}
          {/* <p className="text-sm font-normal text-primary-foreground">{article.author}</p> */}
          <p className="text-muted-foreground text-sm  max-w-xl group-hover:text-foreground transition duration-200">
            {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const BlogCardVertical = ({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) => {
  return (
    <div
      className="shadow-derek   rounded-3xl group border border-transparent hover:border-border w-full hover:bg-card/50  overflow-hidden  hover:scale-[1.02] transition duration-200 relative"
    >
      <Link
        href={`/${locale}/category/${article.slug}`}
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">Read more about {article.title}</span>
      </Link>
      <div className="pointer-events-none z-10">
        {article.image ? (
          <BlurImage
            src={strapiImage(article.image.url || '')}
            alt={article.title}
            height={800}
            width={800}
            className=" h-64 md:h-96 object-cover object-top w-full rounded-3xl"
          />
        ) : (
          <div className=" h-64 md:h-96 flex items-center justify-center group-hover:bg-card/50">
            {/* <Logo /> */}
          </div>
        )}
      </div>
      <div className="p-4 md:p-8 group-hover:bg-card/50 flex flex-col justify-between pointer-events-none z-10 relative">
        <div>
          <div className="flex gap-4 flex-wrap mb-4 pointer-events-auto">
            {article.categories?.map((category, idx) => (
              <Link
                key={`category-${idx}`}
                href={`/category/${category.slug || category.name}`}
                className="text-xs font-bold text-primary-foreground px-4 py-2 rounded-full bg-primary capitalize hover:opacity-80 transition-opacity relative z-20"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <p className="text-lg md:text-xl font-bold mb-4">
            <span className="text-balance">{article.title}</span>
          </p>
          <p className="text-left text-sm md:text-base mt-2 text-muted-foreground">
            {truncate(article.description, 500)}
          </p>
        </div>
        <div className="flex space-x-2 items-center  mt-6">
          {/* <Image
            src={article.authorAvatar}
            alt={article.author}
            width={20}
            height={20}
            className="rounded-full h-5 w-5"
          />
          <p className="text-sm font-normal text-primary-foreground">{article.author}</p> */}
          <p className="text-muted-foreground text-sm  max-w-xl group-hover:text-foreground transition duration-200">
            {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};
