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

export interface AmazonKeywordSearchResponse {
  searchPhrase: string;
  productCount: number;
  products: AmazonProduct[];
}

export interface AmazonProductsByCategoryResponse {
  category: string;
  productCount: number;
  products: AmazonProduct[];
}

export interface AmazonLocalizedValue {
  displayValue: string;
  label?: string;
  locale?: string;
}

export interface AmazonImageSize {
  url?: string;
}

export interface AmazonDummyItem {
  asin: string;
  detailPageURL: string;
  category: string;
  itemInfo?: {
    title?: AmazonLocalizedValue;
    byLineInfo?: {
      brand?: AmazonLocalizedValue;
    };
  };
  offersV2?: {
    listings?: Array<{
      price?: {
        money?: {
          amount?: number;
          currency?: string;
          displayAmount?: string;
        };
      };
    }>;
  };
  images?: {
    primary?: {
      medium?: AmazonImageSize;
      large?: AmazonImageSize;
    };
  };
}

export interface AmazonDummyData {
  searchResult: {
    items: AmazonDummyItem[];
  };
}
