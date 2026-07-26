import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Product, Category, DealOffer } from "@/data/mock-data";
import type { HeroSlideData } from "@/components/hero/Hero";
import type { BrandCatalogItem, BrandFilter } from "@/data/brands";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
type PromotionRow = Database["public"]["Tables"]["promotions"]["Row"];
type HeroRow = Database["public"]["Tables"]["hero_sections"]["Row"];

interface ProductWithJoins extends ProductRow {
  category: { name: string } | null;
  brand: { name: string; slug: string; logo_url: string | null } | null;
}

interface HeroWithProduct extends HeroRow {
  product: Pick<ProductRow, "id" | "name" | "slug" | "price" | "old_price" | "main_image_url"> | null;
}

const BRAND_FILTER_MAP: Record<string, string> = {
  Apple: "Phones",
  Samsung: "Phones",
  Google: "Phones",
  "Google Pixel": "Phones",
  Xiaomi: "Phones",
  OnePlus: "Phones",
  Tecno: "Phones",
  Infinix: "Phones",
  Dell: "Laptops",
  Lenovo: "Laptops",
  HP: "Laptops",
  Asus: "Laptops",
  Acer: "Laptops",
  Sony: "Audio",
  JBL: "Audio",
  Anker: "Accessories",
  Baseus: "Accessories",
  Ugreen: "Accessories",
  Spigen: "Accessories",
  Belkin: "Accessories",
  DJI: "Accessories",
  Nintendo: "Accessories",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600";
const FALLBACK_CATEGORY_IMG = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800";
const FALLBACK_BRAND_IMG = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800";
const FALLBACK_PROMO_IMG = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=600";

function toProduct(p: ProductWithJoins): Product {
  let availability: Product["availability"];
  if (p.stock_status === "out_of_stock") availability = "Out of Stock";
  else if (p.stock_status === "coming_soon") availability = "Limited Stock";
  else availability = "In Stock";

  let badge: string | undefined;
  if (p.discount_percentage && p.discount_percentage > 0) badge = "SALE";
  else if (p.is_new) badge = "NEW";

  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    tagline: p.short_description || "",
    description: p.description || "",
    price: Number(p.price),
    originalPrice: p.old_price ? Number(p.old_price) : undefined,
    currency: "RWF",
    category: p.category?.name || "General",
    brand: p.brand?.name || "Unknown",
    image: p.main_image_url || FALLBACK_IMAGE,
    featured: p.is_featured,
    specifications: {},
    availability,
    badge,
    rating: 4.8,
    reviewCount: 32,
  };
}

function toCategory(c: CategoryRow): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: c.image_url || FALLBACK_CATEGORY_IMG,
    productCount: 0,
    featured: false,
    orderPriority: 0,
    seoTitle: `${c.name} | Galaxy Hub Rwanda`,
    seoDescription: c.description || `Shop ${c.name} at Galaxy Hub Rwanda.`,
  };
}

function toBrandCatalogItem(b: BrandRow, index: number): BrandCatalogItem {
  const filter = BRAND_FILTER_MAP[b.name] || "Accessories";
  return {
    id: b.slug,
    slug: b.slug,
    name: b.name,
    filter: filter as Exclude<BrandFilter, "All">,
    description: b.description || `${b.name} products available at Galaxy Hub Rwanda.`,
    tagline: b.description ? b.description.split(".")[0] + "." : `${b.name} products.`,
    category: filter,
    image: FALLBACK_BRAND_IMG,
    logo: b.logo_url || b.name.charAt(0),
    featured: index === 0,
    products: [],
    seoTitle: `${b.name} | Galaxy Hub Rwanda`,
    seoDescription: b.description || `Explore ${b.name} products at Galaxy Hub Rwanda.`,
  };
}

function toDealOffer(p: PromotionRow, index: number): DealOffer {
  const sizes: DealOffer["size"][] = ["large", "medium", "small"];
  return {
    slug: p.id,
    title: p.title,
    description: p.description || "",
    badge: p.discount_percentage ? `UP TO ${p.discount_percentage}% OFF` : "LIMITED OFFER",
    badgeType: index === 0 ? "red" : "accent",
    discountText: p.discount_percentage ? `Save ${p.discount_percentage}%` : "Special Offer",
    ctaText: p.button_text || "Shop Now",
    image: p.image_url || FALLBACK_PROMO_IMG,
    size: sizes[index] || "small",
    category: "All",
  };
}

export interface HomepageData {
  heroSlides: HeroSlideData[];
  featuredProducts: Product[];
  categories: Category[];
  brands: BrandCatalogItem[];
  brandFilters: BrandFilter[];
  promotions: DealOffer[];
  newArrivals: Product[];
  allProducts: Product[];
}

