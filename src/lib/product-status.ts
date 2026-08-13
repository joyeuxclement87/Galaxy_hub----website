import type { Product } from "@/data/mock-data";

export interface ProductStatus {
  label: string;
  className: string;
}

/* Compact luxury status labels — subtle tints, never dominating the content */
const statusCls = {
  new: "bg-ocean/[0.09] text-ocean border-ocean/[0.15]",
  instock: "bg-emerald-500/[0.09] text-emerald-700 border-emerald-600/[0.15]",
  out: "bg-neutral-200/80 text-neutral-600 border-neutral-400/25",
  soon: "bg-violet-500/[0.09] text-violet-700 border-violet-500/[0.16]",
  discount: "bg-orange-500/[0.09] text-orange-700 border-orange-500/[0.18]",
  other: "bg-ocean/[0.06] text-ocean-deeper/80 border-ocean/[0.12]",
};

const capFirst = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/* ── Status priority: OUT OF STOCK > COMING SOON > badge > NEW > IN STOCK ── */
export function getProductStatus(
  product: Pick<Product, "badge" | "availability">
): ProductStatus | null {
  const badgeLower = product.badge?.toLowerCase() ?? "";
  const isNewBadge = badgeLower.includes("new");
  const isDiscountBadge =
    badgeLower.includes("sale") || badgeLower.includes("off") || badgeLower.includes("discount");

  if (product.availability === "Out of Stock") {
    return { label: "Out of Stock", className: statusCls.out };
  }
  if (product.availability === "Limited Stock") {
    return { label: "Coming Soon", className: statusCls.soon };
  }
  if (product.badge && !isNewBadge) {
    return {
      label: isDiscountBadge ? "On Discount" : capFirst(product.badge.toLowerCase()),
      className: isDiscountBadge ? statusCls.discount : statusCls.other,
    };
  }
  if (isNewBadge) {
    return { label: "New", className: statusCls.new };
  }
  if (product.availability === "In Stock") {
    return { label: "In Stock", className: statusCls.instock };
  }
  return null;
}