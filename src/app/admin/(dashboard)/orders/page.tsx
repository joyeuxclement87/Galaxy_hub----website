import { Suspense } from "react";
import { getOrdersWithItems } from "@/data/admin-orders";
import { OrdersTable } from "./OrdersClient";

async function OrdersContent() {
  const { orders, itemsByOrder } = await getOrdersWithItems();
  return <OrdersTable orders={orders} itemsByOrder={itemsByOrder} />;
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-white/40">View and manage customer orders placed on the website.</p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
