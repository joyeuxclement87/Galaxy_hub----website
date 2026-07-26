import { BrandForm } from "../BrandForm";
import { createBrand } from "@/actions/brands";

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Add Brand</h1>
        <p className="mt-1 text-sm text-white/40">Create a new product brand</p>
      </div>
      <BrandForm onSubmit={createBrand} />
    </div>
  );
}
