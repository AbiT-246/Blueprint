"use client";

import { useCallback, useState } from "react";
import IkeaProductResults from "@/components/IkeaProductResults";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import { SIDEBAR_OPTION_BUTTON_CLASS, SIDEBAR_SEARCH_SUBMIT_CLASS } from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import {
  getIkeaCategories,
  getIkeaMoreProducts,
  getIkeaProducts,
  type IkeaCategory,
  type IkeaProduct,
} from "@/lib/api/ikea";

const INITIAL_PAGE_SIZE = 24;
const LOAD_MORE_PAGE_SIZE = 24;

interface IkeaBrowsePanelProps {
  selectedCategory: IkeaCategory | null;
  onSelectCategory: (category: IkeaCategory) => void;
  onProductSelect: (product: IkeaProduct) => void;
}

export default function IkeaBrowsePanel({
  selectedCategory,
  onSelectCategory,
  onProductSelect,
}: IkeaBrowsePanelProps) {
  if (selectedCategory) {
    return (
      <IkeaProductList
        key={selectedCategory.id}
        category={selectedCategory}
        onProductSelect={onProductSelect}
      />
    );
  }

  return <IkeaCategoryList onSelect={onSelectCategory} />;
}

function IkeaCategoryList({ onSelect }: { onSelect: (category: IkeaCategory) => void }) {
  const categoriesResource = useAsyncResource(getIkeaCategories);

  if (categoriesResource.status === "loading") {
    return <SidebarStatusMessage message="Loading IKEA categories..." />;
  }

  if (categoriesResource.status === "error") {
    return (
      <SidebarStatusMessage message="Unable to load IKEA categories. Please try again." isError />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {categoriesResource.data.map((category) => (
        <li key={category.id}>
          <button
            type="button"
            onClick={() => onSelect(category)}
            className={SIDEBAR_OPTION_BUTTON_CLASS}
          >
            {category.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

function IkeaProductList({
  category,
  onProductSelect,
}: {
  category: IkeaCategory;
  onProductSelect: (product: IkeaProduct) => void;
}) {
  const loadProducts = useCallback(
    () => getIkeaProducts(category.id, INITIAL_PAGE_SIZE),
    [category.id],
  );
  const productsResource = useAsyncResource(loadProducts);
  const [extraProducts, setExtraProducts] = useState<IkeaProduct[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  if (productsResource.status === "loading") {
    return <SidebarStatusMessage message="Loading IKEA products..." />;
  }

  if (productsResource.status === "error") {
    return (
      <SidebarStatusMessage message="Unable to load IKEA products. Please try again." isError />
    );
  }

  const initialProducts = productsResource.data.productListPage?.productWindow ?? [];
  const products = [...initialProducts, ...extraProducts];
  const totalCount = productsResource.data.productListPage?.productCount ?? products.length;
  const canLoadMore = products.length < totalCount;

  async function handleLoadMore() {
    setIsLoadingMore(true);
    setLoadMoreError(null);

    const start = products.length;
    const end = start + LOAD_MORE_PAGE_SIZE;

    try {
      const response = await getIkeaMoreProducts(category.id, start, end);
      const nextProducts = response.moreProducts?.productWindow ?? [];
      setExtraProducts((current) => [...current, ...nextProducts]);
    } catch {
      setLoadMoreError("Unable to load more products. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <IkeaProductResults
        products={products}
        onProductSelect={onProductSelect}
        emptyMessage="No products found in this category."
      />

      {loadMoreError && <SidebarStatusMessage message={loadMoreError} isError />}

      {canLoadMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className={SIDEBAR_SEARCH_SUBMIT_CLASS}
        >
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
