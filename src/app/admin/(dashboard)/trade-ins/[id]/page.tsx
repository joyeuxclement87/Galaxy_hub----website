import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTradeInWorkspace } from "@/actions/trade-ins";
import { TradeInDetailClient } from "./TradeInDetailClient";

export const dynamic = "force-dynamic";

function WorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
          ))}
        </div>
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function WorkspaceContent({ id }: { id: string }) {
  const workspace = await getTradeInWorkspace(id);
  if (!workspace) notFound();

  return <TradeInDetailClient key={workspace.tradeIn.updated_at} workspace={workspace} />;
}

export default async function TradeInDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Trade-In Detail</h1>
      <Suspense fallback={<WorkspaceSkeleton />}>
        <WorkspaceContent id={id} />
      </Suspense>
    </div>
  );
}