export async function getHomepageData(): Promise<HomepageData> {
  const supabase = createClient();

  const [heroResult, featuredResult, categoriesResult, brandsResult, promotionsResult, newArrivalsResult, allResult] =
    await Promise.allSettled([
      fetchHeroSection(supabase),
      fetchFeaturedProducts(supabase),
      fetchCategories(supabase),
      fetchBrands(supabase),
      fetchPromotions(supabase),
      fetchNewArrivals(supabase),
      fetchAllProducts(supabase),
    ]);

  const empty: HomepageData = {
    heroSlides: [],
    featuredProducts: [],
    categories: [],
    brands: [],
    brandFilters: ["All"],
    promotions: [],
    newArrivals: [],
    allProducts: [],
  };

  return {
    heroSlides: heroResult.status === "fulfilled" ? heroResult.value : (() => { console.error("hero fetch failed", heroResult.reason); return empty.heroSlides; })(),
    featuredProducts: featuredResult.status === "fulfilled" ? featuredResult.value : (() => { console.error("featured fetch failed", featuredResult.reason); return empty.featuredProducts; })(),
    categories: categoriesResult.status === "fulfilled" ? categoriesResult.value : (() => { console.error("categories fetch failed", categoriesResult.reason); return empty.categories; })(),
    brands: brandsResult.status === "fulfilled" ? brandsResult.value : (() => { console.error("brands fetch failed", brandsResult.reason); return empty.brands; })(),
    brandFilters: ["All", "Phones", "Laptops", "Audio", "Accessories"],
    promotions: promotionsResult.status === "fulfilled" ? promotionsResult.value : (() => { console.error("promotions fetch failed", promotionsResult.reason); return empty.promotions; })(),
    newArrivals: newArrivalsResult.status === "fulfilled" ? newArrivalsResult.value : (() => { console.error("new arrivals fetch failed", newArrivalsResult.reason); return empty.newArrivals; })(),
    allProducts: allResult.status === "fulfilled" ? allResult.value : (() => { console.error("all products fetch failed", allResult.reason); return empty.allProducts; })(),
  };
}

async function fetchHeroSection(supabase: ReturnType<typeof createClient>): Promise<HeroSlideData[]> {
  const { data, error } = await supabase
    .from("hero_sections")
    .select(`
      id, badge, title, subtitle, primary_button_text, secondary_button_text,
      product:product_id(id, name, slug, price, old_price, main_image_url)
    `)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (!error && data && data.length > 0) {
    const slides: HeroSlideData[] = [];
    for (const item of data) {
      const hero = item as unknown as HeroWithProduct;
      if (hero.product) {
        slides.push({
          id: hero.product.id,
          badge: hero.badge || "FEATURED TECH",
          title: hero.title || hero.product.name,
          description: hero.subtitle || `${hero.product.name} — available now at Galaxy Hub.`,
          price: Number(hero.product.price),
          originalPrice: hero.product.old_price ? Number(hero.product.old_price) : undefined,
          currency: "RWF",
          image: hero.product.main_image_url || FALLBACK_IMAGE,
          slug: hero.product.slug,
        });
      }
    }
    if (slides.length > 0) return slides;
  }

  const { data: fallback } = await supabase
    .from("products")
    .select(`id, name, slug, price, old_price, main_image_url, short_description`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (fallback && fallback.length > 0) {
    return fallback.map((p) => ({
      id: p.id,
      badge: "NEW ARRIVAL",
      title: p.name,
      description: p.short_description || `${p.name} — available now at Galaxy Hub.`,
      price: Number(p.price),
      originalPrice: p.old_price ? Number(p.old_price) : undefined,
      currency: "RWF",
      image: p.main_image_url || FALLBACK_IMAGE,
      slug: p.slug,
    }));
  }

  return [];
}

async function fetchFeaturedProducts(supabase: ReturnType<typeof createClient>): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, description, price, old_price,
      discount_percentage, main_image_url, is_featured, is_new, stock_status, created_at,
      category:category_id(name),
      brand:brand_id(name, slug, logo_url)
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data) return [];
  return (data as unknown as ProductWithJoins[]).map(toProduct);
}

async function fetchCategories(supabase: ReturnType<typeof createClient>): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data.map(toCategory);
}

async function fetchBrands(supabase: ReturnType<typeof createClient>): Promise<BrandCatalogItem[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data.map((b, i) => toBrandCatalogItem(b, i));
}

async function fetchPromotions(supabase: ReturnType<typeof createClient>): Promise<DealOffer[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((p, i) => toDealOffer(p, i));
}

async function fetchNewArrivals(supabase: ReturnType<typeof createClient>): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, description, price, old_price,
      discount_percentage, main_image_url, is_featured, is_new, stock_status, created_at,
      category:category_id(name),
      brand:brand_id(name, slug, logo_url)
    `)
    .eq("is_active", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data) return [];
  return (data as unknown as ProductWithJoins[]).map(toProduct);
}

async function fetchAllProducts(supabase: ReturnType<typeof createClient>): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, description, price, old_price,
      discount_percentage, main_image_url, is_featured, is_new, stock_status, created_at,
      category:category_id(name),
      brand:brand_id(name, slug, logo_url)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ProductWithJoins[]).map(toProduct);
}
