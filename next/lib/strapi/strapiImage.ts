export function strapiImage(url: string): string {
  if (url.startsWith('/')) {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL;

    if (!base && typeof document !== 'undefined' && document?.location.host.endsWith('.strapidemo.com')) {
      return `https://${document.location.host.replace('client-', 'api-')}${url}`;
    }

    return (base || '') + url;
  }
  return url;
}
