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
  itemHref?: string;
  itemWebUrl?: string;
  price?: EbayMoney;
  image?: EbayImage;
  condition?: string;
  buyingOptions?: string[];
  seller?: {
    username?: string;
    feedbackPercentage?: string;
    feedbackScore?: number;
  };
}

export interface EbayItemSummarySearchResponse {
  href?: string;
  total?: number;
  next?: string;
  prev?: string;
  limit?: number;
  offset?: number;
  itemSummaries?: EbayItemSummary[];
}
