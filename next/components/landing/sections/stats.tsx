import CountUp from '../effects/count-up';
import type { LandingStatsProps } from '../types';

export function LandingStats({ items }: LandingStatsProps) {
  const stats = (items ?? []).filter(
    (item) => item?.label && item.value != null
  );
  if (stats.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-border/80 bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-border/60 rtl:sm:divide-x-reverse">
            {stats.map((item, index) => (
              <div
                key={item.id ?? `${item.label}-${index}`}
                className="flex flex-col items-center justify-center p-4 text-center sm:p-6"
              >
                <div
                  className="flex items-baseline justify-center text-4xl font-extrabold text-foreground sm:text-5xl"
                  dir="ltr"
                >
                  <CountUp
                    to={item.value ?? 0}
                    duration={1.6}
                    className="tabular-nums"
                  />
                  {item.suffix && (
                    <span className="ms-0.5 text-primary">{item.suffix}</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
