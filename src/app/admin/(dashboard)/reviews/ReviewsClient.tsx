"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { deleteReview, deleteReviews, toggleReviewActive, toggleReviewFeatured } from "@/actions/reviews";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { BulkDeleteBar } from "@/components/admin/BulkDeleteBar";
import type { AdminReview } from "@/data/admin-reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
      ))}
    </span>
  );
}

function Avatar({ review }: { review: AdminReview }) {
  if (review.avatar_url) {
    return (
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-[#162f4a] border border-slate-200 dark:border-[#1e3a5f]">
        <Image src={review.avatar_url} alt={review.author} fill className="object-cover" sizes="36px" unoptimized />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean/20 text-sm font-bold text-ocean dark:text-[#8ec5f2]">
      {review.author.charAt(0).toUpperCase()}
    </div>
  );
}

export function ReviewsTable({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const { selected, toggle, toggleAll, clear, allSelected, count } = useBulkSelection(
    useMemo(() => reviews.map((r) => r.id), [reviews]),
  );

  if (reviews.length === 0) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-16 text-center">
      <Star className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
      <p className="font-clash text-base font-semibold text-slate-500 dark:text-slate-400">No reviews yet</p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Add your first customer testimonial to get started.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <BulkDeleteBar
        count={count}
        label={count === 1 ? "review" : "reviews"}
        onDelete={async () => {
          const result = await deleteReviews([...selected]);
          if (!result?.error) router.refresh();
          return result;
        }}
        onClear={clear}
      />
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1a3352] text-left">
              <th className="px-5 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={reviews.length === 0}
                  aria-label="Select all reviews"
                  className="h-4 w-4 cursor-pointer rounded accent-ocean"
                />
              </th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Customer</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Rating</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Review</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Featured</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Verified</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1a3352]">
            {reviews.map((r) => (
              <tr key={r.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                <td className="px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                    aria-label={`Select review by ${r.author}`}
                    className="h-4 w-4 cursor-pointer rounded accent-ocean"
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar review={r} />
                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">{r.author}</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {[r.location, r.role].filter(Boolean).join(" · ") || "Customer"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StarRating rating={r.rating} />
                </td>
                <td className="px-5 py-3.5">
                  <p className="max-w-64 truncate text-sm text-slate-500 dark:text-slate-400">
                    &ldquo;{r.content}&rdquo;
                  </p>
                  {r.purchased_product && (
                    <p className="mt-0.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                      Purchased: {r.purchased_product}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await toggleReviewFeatured(r.id, !r.featured);
                      if (res?.error) alert(res.error);
                      else window.location.reload();
                    }}
                    title={r.featured ? "Unfeature" : "Feature"}
                    className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors ${r.featured ? "bg-amber-400/20 text-amber-600 dark:text-amber-300" : "bg-slate-50 dark:bg-[#0f2438] text-slate-400 dark:text-slate-500 hover:text-slate-500"}`}
                  >
                    <Star className={`h-3.5 w-3.5 ${r.featured ? "fill-current" : ""}`} />
                  </button>
                </td>
                <td className="px-5 py-3.5 text-center">
                  {r.is_verified
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 text-caption font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-100 dark:ring-emerald-500/25">✓</span>
                    : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await toggleReviewActive(r.id, !r.is_active);
                      if (res?.error) alert(res.error);
                      else window.location.reload();
                    }}
                    className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors ${r.is_active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-slate-50 dark:bg-[#0f2438] text-slate-400 dark:text-slate-500 hover:text-slate-500"}`}
                  >
                    {r.is_active ? <span className="text-sm font-bold">✓</span> : <span className="text-sm font-bold">✗</span>}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/reviews/${r.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean dark:text-[#8ec5f2] hover:bg-ocean/15 transition-colors">Edit</Link>
                    <form action={async () => {
                      if (!window.confirm("Delete this review? This action cannot be undone.")) return;
                      const res = await deleteReview(r.id);
                      if (res?.error) alert(res.error);
                    }}>
                      <button type="submit" className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition-colors"><Trash2 className="h-3 w-3" /> Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
