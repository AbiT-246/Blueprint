"use client";

import IkeaProductCard from "@/components/IkeaProductCard";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import type { IkeaProduct } from "@/lib/api/ikea";

interface IkeaProductResultsProps {
  products: IkeaProduct[];
  onProductSelect: (product: IkeaProduct) => void;
  emptyMessage?: string;
}

export default function IkeaProductResults({
  products,
  onProductSelect,
  emptyMessage = "No products found.",
}: IkeaProductResultsProps) {
  if (products.length === 0) {
    return <SidebarStatusMessage message={emptyMessage} />;
  }

  return (
    <ul className="flex flex-col gap-4">
      {products.map((product) => (
        <li key={product.id}>
          <IkeaProductCard product={product} onSelect={onProductSelect} />
        </li>
      ))}
    </ul>
  );
}
