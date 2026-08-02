"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { deleteReview, toggleReviewActive, toggleReviewFeatured } from "@/actions/reviews";
import type { AdminReview } from "@/data/admin-reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`} />
      ))}
    </span>
  );
}

function Avatar({ review }: { review: AdminReview }) {
  if (review.avatar_url) {
    return (
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white/8 border border-white/10">
        <Image src={review.avatar_url} alt={review.author} fill className="object-cover" sizes="36px" unoptimized />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean/20 text-sm font-bold text-ocean">
      {review.author.charAt(0).toUpperCase()}
    </div>
  );
}

export function ReviewsTable({ reviews }: { reviews: AdminReview[] }) {
  if (reviews.length === 0) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
      <Star className="mb-4 h-12 w-12 text-white/20" />
      <p className="font-clash text-base font-semibold text-white/50">No reviews yet</p>
      <p className="mt-1 text-sm text-white/30">Add your first customer testimonial to get started.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Customer</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Rating</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Review</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Featured</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Verified</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reviews.map((r) => (
              <tr key={r.id} className="group transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar review={r} />
                    <div>
                      <span className="text-sm font-semibold text-white leading-tight">{r.author}</span>
                      <p className="text-xs text-white/30">
                        {[r.location, r.role].filter(Boolean).join(" · ") || "Customer"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StarRating rating={r.rating} />
                </td>
                <td className="px-5 py-3.5">
                  <p className="max-w-64 truncate text-sm text-white/60">
                    &ldquo;{r.content}&rdquo;
                  </p>
                  {r.purchased_product && (
                    <p className="mt-0.5 text-caption font-bold uppercase tracking-[0.12em] text-white/25">
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
                    className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors ${r.featured ? "bg-amber-400/20 text-amber-300" : "bg-white/5 text-white/25 hover:text-white/50"}`}
                  >
                    <Star className={`h-3.5 w-3.5 ${r.featured ? "fill-current" : ""}`} />
                  </button>
                </td>
                <td className="px-5 py-3.5 text-center">
                  {r.is_verified
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-caption font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/20">✓</span>
                    : <span className="text-white/20">—</span>}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await toggleReviewActive(r.id, !r.is_active);
                      if (res?.error) alert(res.error);
                      else window.location.reload();
                    }}
                    className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors ${r.is_active ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/25 hover:text-white/50"}`}
                  >
                    {r.is_active ? <span className="text-sm font-bold">✓</span> : <span className="text-sm font-bold">✗</span>}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/reviews/${r.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean hover:bg-ocean/15 transition-colors">Edit</Link>
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
  );
}
