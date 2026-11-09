import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IKEA_CANADA_FALLBACK_CATEGORIES } from './constants/ikea-fallback-categories';
import {
  IKEA_CATEGORIES_PATH,
  IKEA_DEFAULT_COUNTRY,
  IKEA_DEFAULT_LANGUAGE,
  IKEA_DEFAULT_PRODUCT_PAGE_SIZE,
  IKEA_MORE_PRODUCTS_PATH,
  IKEA_PRODUCT_ID_PATTERN,
  IKEA_PRODUCT_LIST_PATH,
  IKEA_REQUEST_TIMEOUT_MS,
  IKEA_SEARCH_BASE_URL,
  IKEA_SEARCH_RESULT_PATH,
  IKEA_WEB_BASE_URL,
} from './constants/ikea.constants';
import { IkeaCategory } from './interfaces/ikea-category.interface';
import {
  IkeaKeywordSearchResponse,
  IkeaMoreProductsResponse,
  IkeaProduct,
  IkeaProductsByCategoryResponse,
  IkeaSearchResultPageResponse,
} from './interfaces/ikea-product.interface';

@Injectable()
export class IkeaService {
  private readonly logger = new Logger(IkeaService.name);

  constructor(private readonly configService: ConfigService) {}

  async getCategories(): Promise<IkeaCategory[]> {
    const url = `${this.getWebBaseUrl()}${IKEA_CATEGORIES_PATH}`;

    try {
      return await this.fetchJson<IkeaCategory[]>(url);
    } catch (error) {
      if (!(error instanceof BadGatewayException)) {
        throw error;
      }

      this.logger.warn(
        `IKEA categories endpoint unavailable; using fallback categories. ${String(error)}`,
      );
      return IKEA_CANADA_FALLBACK_CATEGORIES;
    }
  }

  async getProductsByCategory(
    category: string,
    size: number = IKEA_DEFAULT_PRODUCT_PAGE_SIZE,
  ): Promise<IkeaProductsByCategoryResponse> {
    const url = new URL(`${this.getSearchBaseUrl()}${IKEA_PRODUCT_LIST_PATH}`);
    url.searchParams.set('category', category);
    url.searchParams.set('size', String(size));
    return this.fetchJson<IkeaProductsByCategoryResponse>(url.toString());
  }

  async getMoreProducts(
    category: string,
    start: number,
    end: number,
  ): Promise<IkeaMoreProductsResponse> {
    const url = new URL(`${this.getSearchBaseUrl()}${IKEA_MORE_PRODUCTS_PATH}`);
    url.searchParams.set('category', category);
    url.searchParams.set('start', String(start));
    url.searchParams.set('end', String(end));
    return this.fetchJson<IkeaMoreProductsResponse>(url.toString());
  }

  async getProductById(productId: string): Promise<unknown> {
    if (!IKEA_PRODUCT_ID_PATTERN.test(productId)) {
      throw new BadRequestException('Invalid IKEA product ID');
    }

    const suffix = productId.slice(-3);
    const url = `${this.getWebBaseUrl()}/products/${suffix}/${productId}.json`;
    return this.fetchJson(url);
  }

  async searchProductsByKeyword(
    keyword: string,
    size: number = IKEA_DEFAULT_PRODUCT_PAGE_SIZE,
  ): Promise<IkeaKeywordSearchResponse> {
    const url = new URL(`${this.getSearchBaseUrl()}${IKEA_SEARCH_RESULT_PATH}`);
    url.searchParams.set('q', keyword);
    url.searchParams.set('size', String(size));

    const response = await this.fetchJson<IkeaSearchResultPageResponse>(
      url.toString(),
    );
    const searchResultPage = response.searchResultPage;
    const main = searchResultPage?.products?.main;
    const products = this.mapSearchItemsToProducts(main?.items ?? []);

    return {
      searchPhrase: searchResultPage?.searchPhrase ?? keyword,
      productCount: searchResultPage?.products?.badge ?? products.length,
      products,
    };
  }

  private get country(): string {
    return (
      this.configService.get<string>('IKEA_COUNTRY') ?? IKEA_DEFAULT_COUNTRY
    );
  }

  private get language(): string {
    return (
      this.configService.get<string>('IKEA_LANGUAGE') ?? IKEA_DEFAULT_LANGUAGE
    );
  }

  private getWebBaseUrl(): string {
    return `${IKEA_WEB_BASE_URL}/${this.country}/${this.language}`;
  }

  private getSearchBaseUrl(): string {
    return `${IKEA_SEARCH_BASE_URL}/${this.country}/${this.language}`;
  }

  private async fetchJson<TResponse>(url: string): Promise<TResponse> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(IKEA_REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `IKEA API error (${response.status}) for ${url}: ${errorBody.slice(0, 300)}`,
        );
        throw new BadGatewayException(
          `IKEA API error (${response.status}): ${errorBody.slice(0, 300)}`,
        );
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(`Unable to reach IKEA endpoint ${url}`, error);
      throw new ServiceUnavailableException(
        'Unable to reach the IKEA API endpoint.',
      );
    }
  }

  private mapSearchItemsToProducts(
    items: Array<{ product?: IkeaProduct }>,
  ): IkeaProduct[] {
    const products: IkeaProduct[] = [];

    for (const item of items) {
      if (item.product?.id && item.product.name) {
        products.push(item.product);
      }
    }

    return products;
  }
}
