import { draftMode } from 'next/headers';
import qs from 'qs';
import axios from 'axios';

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

    const response = await axios.get<StrapiResponse>(url.href, {
      params: queryParams,
      paramsSerializer: (params) => qs.stringify(params as any),
    });
    const jsonData: StrapiResponse = response.data;
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    // Log any errors that occur during the fetch process
    // Return appropriate fallback based on expected data structure
    return spreadData ? null : { data: [] };
  }
}
