"use server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { revalidatePath } from "next/cache";
import { sendTelegramNotification } from "@/lib/telegram/telegram";
import { getTradeInWantedProduct } from "@/data/public-products";
import {
  TRADE_IN_STATUSES,
  TRADE_IN_ACTIVITY_TYPES,
  DEVICE_CONDITIONS,
  SCREEN_CONDITIONS,
  BATTERY_CONDITIONS,
  FUNCTIONAL_STATUSES,
  ACCESSORY_OPTIONS,
  MAX_TRADE_IN_PHOTOS,
  conditionLabel,
  tradeInStatusLabel,
} from "@/lib/trade-in";
import type { Database } from "@/types/database";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function cleanInput(value: FormDataEntryValue | null, maxLength: number): string {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function isAllowedValue(value: string, options: readonly { value: string }[]): boolean {
  return options.some((o) => o.value === value);
}

const TRADE_IN_RATE_LIMIT_MS = 120_000;

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PHOTO_EXTS = ["jpg", "jpeg", "png", "webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

async function getBucket(supabase: ReturnType<typeof createAdminClient>) {
  const { data: bucket } = await supabase.storage.getBucket("trade-in-photos");
  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket("trade-in-photos", {
      public: true,
    });
    if (createError) {
      console.error("[trade-ins] Failed to create storage bucket:", createError);
      return false;
    }
  }
  return true;
}

function buildTradeInTelegramData(record: {
  id: string;
  trade_in_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  wanted_product_name: string;
  wanted_product_storage: string | null;
  trade_device_brand: string;
  trade_device_model: string;
  trade_device_storage: string | null;
  device_condition: string;
  screen_condition: string;
  battery_condition: string;
  functional_status: string;
  accessories: string[];
  faults: string | null;
  customer_notes: string | null;
  status: string;
  photos: string[];
}) {
  return {
    tradeIn: {
      id: record.id,
      trade_in_id: record.trade_in_id,
      customer_name: record.customer_name,
      phone: record.phone,
      email: record.email ?? undefined,
      wanted_product_name: record.wanted_product_name,
      wanted_product_storage: record.wanted_product_storage ?? undefined,
      trade_device_brand: record.trade_device_brand,
      trade_device_model: record.trade_device_model,
      trade_device_storage: record.trade_device_storage ?? undefined,
      device_condition: conditionLabel(record.device_condition),
      screen_condition: conditionLabel(record.screen_condition),
      battery_condition: conditionLabel(record.battery_condition),
      functional_status: conditionLabel(record.functional_status),
      accessories: record.accessories,
      faults: record.faults ?? undefined,
      notes: record.customer_notes ?? undefined,
      status: record.status.charAt(0).toUpperCase() + record.status.slice(1).replace(/_/g, " "),
      photos_count: record.photos.length,
    },
  };
}

/* ─── Admin helpers ───────────────────────────────────────────────────────── */

type AdminSupabase = ReturnType<typeof createAdminClient>;

/** Every admin mutation on trade-ins must come from a signed-in admin. */
async function requireAdmin(): Promise<{ admin?: string; error?: string }> {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return { admin: user.email ?? "admin" };
}

/**
 * Records an activity event. Best-effort on purpose: audit logging must
 * never fail the operation that triggered it.
 */
async function logActivity(
  supabase: AdminSupabase,
  tradeInId: string,
  eventType: string,
  description: string,
  createdBy?: string,
) {
  if (!TRADE_IN_ACTIVITY_TYPES.includes(eventType as (typeof TRADE_IN_ACTIVITY_TYPES)[number])) {
    console.error(`[trade-ins] Unknown activity event type: ${eventType}`);
    return;
  }
  const { error } = await supabase.from("trade_in_activity").insert({
    trade_in_id: tradeInId,
    event_type: eventType,
    description,
    created_by: createdBy ?? null,
  });
  if (error) {
    console.error("[trade-ins] Failed to record activity:", error);
  }
}

export type TradeInWorkspace = {
  tradeIn: Database["public"]["Tables"]["trade_ins"]["Row"];
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    main_image_url: string | null;
    is_active: boolean;
    stock_status: string;
  } | null;
  inspection: Database["public"]["Tables"]["trade_in_inspections"]["Row"] | null;
  notes: Database["public"]["Tables"]["trade_in_notes"]["Row"][];
  activity: Database["public"]["Tables"]["trade_in_activity"]["Row"][];
  valuations: Database["public"]["Tables"]["trade_in_valuations"]["Row"][];
  linkedOrder: {
    id: string;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
  } | null;
};

