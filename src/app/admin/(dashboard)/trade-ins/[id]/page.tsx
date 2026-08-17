import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTradeInById } from "@/actions/trade-ins";
import { TradeInDetailClient } from "./TradeInDetailClient";

export default async function TradeInDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tradeIn = await getTradeInById(id);

  if (!tradeIn) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/trade-ins"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Trade-Ins
        </Link>
        <h1 className="mt-2 font-clash text-2xl font-bold text-white tracking-tight">
          {tradeIn.trade_in_id}
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {tradeIn.wanted_product_name}
          {tradeIn.wanted_product_storage ? ` · ${tradeIn.wanted_product_storage}` : ""}
        </p>
      </div>
      <TradeInDetailClient tradeIn={tradeIn} />
    </div>
  );
}