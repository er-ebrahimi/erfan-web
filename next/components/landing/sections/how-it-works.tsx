import { Timeline, type TimelineEntry } from '../effects/timeline';
import { iconFor } from '../icons';
import type { LandingHowItWorksProps } from '../types';

export function LandingHowItWorks({
  heading,
  sub_heading,
  steps,
}: LandingHowItWorksProps) {
  if (!heading && !sub_heading && !steps?.length) return null;

  const data: TimelineEntry[] = (steps ?? [])
    .filter((step) => step?.title)
    .map((step, index) => {
      const Icon = iconFor(step.icon);
      return {
        title: step.title ?? '',
        content: (
          <div className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="text-start text-base font-bold text-foreground sm:text-lg">
                  {step.title}
                </h3>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
            </div>
            {step.description && (
              <p className="mt-4 text-start text-sm leading-relaxed text-muted-foreground sm:text-base">
                {step.description}
              </p>
            )}
          </div>
        ),
      };
    });

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        {heading && (
          <h2 className="text-center text-3xl font-extrabold leading-[1.5] text-foreground sm:text-4xl">
            {heading}
          </h2>
        )}
        {sub_heading && (
          <p className="mx-auto mt-3 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
            {sub_heading}
          </p>
        )}
        {data.length > 0 && (
          <div className="mt-12">
            <Timeline data={data} />
          </div>
        )}
      </div>
    </section>
  );
}
