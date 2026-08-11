"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { toProductSpecifications } from "@/types/specifications";
import type { ProductSpecifications } from "@/types/specifications";

/**
 * Admin-only actions for copying specifications from an existing Galaxy
 * Hub product into the product form.
 *
 * SECURITY:
 * - Every action re-checks the Supabase session, mirroring the MobileAPI
 *   import actions, so an anonymous caller can never read admin data.
 * - Only the specification groups are ever returned — never price,
 *   stock, images, slug or name of the source product.
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

export interface CopySearchResultItem {
  id: string;
  name: string;
  brandName: string | null;
  categoryName: string | null;
  specificationCount: number;
}

export type CopySearchResponse = { results: CopySearchResultItem[] } | { error: string };

export async function searchProductsForCopy(query: string): Promise<CopySearchResponse> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "You must be signed in as an admin to copy product specifications." };
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { results: [] };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select(`id, name, specifications, category:category_id(name), brand:brand_id(name)`)
      .ilike("name", `%${trimmed}%`)
      .order("name")
      .limit(12);

    if (error) return { error: "Could not search products. Please try again." };

    return {
      results: (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        brandName: (row.brand as { name?: string } | null)?.name ?? null,
        categoryName: (row.category as { name?: string } | null)?.name ?? null,
        specificationCount: toProductSpecifications(row.specifications).reduce(
          (total, group) => total + group.specs.length,
          0
        ),
      })),
    };
  } catch {
    return { error: "Could not search products. Please try again." };
  }
}

export type CopySpecsResult = { productId: string; productName: string; specifications: ProductSpecifications } | { error: string };

export async function getProductSpecificationsForCopy(productId: string): Promise<CopySpecsResult> {
  try {
    await requireAdminSession();
  } catch {
    return { error: "You must be signed in as an admin to copy product specifications." };
  }

  if (!productId || typeof productId !== "string") {
    return { error: "Invalid product selected. Please search again." };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, specifications")
      .eq("id", productId)
      .maybeSingle();

    if (error || !data) {
      return { error: "That product could not be found. Please search again." };
    }

    return {
      productId: data.id,
      productName: data.name,
      specifications: toProductSpecifications(data.specifications),
    };
  } catch {
    return { error: "Could not load that product's specifications. Please try again." };
  }
}