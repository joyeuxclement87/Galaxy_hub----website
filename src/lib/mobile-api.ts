import "server-only";
import { z } from "zod";

/**
 * Server-only client for MobileAPI.dev (https://mobileapi.dev/docs/).
 *
 * SECURITY:
 * - This module must never be imported from a "use client" file or from any
 *   public-facing route/component. It is only ever called from admin server
 *   actions (see src/actions/phone-specs.ts).
 * - MOBILE_API_KEY is read from process.env only, on the server. It must
 *   never be exposed via NEXT_PUBLIC_* or returned to the browser.
 */

const BASE_URL = process.env.MOBILE_API_BASE_URL || "https://api.mobileapi.dev";
const REQUEST_TIMEOUT_MS = 8000;

export type MobileApiErrorCode =
  | "missing_api_key"
  | "unauthorized"
  | "rate_limited"
  | "timeout"
  | "not_found"
  | "invalid_response"
  | "unavailable";

/** Human-readable messages safe to show a non-technical admin. */
export const MOBILE_API_ERROR_MESSAGES: Record<MobileApiErrorCode, string> = {
  missing_api_key:
    "Phone specification service is not configured yet. You can enter specifications manually.",
  unauthorized:
    "Phone specification service rejected the request. Please check the API key configuration.",
  rate_limited:
    "Phone specification service usage limit reached for now. Try again later or enter specifications manually.",
  timeout:
    "Phone specification service took too long to respond. Please try again.",
  not_found:
    "Couldn't find that phone. Try searching using the brand and model, e.g. \"Samsung Galaxy S25 Ultra\".",
  invalid_response:
    "Phone specification service returned unexpected data. Please try again or enter specifications manually.",
  unavailable:
    "Phone specification service is temporarily unavailable. You can enter the specifications manually.",
};

export class MobileApiError extends Error {
  code: MobileApiErrorCode;
  constructor(code: MobileApiErrorCode, message: string) {
    super(message);
    this.name = "MobileApiError";
    this.code = code;
  }
}

const flexibleText = z.preprocess(
  (val) => (val === null || val === undefined ? null : String(val)),
  z.string().nullable().optional()
);

const groupSchema = z
  .object({
    type: flexibleText,
    size: flexibleText,
    resolution: flexibleText,
    protection: flexibleText,
    other: flexibleText,
    os: flexibleText,
    chipset: flexibleText,
    cpu: flexibleText,
    gpu: flexibleText,
    card_slot: flexibleText,
    internal: flexibleText,
    modules: flexibleText,
    features: flexibleText,
    video: flexibleText,
    charging: flexibleText,
    wlan: flexibleText,
    bluetooth: flexibleText,
    positioning: flexibleText,
    nfc: flexibleText,
    radio: flexibleText,
    usb: flexibleText,
    technology: flexibleText,
    bands_2g: flexibleText,
    bands_3g: flexibleText,
    bands_4g: flexibleText,
    bands_5g: flexibleText,
    speed: flexibleText,
    loudspeaker: flexibleText,
    audio_jack: flexibleText,
    dimensions: flexibleText,
    weight: flexibleText,
    build: flexibleText,
    sim: flexibleText,
    sensors: flexibleText,
    model_numbers: flexibleText,
  })
  .partial()
  .nullable()
  .optional();

const deviceSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  manufacturer_name: flexibleText,
  device_type: flexibleText,
  image_url: flexibleText,
  screen_resolution: flexibleText,
  camera: flexibleText,
  battery_capacity: flexibleText,
  hardware: flexibleText,
  storage: flexibleText,
  release_date: flexibleText,
});

const deviceDetailSchema = deviceSummarySchema.extend({
  colors: flexibleText,
  weight: flexibleText,
  thickness: flexibleText,
  description: flexibleText,
  network: groupSchema,
  body: groupSchema,
  display: groupSchema,
  platform: groupSchema,
  memory: groupSchema,
  main_camera: groupSchema,
  selfie_camera: groupSchema,
  sound: groupSchema,
  comms: groupSchema,
  features: groupSchema,
  battery: groupSchema,
  misc: groupSchema,
});

