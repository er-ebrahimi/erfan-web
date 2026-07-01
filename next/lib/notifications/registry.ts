import type { NotificationProvider } from './types';
import { BaleProvider } from './providers/bale';
import { TelegramProvider } from './providers/telegram';
import { Web3FormsProvider } from './providers/web3forms';

const providers: Record<string, () => NotificationProvider> = {
  bale: () => new BaleProvider(),
  telegram: () => new TelegramProvider(),
  web3forms: () => new Web3FormsProvider(),
};

const DEFAULT_PROVIDER = 'web3forms';

export function getProvider(name?: string): NotificationProvider {
  const key = name || process.env.NOTIFICATION_PROVIDER || DEFAULT_PROVIDER;
  const factory = providers[key];

  if (!factory) {
    console.warn(
      `Unknown notification provider "${key}", falling back to "${DEFAULT_PROVIDER}"`
    );
    return providers[DEFAULT_PROVIDER]();
  }

  return factory();
}
