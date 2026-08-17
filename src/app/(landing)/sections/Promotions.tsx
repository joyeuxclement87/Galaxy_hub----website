"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLUR_PLACEHOLDER } from "@/lib/image";
import { Reveal } from "@/components/ui/Reveal";
import { MOTION, gridStaggerDelay } from "@/lib/motion";
import type { DealOffer } from "@/data/mock-data";

const MAX_PROMOTIONS = 4;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

function formatDateRange(start?: string | null, end?: string | null): string | null {
  const s = formatDate(start);
  const e = formatDate(end);
  if (s && e) return `${s} — ${e}`;
  return s || e || null;
}

function formatTimeLeft(ms: number): string {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (d > 0) return `${d}D ${String(h).padStart(2, "0")}H ${String(m).padStart(2, "0")}M`;
  if (h > 0) return `${h}H ${String(m).padStart(2, "0")}M`;
  return `${m}M ${String(s).padStart(2, "0")}S`;
}

/* ── Live countdown chip — sits on the card image, auto-expires the card ─── */
function CountdownChip({
  start,
  end,
  onExpired,
}: {
  start?: string | null;
  end?: string | null;
  onExpired: () => void;
}) {
  const [label, setLabel] = useState("ENDS IN");
  const [text, setText] = useState("");
  const expiredRef = useRef(false);

  useEffect(() => {
    const startMs = start ? new Date(start).getTime() : null;
    const endMs = end ? new Date(end).getTime() : null;
    const targetMs = endMs ?? startMs;
    if (!targetMs || Number.isNaN(targetMs)) return;

    const tick = () => {
      const now = Date.now();
      if (startMs !== null && now < startMs) {
        setLabel("STARTS IN");
        setText(formatTimeLeft(startMs - now));
        return;
      }
      setLabel("ENDS IN");
      const ms = targetMs - now;
      if (ms <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpired();
        }
        return;
      }
      setText(formatTimeLeft(ms));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [start, end, onExpired]);

  if (!text) return null;

  return (
    <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-[11px] border border-white/60 bg-white/85 px-3 py-1.5 shadow-[0_4px_14px_rgba(11,84,151,0.10)] backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ocean-deeper/45">{label}</span>
      <span className="font-display text-[13px] font-bold tabular-nums tracking-[-0.01em] text-ocean-deeper">
        {text}
      </span>
    </span>
  );
}

/* ── Building blocks ─────────────────────────────────────────────────────── */

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-ocean/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean-deeper/70">
      {label}
    </span>
  );
}

function CtaLink({ deal, className }: { deal: DealOffer; className?: string }) {
  const href = deal.ctaLink || "/products";
  const inner = (
    <>
      {deal.ctaText}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
    </>
  );
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group/cta ${className ?? ""}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={`group/cta ${className ?? ""}`}>
      {inner}
    </Link>
  );
}

function DealDate({ start, end }: { start?: string | null; end?: string | null }) {
  const range = formatDateRange(start, end);
  if (!range) return null;
  return (
    <p className="mt-2.5 text-[13px] font-semibold tabular-nums tracking-[0.02em] text-ocean/50">
      {range}
    </p>
  );
}

const ctaCls =
  "inline-flex items-center gap-1.5 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark";

/* Standard card — image top, content below (used for 2 / 4, and supporting slots in 3) */
function PromoCard({
  deal,
  onExpired,
}: {
  deal: DealOffer;
  onExpired: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_14px_rgba(11,84,151,0.05)] transition-shadow duration-300 hover:shadow-[0_10px_28px_rgba(11,84,151,0.10)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ivory-dark/40">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <CountdownChip start={deal.startsAt} end={deal.endsAt} onExpired={onExpired} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <StatusPill label={deal.statusLabel} />
        <h3 className="mt-3 font-display text-xl font-bold leading-[1.15] tracking-tight text-ocean-deeper sm:text-[1.375rem]">
          {deal.title}
        </h3>
        {deal.description && (
          <p className="mt-2 text-sm leading-relaxed text-ocean/55 line-clamp-2">{deal.description}</p>
        )}
        <p
          className="mt-4 font-display font-bold leading-none tracking-[-0.02em] text-accent"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.125rem)" }}
        >
          {deal.benefitText}
        </p>
        <DealDate start={deal.startsAt} end={deal.endsAt} />
        <div className="mt-auto pt-5">
          <CtaLink deal={deal} className={ctaCls} />
        </div>
      </div>
    </article>
  );
}

