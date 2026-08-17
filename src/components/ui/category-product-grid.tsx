"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ReservationModal } from "./reservation-modal";
import { Product } from "@/data/mock-data";
import { gridStaggerDelay } from "@/lib/motion";

interface CategoryProductGridProps {
  products: Product[];
}

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onReserve={setSelectedProduct} 
            delay={gridStaggerDelay(index)}
          />
        ))}
      </div>

      <ReservationModal
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </>
  );
}
