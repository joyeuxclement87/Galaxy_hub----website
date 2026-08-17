import { Suspense } from "react";
import { getOrdersWithItems } from "@/data/admin-orders";
import { OrdersTable } from "./OrdersClient";
import { PageHeader } from "@/components/admin/ui";

async function OrdersContent() {
  const { orders, itemsByOrder } = await getOrdersWithItems();
  return <OrdersTable orders={orders} itemsByOrder={itemsByOrder} />;
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="View and manage customer orders placed on the website."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-[#162f4a]" />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}