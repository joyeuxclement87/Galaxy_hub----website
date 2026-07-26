import { Suspense } from "react";
import { getOrders } from "@/data/admin-orders";
import { OrdersTable } from "./OrdersClient";

async function OrdersContent() {
  const orders = await getOrders();
  return <OrdersTable orders={orders} />;
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-white/40">Manage customer orders</p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
