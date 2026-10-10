import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import { Portfolio } from '@/types/types';

export const PortfolioProjects = ({
  heading,
  sub_heading,
  kind = 'all',
  portfolios = [],
}: {
  heading?: string;
  sub_heading?: string;
  kind?: string;
  portfolios?: Portfolio[];
}) => {
  const filtered =
    !kind || kind === 'all'
      ? portfolios
      : portfolios.filter((portfolio) => portfolio?.type === kind);

  if (!filtered || filtered.length === 0) {
    return null;
  }

  return (
    <Container className="py-20">
      {(heading || sub_heading) && (
        <div className="mb-10">
          {heading && <Heading className="pt-4">{heading}</Heading>}
          {sub_heading && (
            <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((portfolio) => (
          <PortfolioCard key={portfolio?.id} portfolio={portfolio} />
        ))}
      </div>
    </Container>
  );
};
