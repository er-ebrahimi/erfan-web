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

async function fetchWithRetry(
  url: string,
  params: Record<string, unknown>,
  retries = 3,
  timeout = 10000
): Promise<StrapiResponse> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const start = Date.now();
    try {
      const response = await axios.get<StrapiResponse>(url, {
        params,
        paramsSerializer: (params) => qs.stringify(params as any),
        timeout,
      });
      return response.data;
    } catch (error) {
      const elapsed = Date.now() - start;

      if (attempt === retries) {
        console.error(
          `[FETCH_STRAPI] All ${retries} attempts exhausted [${url}] after ${elapsed}ms`
        );
        throw error;
      }

      const isTimeout =
        axios.isAxiosError(error) &&
        (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT');

      if (!isTimeout) {
        const isRefused = axios.isAxiosError(error) && error.code === 'ECONNREFUSED';
        if (!isRefused) {
          console.error(
            `[FETCH_STRAPI] Non-timeout error on attempt ${attempt}/${retries} [${url}] after ${elapsed}ms — not retrying`
          );
        }
        throw error;
      }

      console.warn(
        `[FETCH_STRAPI] Timeout on attempt ${attempt}/${retries} [${url}] after ${elapsed}ms — retrying...`
      );
    }
  }
  throw new Error('unreachable');
}

export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean
): Promise<any> {
  const { isEnabled } = await draftMode();

  const queryParams: Record<string, unknown> = { ...params };

  if (isEnabled) {
    queryParams.status = 'draft';
  }

  const apiUrl =
    process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
  const start = Date.now();

  try {
    const url = new URL(`api/${contentType}`, apiUrl);
    const jsonData = await fetchWithRetry(url.href, queryParams);
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    const elapsed = Date.now() - start;
    const baseUrl = apiUrl;
    const fullUrl = `${baseUrl}/api/${contentType}`;

    const logData: Record<string, unknown> = {
      contentType,
      url: fullUrl,
      method: 'GET',
      params: queryParams,
      draftMode: isEnabled,
      elapsedMs: elapsed,
    };

    if (axios.isAxiosError(error)) {
      logData.errorCode = error.code;
      logData.errorMessage = error.message;
      logData.status = error.response?.status;
      logData.statusText = error.response?.statusText;
      logData.responseBody = error.response?.data;
      logData.responseHeaders = error.response?.headers;
      logData.requestUrl = error.config?.url;
    } else if (error instanceof Error) {
      logData.errorMessage = error.message;
      logData.stack = error.stack;
    }

    const isRefused = axios.isAxiosError(error) && error.code === 'ECONNREFUSED';
    (isRefused ? console.warn : console.error)(
      `[FETCH_STRAPI] Failed to fetch [${contentType}] after ${elapsed}ms`,
      JSON.stringify(logData, null, 2)
    );

    const wrapped = new Error(
      `fetchContentType failed for "${contentType}": ${error instanceof Error ? error.message : String(error)}`
    );
    (wrapped as any).cause = error;
    throw wrapped;
  }
}
