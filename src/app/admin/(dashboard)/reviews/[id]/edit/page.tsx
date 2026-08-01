import { notFound } from "next/navigation";
import { ReviewForm } from "../../ReviewForm";
import { getReviewById } from "@/data/admin-reviews";
import { updateReview } from "@/actions/reviews";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: Props) {
  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) notFound();

  const boundUpdate = updateReview.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Edit Review</h1>
        <p className="mt-1 text-sm text-white/40">{review.author}</p>
      </div>
      <ReviewForm review={review} onSubmit={boundUpdate} />
    </div>
  );
}
