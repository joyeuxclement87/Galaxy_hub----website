"use server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { sendTelegramNotification } from "@/lib/telegram/telegram";
import { getTradeInWantedProduct } from "@/data/public-products";
import {
  TRADE_IN_STATUSES,
  DEVICE_CONDITIONS,
  SCREEN_CONDITIONS,
  BATTERY_CONDITIONS,
  FUNCTIONAL_STATUSES,
  ACCESSORY_OPTIONS,
  MAX_TRADE_IN_PHOTOS,
  conditionLabel,
} from "@/lib/trade-in";

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

  const { data: record, error: insertError } = await supabase
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
  await adminSupabase
    .from("trade_ins")
    .update({ telegram_sent: telegramOk })
    .eq("id", record.id);

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

export async function updateTradeIn(
  id: string,
  input: {
    status?: string;
    estimated_value?: number | null;
    final_value?: number | null;
    admin_notes?: string | null;
  },
) {
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

  const { error: updateError } = await supabase
    .from("trade_ins")
    .update({ telegram_sent: telegramOk, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

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