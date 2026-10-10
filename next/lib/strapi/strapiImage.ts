import { clientEnv } from '@/env/client';

export function strapiImage(url: string): string {
  if (url.startsWith('/')) {
    const base = clientEnv.NEXT_PUBLIC_STRAPI_URL;

    if (
      !base &&
      typeof document !== 'undefined' &&
      document?.location.host.endsWith('.strapidemo.com')
    ) {
      return `https://${document.location.host.replace('client-', 'api-')}${url}`;
    }

    return (base || '').replace(/\/$/, '') + url;
  }
  return url;
}
