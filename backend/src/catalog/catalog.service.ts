import { Injectable } from '@nestjs/common';
import { AmazonService } from '../amazon/amazon.service';
import type { AmazonProduct } from '../amazon/interfaces/amazon-product.interface';
import { IkeaService } from '../ikea/ikea.service';
import type { IkeaProduct } from '../ikea/interfaces/ikea-product.interface';
import {
  CATALOG_AMAZON_LIST_PAGE_SIZE,
  CATALOG_DEFAULT_PAGE_SIZE,
  CATALOG_DEFAULT_THEME_KEYWORD,
} from './constants/catalog.constants';
import type {
  ShoppingStore,
  StoreCategory,
  StoreKeywordSearchResponse,
  StoreProduct,
  StoreProductsPage,
} from './interfaces/store-catalog.interface';

@Injectable()
export class CatalogService {
  constructor(
    private readonly amazonService: AmazonService,
    private readonly ikeaService: IkeaService,
  ) {}

  async getCategories(store: ShoppingStore): Promise<StoreCategory[]> {
    if (store === 'amazon') {
      return this.amazonService.getCategories();
    }

    const categories = await this.ikeaService.getCategories();
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async getProducts(
    store: ShoppingStore,
    category: string,
    size: number = CATALOG_DEFAULT_PAGE_SIZE,
  ): Promise<StoreProductsPage> {
    if (store === 'amazon') {
      const response = this.amazonService.getProductsByCategory(category, size);
      return {
        products: response.products.map((product) =>
          this.mapAmazonProduct(product),
        ),
        productCount: response.productCount,
      };
    }

    const response = await this.ikeaService.getProductsByCategory(
      category,
      size,
    );
    const products = (response.productListPage?.productWindow ?? []).map(
      (product) => this.mapIkeaProduct(product),
    );

    return {
      products,
      productCount: response.productListPage?.productCount ?? products.length,
    };
  }

  async getMoreProducts(
    store: ShoppingStore,
    category: string,
    start: number,
    end: number,
  ): Promise<StoreProduct[]> {
    if (store === 'amazon') {
      return [];
    }

    const response = await this.ikeaService.getMoreProducts(
      category,
      start,
      end,
    );
    return (response.moreProducts?.productWindow ?? []).map((product) =>
      this.mapIkeaProduct(product),
    );
  }

  async searchProducts(
    store: ShoppingStore,
    keyword: string,
    aestheticLabel?: string,
    size?: number,
  ): Promise<StoreKeywordSearchResponse> {
    if (store === 'amazon') {
      const pageSize = size ?? CATALOG_AMAZON_LIST_PAGE_SIZE;
      const response = this.amazonService.searchProductsByKeyword(
        keyword,
        pageSize,
      );
      return {
        searchPhrase: response.searchPhrase,
        productCount: response.productCount,
        products: response.products.map((product) =>
          this.mapAmazonProduct(product),
        ),
      };
    }

    const pageSize = size ?? CATALOG_DEFAULT_PAGE_SIZE;
    const searchPhrase = this.buildIkeaSearchPhrase(keyword, aestheticLabel);
    const response = await this.ikeaService.searchProductsByKeyword(
      searchPhrase,
      pageSize,
    );

    return {
      searchPhrase: response.searchPhrase,
      productCount: response.productCount,
      products: response.products.map((product) =>
        this.mapIkeaProduct(product),
      ),
    };
  }

  private buildIkeaSearchPhrase(
    keyword: string,
    aestheticLabel?: string,
  ): string {
    const trimmedKeyword = keyword.trim();
    const trimmedAesthetic = aestheticLabel?.trim().toLowerCase() ?? '';

    if (!trimmedAesthetic) {
      return trimmedKeyword;
    }

    const themeKeyword =
      trimmedKeyword.length > 0
        ? trimmedKeyword
        : CATALOG_DEFAULT_THEME_KEYWORD;
    return `${trimmedAesthetic} ${themeKeyword}`.trim();
  }

  private mapIkeaProduct(product: IkeaProduct): StoreProduct {
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

  private mapAmazonProduct(product: AmazonProduct): StoreProduct {
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
}
