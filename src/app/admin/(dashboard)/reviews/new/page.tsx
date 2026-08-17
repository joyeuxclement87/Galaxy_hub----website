import { ReviewForm } from "../ReviewForm";
import { createReview } from "@/actions/reviews";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Add Review</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Create a new customer testimonial</p>
      </div>
      <ReviewForm onSubmit={createReview} />
    </div>
  );
}
