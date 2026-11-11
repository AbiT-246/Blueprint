import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  AMAZON_DEFAULT_PRODUCT_PAGE_SIZE,
  AMAZON_DUMMY_DATA_FILE_NAME,
} from './constants/amazon.constants';
import { AmazonCategory } from './interfaces/amazon-category.interface';
import {
  AmazonDummyData,
  AmazonDummyItem,
  AmazonKeywordSearchResponse,
  AmazonProduct,
  AmazonProductsByCategoryResponse,
} from './interfaces/amazon-product.interface';

@Injectable()
export class AmazonService {
  private readonly logger = new Logger(AmazonService.name);
  private readonly items: AmazonDummyItem[];

  constructor() {
    this.items = this.loadDummyItems();
  }

  getCategories(): AmazonCategory[] {
    const categoryIds = [
      ...new Set(this.items.map((item) => item.category).filter(Boolean)),
    ].sort((left, right) => left.localeCompare(right));

    return categoryIds.map((id) => ({
      id,
      name: this.toCategoryLabel(id),
    }));
  }

  getProductsByCategory(
    category: string,
    size: number = AMAZON_DEFAULT_PRODUCT_PAGE_SIZE,
  ): AmazonProductsByCategoryResponse {
    const normalizedCategory = category.trim().toLowerCase();
    const matchedItems = this.items.filter(
      (item) => item.category.toLowerCase() === normalizedCategory,
    );
    const products = matchedItems
      .slice(0, size)
      .map((item) => this.mapItemToProduct(item));

    return {
      category: normalizedCategory,
      productCount: matchedItems.length,
      products,
    };
  }

  searchProductsByKeyword(
    keyword: string,
    size: number = AMAZON_DEFAULT_PRODUCT_PAGE_SIZE,
  ): AmazonKeywordSearchResponse {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const matchedItems = this.items.filter((item) =>
      this.matchesKeyword(item, normalizedKeyword),
    );
    const products = matchedItems
      .slice(0, size)
      .map((item) => this.mapItemToProduct(item));

    return {
      searchPhrase: keyword.trim(),
      productCount: matchedItems.length,
      products,
    };
  }

  getProductByAsin(asin: string): AmazonProduct {
    const normalizedAsin = asin.trim().toUpperCase();
    const item = this.items.find(
      (candidate) => candidate.asin.toUpperCase() === normalizedAsin,
    );

    if (!item) {
      throw new NotFoundException(`Amazon product "${asin}" was not found.`);
    }

    return this.mapItemToProduct(item);
  }

  private loadDummyItems(): AmazonDummyItem[] {
    const filePath = join(__dirname, AMAZON_DUMMY_DATA_FILE_NAME);

    try {
      const fileContents = readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(fileContents) as AmazonDummyData;
      const items = parsed.searchResult?.items ?? [];

      this.logger.log(`Loaded ${items.length} Amazon dummy products.`);
      return items;
    } catch (error) {
      this.logger.error(
        `Unable to load Amazon dummy data from ${filePath}`,
        error,
      );
      throw error;
    }
  }

  private matchesKeyword(item: AmazonDummyItem, keyword: string): boolean {
    if (keyword.length === 0) {
      return true;
    }

    const searchableValues = [
      item.asin,
      item.category,
      item.detailPageURL,
      item.itemInfo?.title?.displayValue,
      item.itemInfo?.byLineInfo?.brand?.displayValue,
      item.offersV2?.listings?.[0]?.price?.money?.displayAmount,
      item.offersV2?.listings?.[0]?.price?.money?.currency,
    ];

    return searchableValues.some((value) =>
      value?.toLowerCase().includes(keyword),
    );
  }

  private mapItemToProduct(item: AmazonDummyItem): AmazonProduct {
    const money = item.offersV2?.listings?.[0]?.price?.money;
    const amount = money?.amount;
    const currency = money?.currency;
    const displayAmount = money?.displayAmount;
    const imageUrl =
      item.images?.primary?.large?.url ?? item.images?.primary?.medium?.url;

    return {
      asin: item.asin,
      title: item.itemInfo?.title?.displayValue ?? item.asin,
      brand: item.itemInfo?.byLineInfo?.brand?.displayValue,
      detailPageUrl: item.detailPageURL,
      category: item.category,
      imageUrl,
      price:
        amount !== undefined && currency && displayAmount
          ? {
              amount,
              currency,
              displayAmount,
            }
          : undefined,
    };
  }

  private toCategoryLabel(categoryId: string): string {
    return categoryId
      .split('-')
      .filter((part) => part.length > 0)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
