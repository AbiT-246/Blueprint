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

export interface IkeaProductListPage {
  productWindow?: IkeaProduct[];
  productCount?: number;
}

export interface IkeaProductsByCategoryResponse {
  productListPage?: IkeaProductListPage;
}

export interface IkeaMoreProductsResponse {
  moreProducts?: {
    productWindow?: IkeaProduct[];
  };
}

export interface IkeaSearchResultItem {
  product?: IkeaProduct;
}

export interface IkeaSearchResultPage {
  searchPhrase?: string;
  products?: {
    badge?: number;
    main?: {
      items?: IkeaSearchResultItem[];
      start?: number;
      end?: number;
      max?: number;
    };
  };
}

export interface IkeaSearchResultPageResponse {
  searchResultPage?: IkeaSearchResultPage;
}

export interface IkeaKeywordSearchResponse {
  searchPhrase: string;
  productCount: number;
  products: IkeaProduct[];
}
