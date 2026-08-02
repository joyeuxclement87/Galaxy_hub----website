import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

/**
 * Compact, product-specific closing CTA. Galaxy Hub processes no direct
 * online payments — this section routes customers to the order-request
 * flow or direct contact instead.
 */
export function OrderCTA({ productName, productSlug }: { productName: string; productSlug: string }) {
  return (
    <section aria-labelledby="order-cta-heading" className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12">
      <div className="relative overflow-hidden rounded-card border border-ocean/8 bg-white px-4 py-6 sm:px-6 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(ellipse,rgba(11,84,151,0.05)_0%,transparent_70%)]" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="section-label">READY TO ORDER?</span>
            <h2 id="order-cta-heading" className="mt-2 font-display text-xl font-bold leading-tight text-ocean-deeper sm:text-2xl">
              Interested in {productName}?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ocean/60">
              Talk to Galaxy Hub about availability and ordering. We confirm everything by phone before any payment.
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-caption font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              No online payment required.
            </p>
          </div>
          <Link
            href={`/order?product=${productSlug}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-ocean-deeper px-6 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover whitespace-nowrap"
          >
            Place Order Request
          </Link>
        </div>
      </div>
    </section>
  );
}
