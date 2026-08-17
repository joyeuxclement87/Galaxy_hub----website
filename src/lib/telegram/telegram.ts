const TELEGRAM_API = "https://api.telegram.org";

type TelegramNotificationData = {
  order?: {
    id: string;
    order_number: string;
    total_amount: number;
    currency?: string;
  };
  customer?: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  };
  items?: Array<{
    product_name: string;
    quantity: number;
    price: number;
    variant?: string | null;
  }>;
  status?: {
    previous?: string;
    next: string;
    updated_at?: string;
  };
  contact?: {
    name: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
  };
  quote?: {
    product_name: string;
    product_slug?: string;
    variant?: string | null;
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  tradeIn?: {
    trade_in_id: string;
    id?: string;
    customer_name: string;
    phone: string;
    email?: string;
    wanted_product_name: string;
    wanted_product_storage?: string;
    trade_device_brand: string;
    trade_device_model: string;
    trade_device_storage?: string;
    device_condition: string;
    screen_condition: string;
    battery_condition: string;
    functional_status: string;
    accessories: string[];
    faults?: string;
    notes?: string;
    status: string;
    photos_count: number;
  };
};

/**
 * Escapes a string for Telegram MarkdownV2. Every dynamic value interpolated
 * into a notification must go through this, otherwise user-supplied input
 * (names, phone numbers, messages...) can break or inject formatting.
 */
