/* ─── Trade-In domain constants ─────────────────────────────────────────────
   Single source of truth for the trade-in workflow: allowed statuses,
   selectable condition options and display labels. Used by the public form,
   the server actions (validation) and the admin panel.
   ──────────────────────────────────────────────────────────────────────── */

export const TRADE_IN_STATUSES = [
  "pending",
  "under_review",
  "offer_sent",
  "accepted",
  "rejected",
  "completed",
  "cancelled",
] as const;

export type TradeInStatus = (typeof TRADE_IN_STATUSES)[number];

export const DEVICE_CONDITIONS = [
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "damaged", label: "Damaged" },
] as const;

export const SCREEN_CONDITIONS = [
  { value: "perfect", label: "Perfect" },
  { value: "minor_scratches", label: "Minor scratches" },
  { value: "visible_scratches", label: "Visible scratches" },
  { value: "cracked", label: "Cracked" },
] as const;

export const BATTERY_CONDITIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "unknown", label: "Unknown" },
] as const;

export const FUNCTIONAL_STATUSES = [
  { value: "fully_working", label: "Fully working" },
  { value: "minor_issues", label: "Minor issues" },
  { value: "major_issues", label: "Major issues" },
  { value: "not_working", label: "Not working" },
] as const;

export const ACCESSORY_OPTIONS = [
  "Original box",
  "Charger",
  "Cable",
  "Earphones",
  "Other",
] as const;

export const STORAGE_OPTIONS = [
  "16GB",
  "32GB",
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
  "Not sure",
] as const;

export const MAX_TRADE_IN_PHOTOS = 4;

export const TRADE_IN_OFFER_STATUSES = [
  "ready",
  "sent",
  "accepted",
  "rejected",
] as const;

export type TradeInOfferStatus = (typeof TRADE_IN_OFFER_STATUSES)[number];

/** Activity events that can be recorded on a trade-in record. */
export const TRADE_IN_ACTIVITY_TYPES = [
  "trade_in_submitted",
  "review_started",
  "inspection_completed",
  "estimate_added",
  "final_value_added",
  "offer_sent",
  "offer_accepted",
  "offer_rejected",
  "status_changed",
  "telegram_sent",
  "telegram_failed",
  "note_added",
  "order_linked",
  "completed",
  "cancelled",
] as const;

export type TradeInActivityType = (typeof TRADE_IN_ACTIVITY_TYPES)[number];

const VALUE_TO_LABEL: Record<string, string> = {};
for (const list of [DEVICE_CONDITIONS, SCREEN_CONDITIONS, BATTERY_CONDITIONS, FUNCTIONAL_STATUSES]) {
  for (const option of list) {
    VALUE_TO_LABEL[option.value] = option.label;
  }
}

export function conditionLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return VALUE_TO_LABEL[value] ?? value.replace(/_/g, " ");
}

export function tradeInStatusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
}

export function formatTradeInValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `RWF ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}