/* ─── Public submission ───────────────────────────────────────────────────── */

/**
 * Submits a trade-in request. Validates everything server-side, uploads any
 * photos, inserts the record with a structured TRD-YYYY-NNNN id and pings
 * staff on Telegram. Telegram is best-effort: a failed notification never
 * fails the submission (telegram_sent stays false and can be retried).
 */
export async function submitTradeIn(formData: FormData) {
  const customer_name = cleanInput(formData.get("customer_name"), 120);
  const phone = cleanInput(formData.get("phone"), 30);
  const email = cleanInput(formData.get("email"), 160).toLowerCase();
  const wanted_product_id = cleanInput(formData.get("wanted_product_id"), 64);
  const wanted_product_storage = cleanInput(formData.get("wanted_product_storage"), 40);
  const trade_device_brand = cleanInput(formData.get("trade_device_brand"), 80);
  const trade_device_model = cleanInput(formData.get("trade_device_model"), 120);
  const trade_device_storage = cleanInput(formData.get("trade_device_storage"), 40);
  const device_condition = cleanInput(formData.get("device_condition"), 40);
  const screen_condition = cleanInput(formData.get("screen_condition"), 40);
  const battery_condition = cleanInput(formData.get("battery_condition"), 40);
  const functional_status = cleanInput(formData.get("functional_status"), 40);
  const faults = cleanInput(formData.get("faults"), 2000);
  const customer_notes = cleanInput(formData.get("customer_notes"), 2000);
  const accessoriesRaw = formData.getAll("accessories").map((v) => String(v).trim().slice(0, 40));
  const photos = formData.getAll("photos") as File[];

  // Required fields
  if (!customer_name) return { error: "Please enter your full name." };
  if (!phone) return { error: "Please enter your phone number." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!trade_device_brand) return { error: "Please select your device brand." };
  if (!trade_device_model) return { error: "Please enter your device model." };

  // The wanted product must be a real, currently available Galaxy Hub
  // product — never silently submitted when unavailable.
  if (!wanted_product_id) return { error: "Please select the device you'd like to upgrade to." };
  const wanted = await getTradeInWantedProduct(wanted_product_id);
  if (!wanted || !wanted.is_active) {
    return {
      code: "product_unavailable" as const,
      error: "This product is currently unavailable. Please choose another device.",
    };
  }
  if (!["available", "limited"].includes(wanted.stock_status)) {
    return {
      code: "product_unavailable" as const,
      error: "This product is currently unavailable. Please choose another device.",
    };
  }
  if (wanted.category_slug?.includes("accessor")) {
    return {
      code: "product_unavailable" as const,
      error: "This product is not eligible for trade-in. Please choose another device.",
    };
  }
  // Validate the chosen storage variant against the product's own options.
  const wantedStorage: string | null = wanted_product_storage || null;
  if (wanted.storage_options.length > 0) {
    if (!wantedStorage || !wanted.storage_options.includes(wantedStorage)) {
      return { error: "Please choose a valid storage option for the device you want." };
    }
  }

  // Controlled condition values — never trust the client.
  if (!isAllowedValue(device_condition, DEVICE_CONDITIONS)) {
    return { error: "Please choose a valid device condition." };
  }
  if (!isAllowedValue(screen_condition, SCREEN_CONDITIONS)) {
    return { error: "Please choose a valid screen condition." };
  }
  if (!isAllowedValue(battery_condition, BATTERY_CONDITIONS)) {
    return { error: "Please choose a valid battery condition." };
  }
  if (!isAllowedValue(functional_status, FUNCTIONAL_STATUSES)) {
    return { error: "Please choose a valid functional status." };
  }

  const accessories = [...new Set(accessoriesRaw.filter((a) => ACCESSORY_OPTIONS.includes(a as (typeof ACCESSORY_OPTIONS)[number])))];
  if (accessoriesRaw.some((a) => !ACCESSORY_OPTIONS.includes(a as (typeof ACCESSORY_OPTIONS)[number]))) {
    return { error: "One of the selected accessories is not valid." };
  }

  if (photos.length > MAX_TRADE_IN_PHOTOS) {
    return { error: `Please upload at most ${MAX_TRADE_IN_PHOTOS} photos.` };
  }
  for (const file of photos) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_PHOTO_EXTS.includes(ext) || !ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return { error: "Photos must be JPG, PNG or WebP images." };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: "Each photo must be 5MB or smaller." };
    }
  }

  const supabase = createClient();

  // Rate limit: one trade-in per contact within the window. Read through the
  // service-role client — the anon role has no SELECT policy on trade_ins.
  const adminSupabase = createAdminClient();
  const since = new Date(Date.now() - TRADE_IN_RATE_LIMIT_MS).toISOString();
  const { data: recent } = await adminSupabase
    .from("trade_ins")
    .select("trade_in_id")
    .or(phone ? `phone.eq.${phone}` : `customer_name.eq.${customer_name}`)
    .gte("created_at", since)
    .limit(1);

  if (recent && recent.length > 0) {
    return { error: "Your request was just received. Please wait a moment before submitting another." };
  }

  // Structured, unique id (TRD-2026-0001) — never expose the raw UUID.
  const { data: tradeInId, error: idError } = await supabase.rpc("next_trade_in_number");
  if (idError || !tradeInId) {
    console.error("[trade-ins] Failed to generate trade-in id:", idError);
    return { error: "Something went wrong. Please try again." };
  }

  // Upload photos first so we never create a partial record.
  // Storage operations use the service-role client — anon cannot create
  // buckets or upload under default storage RLS.
  const uploadedUrls: string[] = [];
  if (photos.length > 0) {
    const adminSupabase = createAdminClient();
    const bucketReady = await getBucket(adminSupabase);
    if (!bucketReady) {
      return { error: "Photo storage is unavailable. Please try again shortly." };
    }
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const filePath = `trade-ins/${tradeInId}/${i + 1}.${ext}`;
      const { error: uploadError } = await adminSupabase.storage
        .from("trade-in-photos")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        console.error("[trade-ins] Photo upload failed:", uploadError);
        return { error: `Could not upload photo ${i + 1}. Please try again.` };
      }
      const { data: urlData } = adminSupabase.storage.from("trade-in-photos").getPublicUrl(filePath);
      uploadedUrls.push(urlData.publicUrl);
    }
  }

  // Insert through the service-role client: the insert needs the returned
  // row (for the Telegram message), and anon has no SELECT policy on
  // trade_ins — `insert().select()` would fail PostgREST's re-select.
  const { data: record, error: insertError } = await adminSupabase
    .from("trade_ins")
    .insert({
      trade_in_id: tradeInId,
      wanted_product_id: wanted.id,
      wanted_product_name: wanted.name,
      wanted_product_storage: wantedStorage,
      trade_device_brand,
      trade_device_model,
      trade_device_storage: trade_device_storage || null,
      customer_name,
      phone,
      email: email || null,
      device_condition,
      screen_condition,
      battery_condition,
      functional_status,
      accessories,
      faults: faults || null,
      customer_notes: customer_notes || null,
      photos: uploadedUrls,
      status: "pending",
    })
    .select("id, trade_in_id, customer_name, phone, email, wanted_product_id, wanted_product_name, wanted_product_storage, trade_device_brand, trade_device_model, trade_device_storage, device_condition, screen_condition, battery_condition, functional_status, accessories, faults, customer_notes, status, photos")
    .single();

  if (insertError || !record) {
    console.error("[trade-ins] Failed to save trade-in:", insertError);
    // Best-effort cleanup of orphaned uploads (service-role storage).
    if (uploadedUrls.length > 0) {
      await createAdminClient().storage
        .from("trade-in-photos")
        .remove(uploadedUrls.map((u) => u.split("/trade-in-photos/")[1]).filter(Boolean));
    }
    return { error: "Something went wrong. Please try again." };
  }

  // Best-effort staff notification — never fails the submission.
  const telegramOk = await sendTelegramNotification("trade-in", buildTradeInTelegramData(record));
  const now = new Date().toISOString();
  await adminSupabase
    .from("trade_ins")
    .update({
      telegram_sent: telegramOk,
      telegram_sent_at: telegramOk ? now : null,
      telegram_error: telegramOk ? null : "Initial notification failed",
    })
    .eq("id", record.id);

  // Audit trail for the submission itself.
  await logActivity(
    adminSupabase,
    record.id,
    "trade_in_submitted",
    `Trade-in request ${tradeInId} submitted by ${customer_name}`,
  );
  if (telegramOk) {
    await logActivity(adminSupabase, record.id, "telegram_sent", "Staff notification sent to Telegram");
  } else {
    await logActivity(adminSupabase, record.id, "telegram_failed", "Staff notification could not be sent");
  }

  return { success: true, trade_in_id: tradeInId };
}

