"use client";

import React from "react";
import { Product } from "@/data/mock-data";
import { ProductCard } from "./product-card";

interface ProductsGridProps {
  products: Product[];
  columns?: number; // for future use
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onReserve={() => {}} />
        ))}
      </div>
    </div>
  );
}
