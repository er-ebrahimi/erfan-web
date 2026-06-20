// Client-side web3forms submission.
//
// web3forms' free plan only accepts submissions that originate from the
// browser — server-side calls (e.g. from a Next.js route handler) are rejected
// with a 403 "Use our API in client side ... Pro plan is required". So the
// contact and lead forms POST here directly from the client instead of going
// through /api/*.
//
// The access key is public by design (it ships in the client bundle). Restrict
// it to your domain in the web3forms dashboard to prevent abuse. Submissions
// are delivered to the inbox registered with the key.

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export async function submitToWeb3Forms(
  fields: Record<string, string>
): Promise<{ success: boolean; message?: string }> {
  const access_key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!access_key) {
    // Misconfiguration — surface it in the console for the developer.
    console.error('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — forms cannot send.');
    return { success: false, message: 'missing access key' };
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key, ...fields }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: Boolean(res.ok && data?.success), message: data?.message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'network error',
    };
  }
}
