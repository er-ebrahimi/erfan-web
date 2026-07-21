import { draftMode } from 'next/headers';
import qs from 'qs';

import { REVALIDATE_SECONDS } from '@/lib/revalidate';

interface StrapiData {
  id: number;
  [key: string]: any;
}

interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
  if (Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }
  if (!Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}

export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean,
  options?: { preview?: boolean; revalidate?: number }
): Promise<any> {
  const { preview = false, revalidate = REVALIDATE_SECONDS } = options || {};

  const queryParams: Record<string, unknown> = { ...params };

  if (preview) {
    const { isEnabled } = await draftMode();
    if (isEnabled) {
      queryParams.status = 'draft';
    }
  }

  const apiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(`api/${contentType}`, apiUrl);
  url.search = qs.stringify(queryParams as any);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      next: { revalidate },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    console.warn(`fetchContentType: "${contentType}" unreachable, returning null`);
    return null;
  }

  if (!res.ok) {
    if (res.status === 404 || res.status === 403) {
      console.warn(`fetchContentType: "${contentType}" not found (${res.status})`);
      return null;
    }
    throw new Error(
      `fetchContentType failed for "${contentType}": ${res.status} ${res.statusText}`
    );
  }

  const jsonData: StrapiResponse = await res.json();
  return spreadData ? spreadStrapiData(jsonData) : jsonData;
}
