import { Suspense } from "react";
import { getTradeIns } from "@/actions/trade-ins";
import { TradeInsClient } from "./TradeInsClient";

async function TradeInsContent() {
  const tradeIns = await getTradeIns();
  return <TradeInsClient tradeIns={tradeIns} />;
}

export default function TradeInsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Trade-Ins</h1>
        <p className="mt-1 text-sm text-white/40">
          Review device submissions, set trade-in values and keep customers updated.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}>
        <TradeInsContent />
      </Suspense>
    </div>
  );
}