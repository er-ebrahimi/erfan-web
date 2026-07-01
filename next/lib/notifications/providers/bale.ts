import type {
  NotificationPayload,
  NotificationProvider,
  NotificationResult,
} from '../types';

const API_BASE = 'https://tapi.bale.ai';

export class BaleProvider implements NotificationProvider {
  readonly name = 'bale';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const token = process.env.BALE_BOT_TOKEN;
    const chatId = process.env.BALE_ADMIN_CHAT_ID;

    if (!token || !chatId) {
      console.error('Bale: missing BALE_BOT_TOKEN or BALE_ADMIN_CHAT_ID');
      return { success: false };
    }

    const text = `
📩 \u067E\u06CC\u0627\u0645 \u062C\u062F\u06CC\u062F \u0627\u0632 \u0641\u0631\u0645 \u062A\u0645\u0627\u0633

\u0641\u0631\u0633\u062A\u0646\u062F\u0647: ${payload.contact}
\u067E\u06CC\u0627\u0645: ${payload.message}
    `.trim();

    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`Bale: API returned ${res.status}`, body);
      return { success: false };
    }

    return { success: true };
  }
}
