import { getJson } from "./client";

export interface AmazonCategory {
  id: string;
  name: string;
}

export interface AmazonPrice {
  amount: number;
  currency: string;
  displayAmount: string;
}

export interface AmazonProduct {
  asin: string;
  title: string;
  brand?: string;
  detailPageUrl: string;
  category: string;
  imageUrl?: string;
  price?: AmazonPrice;
}

export interface AmazonProductsByCategoryResponse {
  category: string;
  productCount: number;
  products: AmazonProduct[];
}

export interface AmazonKeywordSearchResponse {
  searchPhrase: string;
  productCount: number;
  products: AmazonProduct[];
}

export function getAmazonCategories(): Promise<AmazonCategory[]> {
  return getJson<AmazonCategory[]>("/amazon/categories");
}

export function getAmazonProducts(
  category: string,
  size = 24,
): Promise<AmazonProductsByCategoryResponse> {
  const query = new URLSearchParams({
    category,
    size: String(size),
  });
  return getJson<AmazonProductsByCategoryResponse>(`/amazon/products?${query.toString()}`);
}

export function searchAmazonProducts(
  keyword: string,
  size = 24,
): Promise<AmazonKeywordSearchResponse> {
  const query = new URLSearchParams({
    q: keyword,
    size: String(size),
  });
  return getJson<AmazonKeywordSearchResponse>(`/amazon/search?${query.toString()}`);
}
