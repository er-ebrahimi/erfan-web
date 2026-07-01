import type {
  NotificationPayload,
  NotificationProvider,
  NotificationResult,
} from '../types';

const API_URL = 'https://api.web3forms.com/submit';

export class Web3FormsProvider implements NotificationProvider {
  readonly name = 'web3forms';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const accessKey = process.env.CONTACT_EMAIL_ACCESS_KEY;

    if (!accessKey) {
      console.error('Web3Forms: missing CONTACT_EMAIL_ACCESS_KEY');
      return { success: false };
    }

    const body = {
      access_key: accessKey,
      subject: `\uD83D\uDCE7 New Message from Contact Form - ${payload.contact}`,
      message: [
        'New message from the contact form:',
        '',
        `Contact Info: ${payload.contact}`,
        `Message: ${payload.message}`,
        '',
        `Sent at: ${new Date().toLocaleString('en-US')}`,
      ].join('\n'),
      from_name: 'Website Contact Form',
      to: process.env.CONTACT_EMAIL || 'your-email@example.com',
      reply_to: payload.contact,
    };

    let res: Response;
    try {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error('Web3Forms: network error', err);
      return { success: false };
    }

    let result: Record<string, unknown>;
    try {
      result = await res.json();
    } catch {
      const text = await res.text().catch(() => '');
      console.error(
        `Web3Forms: non-JSON response (${res.status})`,
        text.slice(0, 300)
      );
      return { success: false };
    }

    if (res.ok && result?.success) {
      return { success: true };
    }

    console.error('Web3Forms: API error', result);
    return { success: false };
  }
}
