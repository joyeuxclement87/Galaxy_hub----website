import { PromotionForm } from "../PromotionForm";
import { createPromotion } from "@/actions/promotions";

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Add Promotion</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Create a new promotional campaign</p>
      </div>
      <PromotionForm onSubmit={createPromotion} />
    </div>
  );
}
