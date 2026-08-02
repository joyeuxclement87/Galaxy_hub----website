"use server";

import { createClient } from "@/lib/supabase-server";
import { sendNotification } from "@/lib/notifications";
import { toStorageOptions } from "@/types/specifications";

export interface OrderRequestProduct {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  storage_options: string[];
}

export async function getOrderRequestProduct(slug: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, main_image_url, storage_options")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.name,
    image: data.main_image_url || "",
    price: Number(data.price),
    currency: "RWF",
    storage_options: toStorageOptions(data.storage_options),
  } satisfies OrderRequestProduct;
}

const QUOTE_RATE_LIMIT_MS = 60_000;

function cleanInput(value: string | undefined, maxLength: number): string {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function submitQuoteRequest(formData: {
  product_id: string;
  product_slug: string;
  product_name: string;
  variant?: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  const name = cleanInput(formData.name, 120);
  const phone = cleanInput(formData.phone, 30);
  const email = cleanInput(formData.email, 160).toLowerCase();
  const notes = cleanInput(formData.notes, 2000);
  const variant = cleanInput(formData.variant, 100);

  if (!name || !phone) {
    return { error: "Name and phone number are required." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createClient();

  // Rate limit: one enquiry per contact within the window.
  const since = new Date(Date.now() - QUOTE_RATE_LIMIT_MS).toISOString();
  const { data: recent } = await supabase
    .from("product_enquiries")
    .select("id")
    .or(`phone.eq.${phone},email.eq.${email}`)
    .gte("created_at", since)
    .limit(1);

  if (recent && recent.length > 0) {
    return { error: "Your request was just received. Please wait a moment before sending another." };
  }

  const { error } = await supabase.from("product_enquiries").insert({
    product_id: formData.product_id || null,
    product_slug: cleanInput(formData.product_slug, 200),
    product_name: cleanInput(formData.product_name, 300),
    variant: variant || null,
    name,
    phone,
    email: email || null,
    notes: notes || null,
  });

  if (error) {
    console.error("[quote] Failed to save enquiry:", error);
    return { error: "Something went wrong. Please try again." };
  }

  // Best-effort staff notification — never blocks the success response.
  await sendNotification({
    topic: "quote",
    data: {
      quote: {
        product_name: cleanInput(formData.product_name, 300),
        product_slug: cleanInput(formData.product_slug, 200),
        variant: variant || null,
        name,
        phone,
        email: email || null,
        notes: notes || null,
      },
    },
  });

  return { success: true };
}
