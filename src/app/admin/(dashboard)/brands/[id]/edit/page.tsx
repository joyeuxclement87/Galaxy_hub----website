import { notFound } from "next/navigation";
import { BrandForm } from "../../BrandForm";
import { getBrandById } from "@/data/admin-brands";
import { updateBrand } from "@/actions/brands";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const brand = await getBrandById(id);
  if (!brand) notFound();

  const boundUpdate = updateBrand.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Edit Brand</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{brand.name}</p>
      </div>
      <BrandForm brand={brand} onSubmit={boundUpdate} />
    </div>
  );
}
