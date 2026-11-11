import { SHOPPING_STORES } from '../constants/catalog.constants';

export type ShoppingStore = (typeof SHOPPING_STORES)[number];

export interface StoreCategory {
  id: string;
  name: string;
}

export interface StoreSalesPrice {
  currencyCode: string;
  numeral: number;
}

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