/* ─── Admin ───────────────────────────────────────────────────────────────── */

export async function getTradeIns() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("trade_ins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trade-ins:", error);
    return [];
  }
  return data || [];
}

export async function getTradeInById(id: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("trade_ins")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching trade-in:", error);
    return null;
  }
  return data;
}

/**
 * Fetches everything the detail workspace needs in parallel: the trade-in
 * row, its wanted product, inspection, notes, activity, valuation history
 * and linked order. No catalog-wide or order-wide queries.
 */
export async function getTradeInWorkspace(id: string): Promise<TradeInWorkspace | null> {
  const supabase = await createAdminClient();

  const [tradeInRes, inspectionRes, notesRes, activityRes, valuationsRes] = await Promise.all([
    supabase.from("trade_ins").select("*").eq("id", id).maybeSingle(),
    supabase.from("trade_in_inspections").select("*").eq("trade_in_id", id).maybeSingle(),
    supabase.from("trade_in_notes").select("*").eq("trade_in_id", id).order("created_at", { ascending: false }),
    supabase
      .from("trade_in_activity")
      .select("*")
      .eq("trade_in_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("trade_in_valuations")
      .select("*")
      .eq("trade_in_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (tradeInRes.error || !tradeInRes.data) {
    console.error("Error fetching trade-in workspace:", tradeInRes.error);
    return null;
  }

  // The wanted product is keyed by wanted_product_id (not the trade-in id).
  let product = null;
  if (tradeInRes.data.wanted_product_id) {
    const res = await supabase
      .from("products")
      .select("id, name, slug, price, old_price, main_image_url, is_active, stock_status")
      .eq("id", tradeInRes.data.wanted_product_id)
      .maybeSingle();
    if (!res.error && res.data) product = res.data;
  }

  let linkedOrder = null;
  if (tradeInRes.data.linked_order_id) {
    const res = await supabase
      .from("orders")
      .select("id, order_number, total_amount, status, created_at")
      .eq("id", tradeInRes.data.linked_order_id)
      .maybeSingle();
    if (!res.error && res.data) linkedOrder = res.data;
  }

  return {
    tradeIn: tradeInRes.data,
    product,
    inspection: inspectionRes.error ? null : (inspectionRes.data ?? null),
    notes: notesRes.error ? [] : (notesRes.data ?? []),
    activity: activityRes.error ? [] : (activityRes.data ?? []),
    valuations: valuationsRes.error ? [] : (valuationsRes.data ?? []),
    linkedOrder,
  };
}

/** Starts review: pending → under_review with an audit event. */
export async function startTradeInReview(id: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: existing } = await supabase.from("trade_ins").select("id, status").eq("id", id).maybeSingle();
  if (!existing) return { error: "Trade-in not found" };
  if (existing.status !== "pending" && existing.status !== "under_review") {
    return { error: "Only pending trade-ins can be put under review." };
  }

  const { error } = await supabase
    .from("trade_ins")
    .update({ status: "under_review", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, id, "review_started", "Review started", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/**
 * Saves the staff inspection. Never touches customer-reported fields —
 * inspection data lives in trade_in_inspections (one row per trade-in).
 */
export async function saveTradeInInspection(
  id: string,
  input: {
    inspected_condition: string | null;
    battery_health: string | null;
    screen_condition: string | null;
    body_condition: string | null;
    functional_status: string | null;
    imei_verified: boolean;
    additional_faults: string | null;
    inspection_notes: string | null;
  },
) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: existing } = await supabase.from("trade_ins").select("id").eq("id", id).maybeSingle();
  if (!existing) return { error: "Trade-in not found" };

  const allowed = (value: string | null, options: readonly { value: string }[]) =>
    value === null || options.some((o) => o.value === value);

  if (!allowed(input.inspected_condition, DEVICE_CONDITIONS)) return { error: "Invalid verified condition." };
  if (!allowed(input.screen_condition, SCREEN_CONDITIONS)) return { error: "Invalid screen condition." };
  if (!allowed(input.body_condition, DEVICE_CONDITIONS)) return { error: "Invalid body condition." };
  if (!allowed(input.functional_status, FUNCTIONAL_STATUSES)) return { error: "Invalid functional status." };

  const payload = {
    trade_in_id: id,
    inspected_condition: input.inspected_condition,
    battery_health: input.battery_health?.trim().slice(0, 80) || null,
    screen_condition: input.screen_condition,
    body_condition: input.body_condition,
    functional_status: input.functional_status,
    imei_verified: !!input.imei_verified,
    additional_faults: input.additional_faults?.trim().slice(0, 1000) || null,
    inspection_notes: input.inspection_notes?.trim().slice(0, 2000) || null,
    inspected_by: admin,
    inspected_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("trade_in_inspections").upsert(payload, { onConflict: "trade_in_id" });
  if (error) return { error: error.message };

  await supabase
    .from("trade_ins")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id);

  await logActivity(supabase, id, "inspection_completed", "Staff inspection saved", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/** Adds an internal note. Each save creates a new record — never overwrites. */
export async function addTradeInNote(id: string, note: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const clean = note.trim().slice(0, 2000);
  if (!clean) return { error: "Note cannot be empty." };

  const supabase = await createAdminClient();
  const { data: existing } = await supabase.from("trade_ins").select("id").eq("id", id).maybeSingle();
  if (!existing) return { error: "Trade-in not found" };

  const { error } = await supabase.from("trade_in_notes").insert({
    trade_in_id: id,
    note: clean,
    created_by: admin,
  });
  if (error) return { error: error.message };

  await supabase
    .from("trade_ins")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id);

  await logActivity(supabase, id, "note_added", "Internal note added", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/**
 * Saves the current valuation onto the trade_ins record and appends a
 * history entry (trade_in_valuations) so earlier values are never lost.
 */
export async function saveTradeInValuation(
  id: string,
  input: {
    estimated_value: number | null;
    final_value: number | null;
    valuation_notes: string | null;
  },
) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const validate = (value: number | null) =>
    value !== null && (!Number.isFinite(value) || value < 0);
  if (validate(input.estimated_value)) return { error: "Estimated value must be a positive number." };
  if (validate(input.final_value)) return { error: "Final value must be a positive number." };

  const supabase = await createAdminClient();
  const { data: existing } = await supabase.from("trade_ins").select("id, estimated_value, final_value").eq("id", id).maybeSingle();
  if (!existing) return { error: "Trade-in not found" };

  const { error: updateError } = await supabase
    .from("trade_ins")
    .update({
      estimated_value: input.estimated_value,
      final_value: input.final_value,
      valuation_notes: input.valuation_notes?.trim().slice(0, 2000) || null,
      valued_by: admin,
      valued_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  // History snapshot — keeps an audit trail across valuation changes.
  const { error: historyError } = await supabase.from("trade_in_valuations").insert({
    trade_in_id: id,
    estimated_value: input.estimated_value,
    final_value: input.final_value,
    notes: input.valuation_notes?.trim().slice(0, 2000) || null,
    created_by: admin,
  });
  if (historyError) console.error("[trade-ins] Failed to record valuation history:", historyError);

  if (input.estimated_value !== null) {
    await logActivity(supabase, id, "estimate_added", `Estimated value set to ${input.estimated_value.toLocaleString("en-US")} RWF`, admin);
  }
  if (input.final_value !== null) {
    await logActivity(supabase, id, "final_value_added", `Final trade-in value set to ${input.final_value.toLocaleString("en-US")} RWF`, admin);
  }

  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/**
 * Sends the official offer to the customer (via the existing Telegram
 * channel). Requires a saved final value. Never fails the record: delivery
 * state is stored and retryable.
 */
export async function sendTradeInOffer(id: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: record } = await supabase.from("trade_ins").select("*").eq("id", id).maybeSingle();
  if (!record) return { error: "Trade-in not found" };

  if (record.final_value === null) {
    return { error: "Save a final trade-in value before sending the offer." };
  }

  const telegramOk = await sendTelegramNotification(
    "trade-in-offer",
    {
      tradeInOffer: {
        trade_in_id: record.trade_in_id,
        wanted_product_name: record.wanted_product_name,
        wanted_product_storage: record.wanted_product_storage ?? undefined,
        trade_device_brand: record.trade_device_brand,
        trade_device_model: record.trade_device_model,
        trade_device_storage: record.trade_device_storage ?? undefined,
        final_value: record.final_value,
      },
    },
  );

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("trade_ins")
    .update({
      offer_status: "sent",
      status: "offer_sent",
      offer_sent_at: now,
      telegram_sent: telegramOk,
      telegram_sent_at: telegramOk ? now : null,
      telegram_error: telegramOk ? null : "Offer message failed to send",
      updated_at: now,
    })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  await logActivity(supabase, id, "offer_sent", `Offer of ${record.final_value.toLocaleString("en-US")} RWF sent to customer`, admin);
  if (telegramOk) {
    await logActivity(supabase, id, "telegram_sent", "Offer delivered via Telegram");
  } else {
    await logActivity(supabase, id, "telegram_failed", "Offer could not be delivered via Telegram");
  }

  revalidatePath("/admin/trade-ins");
  return telegramOk ? { success: true } : { error: "Telegram could not be reached. Try again shortly." };
}

/** Records customer acceptance of the offer. */
export async function markTradeInAccepted(id: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: record } = await supabase.from("trade_ins").select("id, offer_status, status").eq("id", id).maybeSingle();
  if (!record) return { error: "Trade-in not found" };
  if (!["sent", "accepted"].includes(record.offer_status ?? "")) {
    return { error: "Send the offer before recording acceptance." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("trade_ins")
    .update({ offer_status: "accepted", status: "accepted", offer_accepted_at: now, updated_at: now })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, id, "offer_accepted", "Customer accepted the trade-in offer", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/** Records customer rejection of the offer. */
export async function markTradeInRejected(id: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: record } = await supabase.from("trade_ins").select("id, offer_status, status").eq("id", id).maybeSingle();
  if (!record) return { error: "Trade-in not found" };
  if (record.offer_status !== "sent") {
    return { error: "Only sent offers can be rejected by the customer." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("trade_ins")
    .update({ offer_status: "rejected", status: "rejected", offer_rejected_at: now, updated_at: now })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, id, "offer_rejected", "Customer rejected the trade-in offer", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/** Marks the trade-in completed. Requires the customer to have accepted. */
export async function completeTradeIn(id: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: record } = await supabase.from("trade_ins").select("id, status").eq("id", id).maybeSingle();
  if (!record) return { error: "Trade-in not found" };
  if (record.status !== "accepted") {
    return { error: "Only accepted trade-ins can be completed." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("trade_ins")
    .update({ status: "completed", completed_at: now, updated_at: now })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, id, "completed", "Trade-in completed", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/** Cancels the trade-in. Prefer this over deletion. */
export async function cancelTradeIn(id: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();
  const { data: record } = await supabase.from("trade_ins").select("id, status").eq("id", id).maybeSingle();
  if (!record) return { error: "Trade-in not found" };
  if (["completed", "cancelled"].includes(record.status)) {
    return { error: "This trade-in is already finished." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("trade_ins")
    .update({ status: "cancelled", updated_at: now })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, id, "cancelled", "Trade-in cancelled", admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/**
 * Links an existing order to the trade-in. The order must exist; no order
 * is created or modified here.
 */
export async function linkTradeInOrder(id: string, orderId: string) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  if (!orderId || orderId.trim().length < 8) return { error: "Select a valid order." };

  const supabase = await createAdminClient();
  const [tradeInRes, orderRes] = await Promise.all([
    supabase.from("trade_ins").select("id").eq("id", id).maybeSingle(),
    (async () => {
      // Accept either the structured order number (GH-2026-000001) or the
      // raw order uuid. The number is the human-facing identifier.
      const byNumber = await supabase
        .from("orders")
        .select("id, order_number")
        .eq("order_number", orderId.trim())
        .maybeSingle();
      if (byNumber.data) return byNumber;
      return supabase.from("orders").select("id, order_number").eq("id", orderId).maybeSingle();
    })(),
  ]);

  if (!tradeInRes.data) return { error: "Trade-in not found" };
  if (!orderRes.data) return { error: "Order not found" };

  const { error } = await supabase
    .from("trade_ins")
    .update({ linked_order_id: orderId, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, id, "order_linked", `Linked to order ${orderRes.data.order_number}`, admin);
  revalidatePath("/admin/trade-ins");
  return { success: true };
}

export async function updateTradeIn(
  id: string,
  input: {
    status?: string;
    estimated_value?: number | null;
    final_value?: number | null;
    admin_notes?: string | null;
  },
) {
  const { admin, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createAdminClient();

  const updates: {
    status?: string;
    estimated_value?: number | null;
    final_value?: number | null;
    admin_notes?: string | null;
    updated_at: string;
  } = { updated_at: new Date().toISOString() };

  if (input.status !== undefined) {
    if (!TRADE_IN_STATUSES.includes(input.status as (typeof TRADE_IN_STATUSES)[number])) {
      return { error: `Invalid status: "${input.status}"` };
    }
    updates.status = input.status;
  }

  if (input.estimated_value !== undefined) {
    const value = input.estimated_value === null ? null : Number(input.estimated_value);
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      return { error: "Estimated value must be a positive number." };
    }
    updates.estimated_value = value;
  }

  if (input.final_value !== undefined) {
    const value = input.final_value === null ? null : Number(input.final_value);
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      return { error: "Final value must be a positive number." };
    }
    updates.final_value = value;
  }

  if (input.admin_notes !== undefined) {
    updates.admin_notes = input.admin_notes === null ? null : input.admin_notes.trim().slice(0, 2000) || null;
  }

  const { error } = await supabase.from("trade_ins").update(updates).eq("id", id);
  if (error) return { error: error.message };

  if (input.status !== undefined) {
    await logActivity(
      supabase,
      id,
      "status_changed",
      `Status changed to ${tradeInStatusLabel(input.status)}`,
      admin,
    );
  }

  revalidatePath("/admin/trade-ins");
  return { success: true };
}

/** Retries the staff Telegram notification for a trade-in. */
export async function resendTradeInTelegram(id: string) {
  const supabase = await createAdminClient();

  const { data: record, error } = await supabase
    .from("trade_ins")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !record) return { error: "Trade-in not found" };

  const telegramOk = await sendTelegramNotification("trade-in", buildTradeInTelegramData(record));
  const now = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("trade_ins")
    .update({
      telegram_sent: telegramOk,
      telegram_sent_at: telegramOk ? now : null,
      telegram_error: telegramOk ? null : "Telegram unreachable on retry",
      updated_at: now,
    })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  if (telegramOk) {
    await logActivity(supabase, id, "telegram_sent", "Staff notification retried and delivered");
  } else {
    await logActivity(supabase, id, "telegram_failed", "Staff notification retry failed");
  }

  revalidatePath("/admin/trade-ins");
  return telegramOk ? { success: true } : { error: "Telegram could not be reached. Try again shortly." };
}

export async function deleteTradeIn(id: string) {
  const supabase = await createAdminClient();

  const { data: existing } = await supabase
    .from("trade_ins")
    .select("id, photos")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return { error: "Trade-in not found" };

  const { error } = await supabase.from("trade_ins").delete().eq("id", id);
  if (error) return { error: error.message };

  // Best-effort cleanup of uploaded photos.
  const paths = (existing.photos ?? [])
    .map((u) => u.split("/trade-in-photos/")[1])
    .filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from("trade-in-photos").remove(paths);
  }

  revalidatePath("/admin/trade-ins");
  return { success: true };
}