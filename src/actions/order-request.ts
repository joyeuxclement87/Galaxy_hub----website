"use server";

import { createClient } from "@/lib/supabase-server";
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
