import { getJson } from "./client";

export type ShoppingStore = "ikea" | "amazon";

export const STORE_LABELS: Record<ShoppingStore, string> = {
  ikea: "IKEA",
  amazon: "Amazon",
};

export interface StoreCategory {
  id: string;
  name: string;
}

export interface StoreSalesPrice {
  currencyCode: string;
  numeral: number;
}

/** Normalized product shape used by the shared shopping UI. */
export interface StoreProduct {
  id: string;
  name: string;
  typeName?: string;
  mainImageUrl?: string;
  pipUrl?: string;
  salesPrice?: StoreSalesPrice;
}

export interface StoreProductsPage {
  products: StoreProduct[];
  productCount: number;
}

export interface StoreKeywordSearchResponse {
  searchPhrase: string;
  productCount: number;
  products: StoreProduct[];
}

export interface SearchStoreProductsOptions {
  aestheticLabel?: string;
  size?: number;
}

export function getStoreCategories(store: ShoppingStore): Promise<StoreCategory[]> {
  return getJson<StoreCategory[]>(`/catalog/${store}/categories`);
}

export function getStoreProducts(
  store: ShoppingStore,
  category: string,
  size?: number,
): Promise<StoreProductsPage> {
  const query = new URLSearchParams({ category });
  if (size !== undefined) {
    query.set("size", String(size));
  }
  return getJson<StoreProductsPage>(`/catalog/${store}/products?${query.toString()}`);
}

export function getMoreStoreProducts(
  store: ShoppingStore,
  category: string,
  start: number,
  end: number,
): Promise<StoreProduct[]> {
  const query = new URLSearchParams({
    category,
    start: String(start),
    end: String(end),
  });
  return getJson<StoreProduct[]>(`/catalog/${store}/products/more?${query.toString()}`);
}

export function searchStoreProducts(
  store: ShoppingStore,
  keyword: string,
  options: SearchStoreProductsOptions = {},
): Promise<StoreKeywordSearchResponse> {
  const query = new URLSearchParams();
  if (keyword.trim()) {
    query.set("q", keyword.trim());
  }
  if (options.aestheticLabel?.trim()) {
    query.set("aesthetic", options.aestheticLabel.trim());
  }
  if (options.size !== undefined) {
    query.set("size", String(options.size));
  }

  const suffix = query.toString();
  return getJson<StoreKeywordSearchResponse>(
    `/catalog/${store}/search${suffix ? `?${suffix}` : ""}`,
  );
}
