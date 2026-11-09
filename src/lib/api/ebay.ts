import { getJson } from "./client";

export interface EbayMoney {
  value: string;
  currency: string;
}

export interface EbayImage {
  imageUrl: string;
}

export interface EbayItemSummary {
  itemId: string;
  title: string;
  itemWebUrl?: string;
  price?: EbayMoney;
  image?: EbayImage;
}

export interface EbayItemSummarySearchResponse {
  href?: string;
  total?: number;
  limit?: number;
  offset?: number;
  itemSummaries?: EbayItemSummary[];
}

export function searchEbayItems(keyword: string): Promise<EbayItemSummarySearchResponse> {
  const query = new URLSearchParams({ q: keyword });
  return getJson<EbayItemSummarySearchResponse>(`/ebay/search?${query.toString()}`);
}
