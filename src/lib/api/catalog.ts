import {
  getAmazonCategories,
  getAmazonProducts,
  searchAmazonProducts,
  type AmazonProduct,
} from "./amazon";
import {
  getIkeaCategories,
  getIkeaMoreProducts,
  getIkeaProducts,
  searchIkeaProducts,
  type IkeaProduct,
} from "./ikea";

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

export function getStoreCategories(store: ShoppingStore): Promise<StoreCategory[]> {
  if (store === "amazon") {
    return getAmazonCategories();
  }

  return getIkeaCategories().then((categories) =>
    categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  );
}

export async function getStoreProducts(
  store: ShoppingStore,
  category: string,
  size = 24,
): Promise<StoreProductsPage> {
  if (store === "amazon") {
    const response = await getAmazonProducts(category, size);
    return {
      products: response.products.map(mapAmazonProduct),
      productCount: response.productCount,
    };
  }

  const response = await getIkeaProducts(category, size);
  const products = (response.productListPage?.productWindow ?? []).map(mapIkeaProduct);

  return {
    products,
    productCount: response.productListPage?.productCount ?? products.length,
  };
}

export async function getMoreStoreProducts(
  store: ShoppingStore,
  category: string,
  start: number,
  end: number,
): Promise<StoreProduct[]> {
  if (store === "amazon") {
    return [];
  }

  const response = await getIkeaMoreProducts(category, start, end);
  return (response.moreProducts?.productWindow ?? []).map(mapIkeaProduct);
}

export async function searchStoreProducts(
  store: ShoppingStore,
  keyword: string,
  size = 24,
): Promise<StoreKeywordSearchResponse> {
  if (store === "amazon") {
    const response = await searchAmazonProducts(keyword, size);
    return {
      searchPhrase: response.searchPhrase,
      productCount: response.productCount,
      products: response.products.map(mapAmazonProduct),
    };
  }

  const response = await searchIkeaProducts(keyword, size);
  return {
    searchPhrase: response.searchPhrase,
    productCount: response.productCount,
    products: response.products.map(mapIkeaProduct),
  };
}

function mapIkeaProduct(product: IkeaProduct): StoreProduct {
  return {
    id: product.id,
    name: product.name,
    typeName: product.typeName,
    mainImageUrl: product.mainImageUrl,
    pipUrl: product.pipUrl,
    salesPrice: product.salesPrice
      ? {
          currencyCode: product.salesPrice.currencyCode,
          numeral: product.salesPrice.numeral,
        }
      : undefined,
  };
}

function mapAmazonProduct(product: AmazonProduct): StoreProduct {
  return {
    id: product.asin,
    name: product.title,
    typeName: product.brand,
    mainImageUrl: product.imageUrl,
    pipUrl: product.detailPageUrl,
    salesPrice: product.price
      ? {
          currencyCode: product.price.currency,
          numeral: product.price.amount,
        }
      : undefined,
  };
}
