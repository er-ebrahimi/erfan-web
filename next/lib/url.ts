export function localizeHref(
  url: string | undefined | null,
  locale: string
): string {
  if (!url) return `/${locale}`;
  if (
    url.startsWith('http') ||
    url.startsWith('#') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  ) {
    return url;
  }
  return `/${locale}${url.startsWith('/') ? url : `/${url}`}`;
}
