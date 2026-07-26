import { CategoryForm } from "../CategoryForm";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Add Category</h1>
        <p className="mt-1 text-sm text-white/40">Create a new product category.</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-sm">
        <CategoryForm />
      </div>
    </div>
  );
}
