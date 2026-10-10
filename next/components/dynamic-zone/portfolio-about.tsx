import { Container } from '@/components/container';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { StrapiImage } from '@/components/ui/strapi-image';
import { PortfolioParagraph, PortfolioSkill } from '@/types/types';

export const PortfolioAbout = ({
  heading,
  about_intro,
  about_paragraphs = [],
  about_image,
  skills = [],
}: {
  heading?: string;
  about_intro?: string;
  about_paragraphs?: PortfolioParagraph[];
  about_image?: any;
  skills?: PortfolioSkill[];
}) => {
  const hasContent =
    heading ||
    about_intro ||
    about_paragraphs?.length > 0 ||
    about_image ||
    skills?.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <Container className="py-20">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          {heading && (
            <div className="flex items-center gap-3 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {heading}
              </h2>
            </div>
          )}
          {about_intro && (
            <p className="text-lg font-semibold text-foreground leading-relaxed">
              {about_intro}
            </p>
          )}
          {about_paragraphs.map((paragraph, idx) => (
            <p
              key={`paragraph-${idx}`}
              className="mt-4 text-base text-muted-foreground leading-relaxed"
            >
              {paragraph.text}
            </p>
          ))}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {skills.map((skill, idx) => (
                <SkillBadge key={`skill-${idx}`} name={skill.name} />
              ))}
            </div>
          )}
        </div>

        {about_image && (
          <StrapiImage
            src={about_image.url}
            alt={about_image.alternativeText}
            width={800}
            height={600}
            className="rounded-3xl object-cover shadow-derek w-full h-auto max-h-[28rem]"
          />
        )}
      </div>
    </Container>
  );
};
