import { Suspense } from "react";
import { getTradeIns } from "@/actions/trade-ins";
import { TradeInsClient } from "./TradeInsClient";

export const dynamic = "force-dynamic";

async function TradeInsContent() {
  const tradeIns = await getTradeIns();
  return <TradeInsClient tradeIns={tradeIns} />;
}

export default function TradeInsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Trade-Ins</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Review device submissions, set trade-in values and keep customers updated.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-50 dark:bg-[#0f2438]" />}>
        <TradeInsContent />
      </Suspense>
    </div>
  );
}