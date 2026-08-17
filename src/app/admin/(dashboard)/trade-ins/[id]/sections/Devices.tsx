"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Smartphone, ShieldCheck, PackageOpen, AlertTriangle, StickyNote, ImageOff } from "lucide-react";
import type { TradeInWorkspace } from "@/actions/trade-ins";
import { conditionLabel } from "@/lib/trade-in";
import { Section, Field, formatRWF } from "../components";
import { cn } from "@/lib/utils";

/* ─── DEVICE WANTED ─────────────────────────────────────────────────────────
   The Galaxy Hub product the customer wants, loaded by wanted_product_id
   from the existing products table. Never duplicated into the trade-in. */

export function WantedDevice({ workspace }: { workspace: TradeInWorkspace }) {
  const { tradeIn, product } = workspace;

  const stockLabel = (status: string) =>
    status === "available" ? "In stock" : status === "limited" ? "Limited stock" : "Out of stock";
  const stockTone = (status: string) =>
    status === "available"
      ? "text-emerald-300"
      : status === "limited"
        ? "text-amber-300"
        : "text-red-300";

  return (
    <Section
      title="Device Wanted"
      icon={<ArrowDown className="h-3.5 w-3.5" />}
      actions={
        product ? (
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#69b1e8] hover:text-[#69b1e8]/80"
          >
            View Product <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : undefined
      }
    >
      {product ? (
        <div className="flex gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-[#0a1628]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.main_image_url ?? ""}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-clash text-base font-bold text-white">{product.name}</p>
            {tradeIn.wanted_product_storage && (
              <p className="mt-0.5 text-xs text-white/40">{tradeIn.wanted_product_storage}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-sm font-bold text-white">{formatRWF(Number(product.price))}</span>
              <span className={cn("text-xs font-semibold", stockTone(product.stock_status))}>
                {stockLabel(product.stock_status)}
              </span>
              {!product.is_active && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> Not on sale
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <ImageOff className="h-8 w-8 shrink-0 text-white/15" />
          <div>
            <p className="text-sm font-bold text-white">
              {tradeIn.wanted_product_name || "Product unavailable"}
            </p>
            <p className="mt-0.5 text-xs text-white/40">
              {tradeIn.wanted_product_id
                ? "This product is no longer available. The trade-in record is kept."
                : "No product was linked to this request."}
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ─── DEVICE BEING TRADED IN — CUSTOMER REPORTED ────────────────────────────
   Read-only snapshot of what the customer submitted. Never edited here;
   staff observations live in the inspection section. */

export function TradedDevice({ workspace }: { workspace: TradeInWorkspace }) {
  const { tradeIn } = workspace;

  return (
    <Section
      title="Device Being Traded In"
      icon={<Smartphone className="h-3.5 w-3.5" />}
      actions={
        <span className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
          Customer Reported
        </span>
      }
    >
      <p className="font-clash text-base font-bold text-white">
        {tradeIn.trade_device_brand} {tradeIn.trade_device_model}
        {tradeIn.trade_device_storage && (
          <span className="text-white/40 font-medium"> · {tradeIn.trade_device_storage}</span>
        )}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <Field label="Condition" value={conditionLabel(tradeIn.device_condition)} />
        <Field label="Screen" value={conditionLabel(tradeIn.screen_condition)} />
        <Field label="Battery" value={conditionLabel(tradeIn.battery_condition)} />
        <Field label="Functional" value={conditionLabel(tradeIn.functional_status)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
            <PackageOpen className="h-3 w-3" /> Accessories
          </p>
          <p className="mt-1.5 text-sm text-white/80">
            {tradeIn.accessories.length > 0 ? tradeIn.accessories.join(", ") : "None"}
          </p>
        </div>
        {tradeIn.faults && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
              <AlertTriangle className="h-3 w-3" /> Faults
            </p>
            <p className="mt-1.5 text-sm text-white/80 whitespace-pre-wrap">{tradeIn.faults}</p>
          </div>
        )}
      </div>

      {tradeIn.customer_notes && (
        <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
            <StickyNote className="h-3 w-3" /> Customer Notes
          </p>
          <p className="mt-1.5 text-sm text-white/80 whitespace-pre-wrap">{tradeIn.customer_notes}</p>
        </div>
      )}
    </Section>
  );
}