/* Feature block — editorial split: information left, dominant image right (used for 1, and lead of 3) */
function PromoFeature({ deal, onExpired }: { deal: DealOffer; onExpired: () => void }) {
  return (
    <article className="group relative grid h-full overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(11,84,151,0.06)] lg:grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <StatusPill label={deal.statusLabel} />
        <h3
          className="mt-4 font-display font-bold leading-[1.05] tracking-[-0.02em] text-ocean-deeper"
          style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
        >
          {deal.title}
        </h3>
        {deal.description && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ocean/55 line-clamp-3 sm:text-[15px]">
            {deal.description}
          </p>
        )}
        <p
          className="mt-6 font-display font-bold leading-none tracking-[-0.03em] text-accent"
          style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
        >
          {deal.benefitText}
        </p>
        <DealDate start={deal.startsAt} end={deal.endsAt} />
        <div className="mt-6">
          <CtaLink deal={deal} className={ctaCls} />
        </div>
      </div>
      <div className="relative min-h-[260px] overflow-hidden lg:min-h-full">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ocean-deeper/25 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/60 lg:via-transparent lg:to-transparent"
        />
        <CountdownChip start={deal.startsAt} end={deal.endsAt} onExpired={onExpired} />
      </div>
    </article>
  );
}

/* ── Skeleton (matches the eventual layout, no spinner) ─────────────────── */
function SkeletonLayout({ count }: { count: number }) {
  const block = "animate-pulse rounded-[20px] bg-ocean/[0.05]";
  if (count === 1) {
    return <div className={`${block} h-[300px] lg:h-[380px] rounded-[24px]`} />;
  }
  if (count === 2) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className={`${block} h-[380px]`} />
        ))}
      </div>
    );
  }
  if (count === 3) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className={`${block} h-[460px] rounded-[24px]`} />
        <div className="grid gap-5">
          <div className={`${block} h-[220px]`} />
          <div className={`${block} h-[220px]`} />
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`${block} h-[380px]`} />
      ))}
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

interface PromotionsProps {
  promotions: DealOffer[];
}

export function Promotions({ promotions }: PromotionsProps) {
  const [ready, setReady] = useState(false);
  const [activePromotions, setActivePromotions] = useState<DealOffer[]>(() =>
    promotions.slice(0, MAX_PROMOTIONS)
  );

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Live expiry — when a promotion's countdown hits zero, drop it here and
     let the section re-flow (4 → 3 → 2 → 1 → compact fallback) */
  const handleExpire = useCallback((slug: string) => {
    setActivePromotions((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const count = activePromotions.length;

  return (
    <section
      id="deals"
      className="relative rise-angle scroll-mt-24 bg-[#edf3fa] px-4 pt-14 pb-20 sm:px-6 sm:pt-16 sm:pb-24"
    >
      {/* Subtle radial brand glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 50% at 10% 0%, rgba(15,112,201,0.10) 0%, transparent 60%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 40% 45% at 90% 100%, rgba(11,84,151,0.08) 0%, transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-[1320px]">
        {/* Heading */}
        <div className="max-w-3xl">
          <Reveal y={8}>
            <span className="section-label">PROMOTIONS</span>
          </Reveal>
          <Reveal y={14} delay={MOTION.stagger}>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-ocean-deeper sm:text-4xl lg:text-[2.75rem]">
              Limited-Time Tech Offers
            </h2>
          </Reveal>
          <Reveal y={12} delay={MOTION.stagger * 2}>
            <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/55 max-w-xl">
              Genuine smartphones, laptops and accessories — for a limited time at prices worth
              upgrading for.
            </p>
          </Reveal>
        </div>

        {/* Content */}
        {!ready ? (
          <div className="mt-10">
            <SkeletonLayout count={count} />
          </div>
        ) : count === 0 ? (
          <div className="mt-8 flex flex-col gap-4 rounded-[18px] border border-dashed border-ocean/[0.12] bg-white/70 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-bold text-ocean-deeper">No active offers right now.</p>
              <p className="mt-1 text-sm text-ocean/50">Keep exploring our latest products and arrivals.</p>
            </div>
            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark"
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        ) : count === 1 ? (
          <Reveal y={20}>
            <div className="mt-10">
              <PromoFeature
                deal={activePromotions[0]}
                onExpired={() => handleExpire(activePromotions[0].slug)}
              />
            </div>
          </Reveal>
        ) : count === 2 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activePromotions.map((deal, index) => (
              <Reveal key={deal.slug} y={20} delay={gridStaggerDelay(index)}>
                <PromoCard deal={deal} onExpired={() => handleExpire(deal.slug)} />
              </Reveal>
            ))}
          </div>
        ) : count === 3 ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Reveal y={20}>
              <PromoFeature
                deal={activePromotions[0]}
                onExpired={() => handleExpire(activePromotions[0].slug)}
              />
            </Reveal>
            <div className="flex flex-col gap-5">
              <Reveal y={20} delay={gridStaggerDelay(1)}>
                <PromoCard deal={activePromotions[1]} onExpired={() => handleExpire(activePromotions[1].slug)} />
              </Reveal>
              <Reveal y={20} delay={gridStaggerDelay(2)}>
                <PromoCard deal={activePromotions[2]} onExpired={() => handleExpire(activePromotions[2].slug)} />
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activePromotions.map((deal, index) => (
              <Reveal key={deal.slug} y={20} delay={gridStaggerDelay(index)}>
                <PromoCard deal={deal} onExpired={() => handleExpire(deal.slug)} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Promotions;