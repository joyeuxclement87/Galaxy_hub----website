import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";

/**
 * Compact, product-specific closing CTA. Galaxy Hub processes no direct
 * online payments — this section routes customers to the order-request
 * flow or direct contact instead.
 */
export function OrderCTA({ productName, productSlug }: { productName: string; productSlug: string }) {
  return (
    <section aria-labelledby="order-cta-heading" className="mx-auto max-w-[1320px] px-6 md:px-12">
      <div className="relative overflow-hidden rounded-card border border-ocean/8 bg-white px-6 py-10 sm:px-10 md:px-14 md:py-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(ellipse,rgba(11,84,151,0.05)_0%,transparent_70%)]" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="section-label">READY TO ORDER?</span>
            <h2 id="order-cta-heading" className="mt-3 font-display text-2xl font-bold leading-tight text-ocean-deeper sm:text-3xl">
              Interested in {productName}?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ocean/60">
              Talk to Galaxy Hub about availability and ordering. We confirm everything by phone before any payment.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              No online payment required.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/order?product=${productSlug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-ocean-deeper px-7 py-0 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:-translate-y-0.5 hover:bg-ocean-dark hover:shadow-btn-hover"
            >
              Order This Phone
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://wa.me/250785288910"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white/60 px-7 py-0 text-[11px] font-bold uppercase tracking-[0.12em] text-ocean-deeper backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-ocean/30 hover:bg-white hover:shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Contact Galaxy Hub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
