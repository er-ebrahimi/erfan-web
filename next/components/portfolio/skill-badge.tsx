import { cn } from '@/lib/utils';

export const SkillBadge = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1',
        className
      )}
    >
      {name}
    </span>
  );
};
