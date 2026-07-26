import { notFound } from "next/navigation";
import { getProductById, getCategories, getBrands } from "@/data/products";
import { ProductForm } from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    getProductById(id),
    getCategories(),
    getBrands(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Edit Product</h1>
        <p className="mt-1 text-sm text-white/40">
          Update &ldquo;{product.name}&rdquo;.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-sm">
        <ProductForm
          product={product}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
}
