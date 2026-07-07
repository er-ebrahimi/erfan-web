export function localizeHref(
  url: string | undefined | null,
  locale: string,
): string {
  if (!url) return `/${locale}`;
  if (url.startsWith('http')) return url;
  return `/${locale}${url.startsWith('/') ? url : `/${url}`}`;
}
