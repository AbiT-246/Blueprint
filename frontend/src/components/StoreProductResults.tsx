"use client";

import StoreProductCard from "@/components/StoreProductCard";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import type { StoreProduct } from "@/lib/api/catalog";

interface StoreProductResultsProps {
  products: StoreProduct[];
  onProductSelect: (product: StoreProduct) => void;
  emptyMessage?: string;
}

export default function StoreProductResults({
  products,
  onProductSelect,
  emptyMessage = "No products found.",
}: StoreProductResultsProps) {
  if (products.length === 0) {
    return <SidebarStatusMessage message={emptyMessage} />;
  }

  return (
    <ul className="flex flex-col gap-4">
      {products.map((product) => (
        <li key={product.id}>
          <StoreProductCard product={product} onSelect={onProductSelect} />
        </li>
      ))}
    </ul>
  );
}
