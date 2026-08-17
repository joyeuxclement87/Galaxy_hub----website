import { CategoryForm } from "../CategoryForm";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Add Category</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Create a new product category.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-6 shadow-sm">
        <CategoryForm />
      </div>
    </div>
  );
}
