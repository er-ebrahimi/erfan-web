export interface NotificationPayload {
  contact: string;
  message: string;
}

export interface NotificationResult {
  success: boolean;
}

export interface NotificationProvider {
  readonly name: string;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}
