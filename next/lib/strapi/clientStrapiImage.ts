export function clientStrapiImage(url: string): string {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (url.startsWith('/')) {
    return (base || '') + url;
  }

  if (url.startsWith('http') && base) {
    try {
      const urlObj = new URL(url);
      const baseObj = new URL(base);
      if (urlObj.host !== baseObj.host) {
        urlObj.host = baseObj.host;
        return urlObj.toString();
      }
    } catch {
      console.warn('Invalid URL in clientStrapiImage:', url);
    }
  }

  return url;
}
