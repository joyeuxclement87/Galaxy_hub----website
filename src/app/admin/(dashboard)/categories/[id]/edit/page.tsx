import { notFound } from "next/navigation";
import { getCategoryById } from "@/data/categories";
import { CategoryForm } from "../../CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Edit Category</h1>
        <p className="mt-1 text-sm text-white/40">
          Update &ldquo;{category.name}&rdquo;.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-sm">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
