"use client";

import React, { useState } from "react";
import { ProductCard } from "./product-card";
import { ReservationModal } from "./reservation-modal";
import { Product } from "@/data/mock-data";

interface CategoryProductGridProps {
  products: Product[];
}

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onReserve={setSelectedProduct} 
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
