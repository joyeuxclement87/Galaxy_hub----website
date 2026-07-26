import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPromotions } from "@/data/admin-promotions";
import { PromotionsTable } from "./PromotionsClient";

async function PromotionsContent() {
  const promotions = await getPromotions();
  return <PromotionsTable promotions={promotions} />;
}

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Promotions</h1>
          <p className="mt-1 text-sm text-white/40">Manage promotional campaigns</p>
        </div>
        <Link href="/admin/promotions/new" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-dark shadow-md shadow-ocean/20">
          <Plus className="h-4 w-4" /> Add Promotion
        </Link>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <PromotionsContent />
      </Suspense>
    </div>
  );
}
