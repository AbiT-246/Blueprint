"use client";

import { useCallback, useState } from "react";
import IkeaProductResults from "@/components/IkeaProductResults";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import { SIDEBAR_OPTION_BUTTON_CLASS, SIDEBAR_SEARCH_SUBMIT_CLASS } from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import {
  getMoreStoreProducts,
  getStoreCategories,
  getStoreProducts,
  STORE_LABELS,
  type ShoppingStore,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/api/catalog";

const INITIAL_PAGE_SIZE = 24;
const LOAD_MORE_PAGE_SIZE = 24;

interface IkeaBrowsePanelProps {
  store: ShoppingStore;
  selectedCategory: StoreCategory | null;
  onSelectCategory: (category: StoreCategory) => void;
  onProductSelect: (product: StoreProduct) => void;
}

export default function IkeaBrowsePanel({
  store,
  selectedCategory,
  onSelectCategory,
  onProductSelect,
}: IkeaBrowsePanelProps) {
  if (selectedCategory) {
    return (
      <StoreProductList
        key={`${store}-${selectedCategory.id}`}
        store={store}
        category={selectedCategory}
        onProductSelect={onProductSelect}
      />
    );
  }

  return <StoreCategoryList store={store} onSelect={onSelectCategory} />;
}

function StoreCategoryList({
  store,
  onSelect,
}: {
  store: ShoppingStore;
  onSelect: (category: StoreCategory) => void;
}) {
  const loadCategories = useCallback(() => getStoreCategories(store), [store]);
  const categoriesResource = useAsyncResource(loadCategories);
  const storeLabel = STORE_LABELS[store];

  if (categoriesResource.status === "loading") {
    return <SidebarStatusMessage message={`Loading ${storeLabel} categories...`} />;
  }

  if (categoriesResource.status === "error") {
    return (
      <SidebarStatusMessage
        message={`Unable to load ${storeLabel} categories. Please try again.`}
        isError
      />
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

function StoreProductList({
  store,
  category,
  onProductSelect,
}: {
  store: ShoppingStore;
  category: StoreCategory;
  onProductSelect: (product: StoreProduct) => void;
}) {
  const loadProducts = useCallback(
    () => getStoreProducts(store, category.id, INITIAL_PAGE_SIZE),
    [store, category.id],
  );
  const productsResource = useAsyncResource(loadProducts);
  const [extraProducts, setExtraProducts] = useState<StoreProduct[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const storeLabel = STORE_LABELS[store];

  if (productsResource.status === "loading") {
    return <SidebarStatusMessage message={`Loading ${storeLabel} products...`} />;
  }

  if (productsResource.status === "error") {
    return (
      <SidebarStatusMessage
        message={`Unable to load ${storeLabel} products. Please try again.`}
        isError
      />
    );
  }

  const products = [...productsResource.data.products, ...extraProducts];
  const totalCount = productsResource.data.productCount;
  const canLoadMore = store === "ikea" && products.length < totalCount;

  async function handleLoadMore() {
    setIsLoadingMore(true);
    setLoadMoreError(null);

    const start = products.length;
    const end = start + LOAD_MORE_PAGE_SIZE;

    try {
      const nextProducts = await getMoreStoreProducts(store, category.id, start, end);
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
