import { getCategories, getBrands } from "@/data/products";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Add Product</h1>
        <p className="mt-1 text-sm text-white/40">
          Create a new product listing.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-sm">
        <ProductForm
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
}
