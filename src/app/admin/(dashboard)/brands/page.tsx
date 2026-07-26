import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getBrands } from "@/data/admin-brands";
import { BrandsTable } from "./BrandsClient";

async function BrandsContent() {
  const brands = await getBrands();
  return <BrandsTable brands={brands} />;
}

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Brands</h1>
          <p className="mt-1 text-sm text-white/40">Manage product brands</p>
        </div>
        <Link href="/admin/brands/new" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-dark shadow-md shadow-ocean/20">
          <Plus className="h-4 w-4" /> Add Brand
        </Link>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <BrandsContent />
      </Suspense>
    </div>
  );
}
