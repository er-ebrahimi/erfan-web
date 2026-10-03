import { unstable_noStore as noStore } from 'next/cache';

import { clientEnv } from '@/env/client';

export function strapiImage(url: string): string {
  noStore();
  if (url.startsWith('/')) {
    if (
      !clientEnv.NEXT_PUBLIC_API_URL &&
      document?.location.host.endsWith('.strapidemo.com')
    ) {
      return `https://${document.location.host.replace('client-', 'api-')}${url}`;
    }

    return clientEnv.NEXT_PUBLIC_API_URL + url;
  }
  return url;
}
