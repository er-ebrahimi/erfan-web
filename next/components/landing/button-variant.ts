type ShadcnButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'destructive';

/** Strapi `shared.button` variants → shadcn Button variants. */
export function toButtonVariant(variant?: string | null): ShadcnButtonVariant {
  switch (variant) {
    case 'outline':
      return 'outline';
    case 'muted':
      return 'secondary';
    case 'simple':
      return 'ghost';
    case 'link':
      return 'link';
    default:
      return 'default';
  }
}
