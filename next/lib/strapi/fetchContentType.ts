import { draftMode } from 'next/headers';
import qs from 'qs';

/**
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @return {Promise<object>} The fetched data.
 */

interface StrapiData {
  id: number;
  [key: string]: any; // Allow for any additional fields
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
  spreadData?: boolean
): Promise<any> {
  const { isEnabled } = await draftMode();

  try {
    const queryParams = { ...params };

    if (isEnabled) {
      queryParams.status = 'draft';
    }
    const url = new URL(`api/${contentType}`, process.env.NEXT_PUBLIC_API_URL);

    // Perform the fetch request with the provided query parameters
    const response = await fetch(`${url.href}?${qs.stringify(queryParams)}`, {
      method: 'GET',
      next: {
        revalidate: isEnabled ? 0 : 60 * 60 * 15, // No cache in draft mode, 15 minutes cache in production
        tags: [contentType, `locale-${params.locale || 'default'}`], // Enable tag-based revalidation
      },
    });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody;
      } catch (e) {
        errorDetails = 'Unable to read error response';
      }

      console.error(
        `Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`
      );
      console.error('Error details:', errorDetails);

      // Return appropriate fallback based on expected data structure
      return spreadData ? null : { data: [] };
    }
    const jsonData: StrapiResponse = await response.json();
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error('FetchContentTypeError', error);
    // Return appropriate fallback based on expected data structure
    return spreadData ? null : { data: [] };
  }
}