export type MobileApiDeviceSummary = z.infer<typeof deviceSummarySchema>;
export type MobileApiDeviceDetail = z.infer<typeof deviceDetailSchema>;

async function mobileApiFetch(path: string): Promise<unknown> {
  const apiKey = process.env.MOBILE_API_KEY;
  if (!apiKey) {
    throw new MobileApiError("missing_api_key", "MOBILE_API_KEY environment variable is not set.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new MobileApiError("timeout", "The phone specification service took too long to respond.");
    }
    throw new MobileApiError("unavailable", "Could not reach the phone specification service.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401 || response.status === 403) {
    throw new MobileApiError("unauthorized", "The phone specification service rejected the API key.");
  }
  if (response.status === 429) {
    throw new MobileApiError("rate_limited", "The phone specification service rate limit was exceeded.");
  }
  if (response.status === 404) {
    throw new MobileApiError("not_found", "No matching phone was found.");
  }
  if (!response.ok) {
    throw new MobileApiError(
      "unavailable",
      `The phone specification service returned an unexpected error (${response.status}).`
    );
  }

  try {
    return await response.json();
  } catch {
    throw new MobileApiError("invalid_response", "The phone specification service returned an invalid response.");
  }
}

/** Extracts an array of raw device-like records from a search response, tolerating a few reasonable shapes. */
function extractSearchArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.devices)) return obj.devices;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.data)) return obj.data;
    // Some search queries can resolve to a single device object.
    if (typeof obj.id === "number" && typeof obj.name === "string") return [obj];
  }
  return [];
}

/**
 * Search for phones by name (partial names, "Brand + Model", etc. all work
 * since MobileAPI does fuzzy matching). Only device_type "phone" results are
 * returned. Returns an empty list when nothing matches — that is treated as
 * a normal "no results" outcome, not an error.
 */
async function executePhoneSearch(queryText: string, limit: number): Promise<MobileApiDeviceSummary[]> {
  const params = new URLSearchParams({ name: queryText, limit: String(limit) });

  let raw: unknown;
  try {
    raw = await mobileApiFetch(`/devices/search/?${params.toString()}`);
  } catch (err) {
    if (err instanceof MobileApiError && err.code === "not_found") {
      return [];
    }
    throw err;
  }

  const candidates = extractSearchArray(raw);
  const results: MobileApiDeviceSummary[] = [];

  for (const candidate of candidates) {
    const parsed = deviceSummarySchema.safeParse(candidate);
    if (!parsed.success) continue;
    const deviceType = parsed.data.device_type?.toLowerCase();
    if (deviceType && deviceType !== "phone" && deviceType !== "smartphone" && deviceType !== "mobile") continue;
    results.push(parsed.data);
  }

  return results;
}

export async function searchPhones(
  query: string,
  options: { limit?: number } = {}
): Promise<MobileApiDeviceSummary[]> {
  const limit = Math.min(Math.max(options.limit ?? 8, 1), 30);
  let results = await executePhoneSearch(query, limit);

  // Fallback: If no results, try stripping leading brand names (e.g., "Samsung Galaxy S24" -> "Galaxy S24")
  if (results.length === 0) {
    const cleaned = query.replace(/^(samsung|apple|google|xiaomi|oneplus|tecno|infinix|sony)\s+/i, "").trim();
    if (cleaned && cleaned !== query.trim()) {
      results = await executePhoneSearch(cleaned, limit);
    }
  }

  return results;
}

/** Fetch full specifications for a single device by its MobileAPI.dev ID. */
export async function getPhoneById(deviceId: number): Promise<MobileApiDeviceDetail> {
  const raw = await mobileApiFetch(`/devices/${deviceId}/`);
  const parsed = deviceDetailSchema.safeParse(raw);
  if (!parsed.success) {
    throw new MobileApiError("invalid_response", "The phone specification service returned an invalid device record.");
  }
  return parsed.data;
}
