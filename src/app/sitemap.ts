const baseUrl = "https://galaxyhub.rw";

export default async function sitemap() {
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "never" as const, priority: 0.2 },
    { url: `${baseUrl}/order`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "never" as const, priority: 0.1 },
  ];

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return staticPages;
  }

  try {
    const { createClient } = await import("@/lib/supabase-server");
    const supabase = createClient();

    const [products, categories, brands] = await Promise.all([
      supabase.from("products").select("slug, updated_at").eq("is_active", true),
      supabase.from("categories").select("slug, updated_at").eq("is_active", true),
      supabase.from("brands").select("slug, updated_at").eq("is_active", true),
    ]);

    const productEntries = (products.data || []).map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updated_at || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categoryEntries = (categories.data || []).map((c) => ({
      url: `${baseUrl}/products/${c.slug}`,
      lastModified: c.updated_at || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const brandEntries = (brands.data || []).map((b) => ({
      url: `${baseUrl}/brands/${b.slug}`,
      lastModified: b.updated_at || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...productEntries, ...categoryEntries, ...brandEntries];
  } catch {
    return staticPages;
  }
}
