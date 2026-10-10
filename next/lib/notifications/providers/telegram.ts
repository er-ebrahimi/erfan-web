import type {
  NotificationPayload,
  NotificationProvider,
  NotificationResult,
} from '../types';

const API_BASE = 'https://api.telegram.org';

export class TelegramProvider implements NotificationProvider {
  readonly name = 'telegram';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!token || !chatId) {
      console.error(
        'Telegram: missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID'
      );
      return { success: false };
    }

    const text = [
      `\uD83D\uDCE9 New message from contact form`,
      ``,
      `From: ${payload.contact}`,
      `Message: ${payload.message}`,
    ].join('\n');

    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`Telegram: API returned ${res.status}`, body);
      return { success: false };
    }

    return { success: true };
  }
}
