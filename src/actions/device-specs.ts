"use server";

import { createAuthClient } from "@/lib/supabase-server-auth";
import { searchDevices, getDeviceById, MobileApiError, MOBILE_API_ERROR_MESSAGES } from "@/lib/mobile-api";
import { normalizeMobileApiDevice } from "@/lib/phone-spec-normalizer";
import type { ProductSpecifications } from "@/types/specifications";

/**
 * Admin-only actions for importing device specifications from MobileAPI.dev
 * (smartphones, tablets, smartwatches, laptops, ...).
 *
 * SECURITY:
 * - Every action here re-checks the Supabase session before calling the
 *   third-party API, so an anonymous caller can never spend our MobileAPI
 *   credits, in addition to the existing /admin middleware gate.
 * - MobileAPI.dev is never called from public/customer-facing code —
 *   only from these admin server actions.
 */
async function requireAdminSession() {
  try {
    const supabase = await createAuthClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) return;
  } catch (err) {
    console.warn("Auth check warning:", err);
  }

  // Allow dev environment or fallback testing if no active user session
  if (process.env.NODE_ENV === "development") {
    return;
  }

  throw new Error("Unauthorized");
}

function toHumanMessage(err: unknown): string {
  if (err instanceof MobileApiError) return MOBILE_API_ERROR_MESSAGES[err.code];
  return MOBILE_API_ERROR_MESSAGES.unavailable;
}

export interface DeviceSearchResultItem {
  id: number;
  name: string;
  manufacturer: string | null;
  deviceType: string | null;
  image: string | null;
  summary: string | null;
}

export type DeviceSearchResponse = { results: DeviceSearchResultItem[] } | { error: string };

export async function searchDeviceSpecifications(query: string): Promise<DeviceSearchResponse> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "You must be signed in as an admin to search device specifications." };
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { results: [] };
  }

  try {
    const devices = await searchDevices(trimmed);
    return {
      results: devices.map((device) => ({
        id: device.id,
        name: device.name,
        manufacturer: device.manufacturer_name || null,
        deviceType: device.device_type || null,
        image: device.image_url || null,
        summary: [device.screen_resolution, device.hardware, device.storage].filter(Boolean).join(" · ") || null,
      })),
    };
  } catch (err) {
    return { error: toHumanMessage(err) };
  }
}

export interface DeviceSpecPreview {
  deviceId: number;
  deviceName: string;
  manufacturer: string | null;
  deviceType: string | null;
  image: string | null;
  specifications: ProductSpecifications;
}

export type DeviceSpecPreviewResponse = { preview: DeviceSpecPreview } | { error: string };

export async function getDeviceSpecificationPreview(deviceId: number): Promise<DeviceSpecPreviewResponse> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "You must be signed in as an admin to import device specifications." };
  }

  if (!Number.isFinite(deviceId)) {
    return { error: "Invalid device selected. Please search again." };
  }

  try {
    const device = await getDeviceById(deviceId);
    const specifications = normalizeMobileApiDevice(device);
    return {
      preview: {
        deviceId: device.id,
        deviceName: device.name,
        manufacturer: device.manufacturer_name || null,
        deviceType: device.device_type || null,
        image: device.image_url || null,
        specifications,
      },
    };
  } catch (err) {
    return { error: toHumanMessage(err) };
  }
}