function escapeMarkdownV2(text: string | number | null | undefined): string {
  return String(text ?? "—").replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

/**
 * Escapes a URL for use inside a MarkdownV2 link. Telegram parses link URLs
 * with the same special-char rules as the body, so '-', '.', '_' etc. must be
 * escaped too (slash and colon are safe).
 */
function escapeMarkdownV2Url(url: string): string {
  return url.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

/**
 * Raw Bot API sender. Server-only module: the token must never leave the
 * server (it is read from process.env, never rendered or passed to client
 * components). Validation + non-blocking failure handling live here.
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — notification skipped");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[telegram] sendMessage failed (${res.status}):`, body);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[telegram] sendMessage threw:", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function buildOrderMessage(data: TelegramNotificationData): string {
  const order: Partial<NonNullable<TelegramNotificationData["order"]>> = data.order ?? {};
  const customer: Partial<NonNullable<TelegramNotificationData["customer"]>> = data.customer ?? {};
  const items = data.items ?? [];

  const lines: string[] = ["🛒 *New Order Received*", ""];
  lines.push(`*Order:* \\#${escapeMarkdownV2(order.order_number)}`);
  lines.push(`*Customer:* ${escapeMarkdownV2(customer.name)}`);
  lines.push(`*Phone:* ${escapeMarkdownV2(customer.phone)}`);
  if (customer.email) lines.push(`*Email:* ${escapeMarkdownV2(customer.email)}`);
  if (customer.address) lines.push(`*Address:* ${escapeMarkdownV2(customer.address)}`);

  lines.push("", "*Items:*");
  for (const item of items) {
    const variant = item.variant ? ` \\(${escapeMarkdownV2(item.variant)}\\)` : "";
    lines.push(
      `• ${escapeMarkdownV2(item.product_name)} — ${item.quantity} × RWF ${escapeMarkdownV2(
        item.price.toLocaleString("en-US"),
      )}${variant}`,
    );
  }

  lines.push(
    "",
    `*Total:* RWF ${escapeMarkdownV2(
      Number(order.total_amount ?? 0).toLocaleString("en-US"),
    )}`,
  );
  if (customer.notes) lines.push("", `*Notes:* ${escapeMarkdownV2(customer.notes)}`);

  if (order.id && process.env.NEXT_PUBLIC_SITE_URL) {
    lines.push("", `🔗 [View in admin](${escapeMarkdownV2Url(process.env.NEXT_PUBLIC_SITE_URL)}/admin/orders/${order.id})`);
  }

  return lines.join("\n");
}

function buildStatusMessage(data: TelegramNotificationData): string {
  const order: Partial<NonNullable<TelegramNotificationData["order"]>> = data.order ?? {};
  const status: Partial<NonNullable<TelegramNotificationData["status"]>> = data.status ?? { next: "" };

  const lines: string[] = ["📦 *Order Status Updated*", ""];
  lines.push(`*Order:* \\#${escapeMarkdownV2(order.order_number)}`);
  if (status.previous) {
    lines.push(`*Previous:* ${escapeMarkdownV2(status.previous)}`);
  }
  lines.push(`*New status:* ${escapeMarkdownV2(status.next)}`);
  lines.push(`*Updated:* ${escapeMarkdownV2(status.updated_at ?? new Date().toISOString())}`);

  if (order.id && process.env.NEXT_PUBLIC_SITE_URL) {
    lines.push("", `🔗 [View in admin](${escapeMarkdownV2Url(process.env.NEXT_PUBLIC_SITE_URL)}/admin/orders/${order.id})`);
  }

  return lines.join("\n");
}

function buildContactMessage(data: TelegramNotificationData): string {
  const contact: Partial<NonNullable<TelegramNotificationData["contact"]>> = data.contact ?? { name: "", message: "" };

  const lines: string[] = ["📩 *New Contact Message*", ""];
  lines.push(`*Name:* ${escapeMarkdownV2(contact.name)}`);
  if (contact.email) lines.push(`*Email:* ${escapeMarkdownV2(contact.email)}`);
  if (contact.phone) lines.push(`*Phone:* ${escapeMarkdownV2(contact.phone)}`);
  if (contact.subject) lines.push(`*Subject:* ${escapeMarkdownV2(contact.subject)}`);
  lines.push("", escapeMarkdownV2(contact.message));

  return lines.join("\n");
}

function buildQuoteMessage(data: TelegramNotificationData): string {
  const quote: Partial<NonNullable<TelegramNotificationData["quote"]>> = data.quote ?? { product_name: "", name: "", phone: "" };

  const lines: string[] = ["📝 *Quote Request*", ""];
  lines.push(`*Product:* ${escapeMarkdownV2(quote.product_name)}`);
  if (quote.variant) lines.push(`*Variant:* ${escapeMarkdownV2(quote.variant)}`);
  lines.push(`*Name:* ${escapeMarkdownV2(quote.name)}`);
  lines.push(`*Phone:* ${escapeMarkdownV2(quote.phone)}`);
  if (quote.email) lines.push(`*Email:* ${escapeMarkdownV2(quote.email)}`);
  if (quote.notes) lines.push("", `*Notes:* ${escapeMarkdownV2(quote.notes)}`);

  if (quote.product_slug && process.env.NEXT_PUBLIC_SITE_URL) {
    lines.push(
      "",
      `🔗 [View product](${escapeMarkdownV2Url(process.env.NEXT_PUBLIC_SITE_URL)}/product/${quote.product_slug})`,
    );
  }

  return lines.join("\n");
}

function buildTradeInMessage(data: TelegramNotificationData): string {
  const t: Partial<NonNullable<TelegramNotificationData["tradeIn"]>> = data.tradeIn ?? {
    trade_in_id: "", customer_name: "", phone: "", wanted_product_name: "",
    trade_device_brand: "", trade_device_model: "", device_condition: "",
    screen_condition: "", battery_condition: "", functional_status: "",
    accessories: [], status: "", photos_count: 0,
  };

  const bar = "━━━━━━━━━━━━━━━━━━";
  const wanted = [t.wanted_product_name, t.wanted_product_storage].filter(Boolean).join(" · ");
  const trading = [t.trade_device_brand, t.trade_device_model, t.trade_device_storage]
    .filter(Boolean)
    .join(" · ");

  const lines: string[] = [];
  lines.push(bar);
  lines.push("📱 *NEW TRADE\\-IN REQUEST*");
  lines.push(bar);
  lines.push("");
  lines.push(`*ID:* ${escapeMarkdownV2(t.trade_in_id)}`);
  lines.push("");
  lines.push("*CUSTOMER*");
  lines.push(`${escapeMarkdownV2(t.customer_name)}`);
  lines.push(`${escapeMarkdownV2(t.phone)}`);
  if (t.email) lines.push(`${escapeMarkdownV2(t.email)}`);
  lines.push("");
  lines.push("*WANTS*");
  lines.push(`➡️ ${escapeMarkdownV2(wanted || "—")}`);
  lines.push("");
  lines.push("*TRADING IN*");
  lines.push(`⬅️ ${escapeMarkdownV2(trading || "—")}`);
  lines.push("");
  lines.push("*CONDITION*");
  lines.push(`${escapeMarkdownV2(t.device_condition)}`);
  lines.push("");
  lines.push("*SCREEN*");
  lines.push(`${escapeMarkdownV2(t.screen_condition)}`);
  lines.push("");
  lines.push("*BATTERY*");
  lines.push(`${escapeMarkdownV2(t.battery_condition)}`);
  lines.push("");
  lines.push("*FUNCTION*");
  lines.push(`${escapeMarkdownV2(t.functional_status)}`);
  lines.push("");
  lines.push(`*ACCESSORIES:* ${escapeMarkdownV2((t.accessories ?? []).length > 0 ? (t.accessories ?? []).join(", ") : "None")}`);
  lines.push(`*FAULTS:* ${escapeMarkdownV2(t.faults || "None")}`);
  if (t.notes) lines.push("", `*NOTES:* ${escapeMarkdownV2(t.notes)}`);
  lines.push("", `*STATUS:* ${escapeMarkdownV2(t.status)}`);
  lines.push(
    `*PHOTOS:* ${(t.photos_count ?? 0) > 0 ? `${t.photos_count ?? 0} uploaded` : "Not provided"}`,
  );

  if (t.id && process.env.NEXT_PUBLIC_SITE_URL) {
    lines.push("", `🔗 [Review in admin](${escapeMarkdownV2Url(process.env.NEXT_PUBLIC_SITE_URL)}/admin/trade-ins/${t.id})`);
  }

  return lines.join("\n");
}

/**
 * Topic-aware dispatcher used by the notification service. Never throws:
 * callers always get a boolean so checkout / form flows can continue.
 */
export async function sendTelegramNotification(
  topic: "order" | "order-status" | "contact" | "quote" | "trade-in",
  data: TelegramNotificationData,
): Promise<boolean> {
  let text: string;

  switch (topic) {
    case "order":
      text = buildOrderMessage(data);
      break;
    case "order-status":
      text = buildStatusMessage(data);
      break;
    case "contact":
      text = buildContactMessage(data);
      break;
    case "quote":
      text = buildQuoteMessage(data);
      break;
    case "trade-in":
      text = buildTradeInMessage(data);
      break;
    default:
      console.error(`[telegram] Unknown notification topic: ${topic}`);
      return false;
  }

  return sendTelegramMessage(text);
}
