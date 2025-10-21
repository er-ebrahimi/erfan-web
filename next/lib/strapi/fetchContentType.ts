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

      // Enhanced error logging with detailed information
      const fullUrl = `${url.href}?${qs.stringify(queryParams)}`;
      console.error('='.repeat(80));
      console.error('❌ STRAPI API REQUEST FAILED');
      console.error('='.repeat(80));
      console.error(`📡 Content Type: ${contentType}`);
      console.error(`🌐 API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
      console.error(`🔗 Full URL: ${fullUrl}`);
      console.error(`📊 Status Code: ${response.status}`);
      console.error(`📝 Status Text: ${response.statusText}`);
      console.error(`⏰ Timestamp: ${new Date().toISOString()}`);
      console.error(`📋 Query Params:`, JSON.stringify(queryParams, null, 2));
      console.error(
        `📥 Response Headers:`,
        JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)
      );
      console.error(`📄 Error Details:`, errorDetails);

      // Generate and log curl command for debugging
      const curlCommand = `curl -X GET "${fullUrl}" -H "Content-Type: application/json" -v`;
      console.error('🔧 CURL COMMAND FOR DEBUGGING:');
      console.error(curlCommand);
      console.error('='.repeat(80));

      // Return appropriate fallback based on expected data structure
      return spreadData ? null : { data: [] };
    }
    const jsonData: StrapiResponse = await response.json();
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    // Enhanced error logging for network/fetch errors
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${contentType}?${qs.stringify(params)}`;
    console.error('='.repeat(80));
    console.error('❌ STRAPI API NETWORK ERROR');
    console.error('='.repeat(80));
    console.error(`📡 Content Type: ${contentType}`);
    console.error(`🌐 API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
    console.error(`🔗 Full URL: ${fullUrl}`);
    console.error(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.error(`📋 Query Params:`, JSON.stringify(params, null, 2));
    console.error(
      `❌ Error Name: ${error instanceof Error ? error.name : 'Unknown'}`
    );
    console.error(
      `❌ Error Message: ${error instanceof Error ? error.message : String(error)}`
    );
    console.error(
      `❌ Error Stack:`,
      error instanceof Error ? error.stack : 'No stack trace'
    );

    // Generate and log curl command for debugging
    const curlCommand = `curl -X GET "${fullUrl}" -H "Content-Type: application/json" -v`;
    console.error('🔧 CURL COMMAND FOR DEBUGGING:');
    console.error(curlCommand);
    console.error('='.repeat(80));

    // Return appropriate fallback based on expected data structure
    return spreadData ? null : { data: [] };
  }
}
