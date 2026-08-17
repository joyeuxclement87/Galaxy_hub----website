import { Suspense } from "react";
import { getCustomersWithDetail } from "@/data/admin-customers";
import { CustomersClient } from "./CustomersClient";
import { PageHeader } from "@/components/admin/ui";
import { WidgetSkeleton } from "@/components/admin/Skeleton";

export const dynamic = "force-dynamic";

async function CustomersContent() {
  const customers = await getCustomersWithDetail();
  return <CustomersClient customers={customers} />;
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Customer activity across orders, trade-ins and enquiries. Derived from existing records — no duplicate customer data is stored."
      />
      <Suspense fallback={<WidgetSkeleton rows={8} />}>
        <CustomersContent />
      </Suspense>
    </div>
  );
}