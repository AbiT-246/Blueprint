import { getJson } from "./client";

export interface IkeaCategory {
  id: string;
  name: string;
  url: string;
  im?: string;
  subs?: IkeaCategory[];
}

export interface IkeaSalesPrice {
  currencyCode: string;
  numeral: number;
}

export interface IkeaProduct {
  id: string;
  name: string;
  typeName?: string;
  mainImageUrl?: string;
  pipUrl?: string;
  itemMeasureReferenceText?: string;
  salesPrice?: IkeaSalesPrice;
}

export interface IkeaProductsByCategoryResponse {
  productListPage?: {
    productWindow?: IkeaProduct[];
    productCount?: number;
  };
}

export interface IkeaMoreProductsResponse {
  moreProducts?: {
    productWindow?: IkeaProduct[];
  };
}

export interface IkeaKeywordSearchResponse {
  searchPhrase: string;
  productCount: number;
  products: IkeaProduct[];
}

export function getIkeaCategories(): Promise<IkeaCategory[]> {
  return getJson<IkeaCategory[]>("/ikea/categories");
}

export function getIkeaProducts(
  category: string,
  size = 24,
): Promise<IkeaProductsByCategoryResponse> {
  const query = new URLSearchParams({
    category,
    size: String(size),
  });
  return getJson<IkeaProductsByCategoryResponse>(`/ikea/products?${query.toString()}`);
}

export function getIkeaMoreProducts(
  category: string,
  start: number,
  end: number,
): Promise<IkeaMoreProductsResponse> {
  const query = new URLSearchParams({
    category,
    start: String(start),
    end: String(end),
  });
  return getJson<IkeaMoreProductsResponse>(`/ikea/products/more?${query.toString()}`);
}

export function searchIkeaProducts(
  keyword: string,
  size = 24,
): Promise<IkeaKeywordSearchResponse> {
  const query = new URLSearchParams({
    q: keyword,
    size: String(size),
  });
  return getJson<IkeaKeywordSearchResponse>(`/ikea/search?${query.toString()}`);
}

export function getIkeaProduct(productId: string): Promise<unknown> {
  return getJson<unknown>(`/ikea/product/${encodeURIComponent(productId)}`);
}
