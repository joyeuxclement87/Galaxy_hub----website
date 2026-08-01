import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getReviews } from "@/data/admin-reviews";
import { ReviewsTable } from "./ReviewsClient";

async function ReviewsContent() {
  const reviews = await getReviews();
  return <ReviewsTable reviews={reviews} />;
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Reviews</h1>
          <p className="mt-1 text-sm text-white/40">Curate customer testimonials for the homepage</p>
        </div>
        <Link href="/admin/reviews/new" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-dark shadow-md shadow-ocean/20">
          <Plus className="h-4 w-4" /> Add Review
        </Link>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <ReviewsContent />
      </Suspense>
    </div>
  );
}
