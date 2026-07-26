import { notFound } from "next/navigation";
import { PromotionForm } from "../../PromotionForm";
import { getPromotionById } from "@/data/admin-promotions";
import { updatePromotion } from "@/actions/promotions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPromotionPage({ params }: Props) {
  const { id } = await params;
  const promotion = await getPromotionById(id);
  if (!promotion) notFound();

  const boundUpdate = updatePromotion.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Edit Promotion</h1>
        <p className="mt-1 text-sm text-white/40">{promotion.title}</p>
      </div>
      <PromotionForm promotion={promotion} onSubmit={boundUpdate} />
    </div>
  );
}
