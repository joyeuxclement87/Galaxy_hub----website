"use client";

import React from "react";
import { Product } from "@/data/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { gridStaggerDelay } from "@/lib/motion";

interface ProductsGridProps {
  products: Product[];
  columns?: number; // for future use
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {products.map((p, index) => (
          <ProductCard key={p.id} product={p} onReserve={() => {}} delay={gridStaggerDelay(index)} />
        ))}
      </div>
    </div>
  );
}
