import { Suspense } from "react";
import {
  getSalesReport,
  getProductReport,
  getTradeInReport,
  getPromotionReport,
} from "@/data/admin-reports";
import { ReportsClient } from "./ReportsClient";
import { PageHeader } from "@/components/admin/ui";
import { WidgetSkeleton } from "@/components/admin/Skeleton";

export const dynamic = "force-dynamic";

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 86_400_000);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

async function ReportsContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : "sales";
  const fallback = defaultRange();
  const from = typeof params.from === "string" ? params.from : fallback.from;
  const to = typeof params.to === "string" ? params.to : fallback.to;

  let rows: Record<string, string | number | boolean | null>[] = [];

  if (type === "sales") {
    const data = await getSalesReport(from, to);
    rows = data.map((r) => ({
      "Order": `#${r.order_number}`,
      "Customer": r.customer_name,
      "Phone": r.phone ?? "",
      "Items": r.items,
      "Total": formatRWF(r.total_amount),
      "status": r.status,
      "Date": formatDate(r.created_at),
    }));
  } else if (type === "trade-ins") {
    const data = await getTradeInReport(from, to);
    rows = data.map((r) => ({
      "ID": r.trade_in_id,
      "Customer": r.customer_name,
      "Phone": r.phone,
      "Wanted": r.wanted_product_name,
      "Device": r.trade_device,
      "status": r.status,
      "Est. Value": r.estimated_value === null ? "" : formatRWF(r.estimated_value),
      "Final Value": r.final_value === null ? "" : formatRWF(r.final_value),
      "Date": formatDate(r.created_at),
    }));
  } else if (type === "products") {
    const data = await getProductReport();
    rows = data.map((r) => ({
      "Product": r.name,
      "Category": r.category ?? "",
      "Brand": r.brand ?? "",
      "Price": formatRWF(r.price),
      "stock_status": r.stock_status,
      "is_active": r.is_active,
      "New": r.is_new,
    }));
  } else if (type === "promotions") {
    const data = await getPromotionReport();
    rows = data.map((r) => ({
      "Title": r.title,
      "Discount": r.discount_percentage === null ? "" : `${r.discount_percentage}%`,
      "Starts": r.starts_at ? formatDate(r.starts_at) : "",
      "Ends": r.ends_at ? formatDate(r.ends_at) : "",
      "is_active": r.is_active,
    }));
  }

  return <ReportsClient rows={rows} />;
}

export default function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Exportable business reports. Pick a report type and date range, then export to CSV."
      />
      <Suspense fallback={<WidgetSkeleton rows={8} />}>
        <ReportsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}