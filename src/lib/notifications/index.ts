import { sendTelegramNotification } from "@/lib/telegram/telegram";

export type NotificationChannel = "telegram" | "email" | "whatsapp" | "sms";

export type NotificationPayload = {
  channel?: NotificationChannel;
  topic: "order" | "order-status" | "contact" | "quote";
  data: Record<string, unknown>;
};

const CHANNEL_PRIORITY: NotificationChannel[] = ["telegram"];

/**
 * Channel-agnostic entry point for all outbound staff notifications.
 *
 * Business code only ever talks to this dispatcher. A channel can be added
 * (email, whatsapp, sms, ...) without touching call sites — implement the
 * channel behind `sendNotification` and register it in the resolver below.
 *
 * All channels are best-effort: failures are logged and swallowed so the
 * customer-facing flow (checkout, form submission) is never interrupted.
 */
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  const channels: NotificationChannel[] = payload.channel
    ? [payload.channel]
    : CHANNEL_PRIORITY;

  for (const channel of channels) {
    try {
      switch (channel) {
        case "telegram":
          await sendTelegramNotification(payload.topic, payload.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`[notifications] ${channel} dispatch failed for "${payload.topic}":`, error);
    }
  }
}
