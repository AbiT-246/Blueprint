import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EBAY_DEFAULT_MARKETPLACE_ID,
  EBAY_DEFAULT_SEARCH_LIMIT,
  EBAY_ITEM_SUMMARY_SEARCH_PATH,
} from './constants/ebay.constants';
import { EbayAuthService } from './ebay-auth.service';
import { EbayItemSummarySearchResponse } from './interfaces/ebay-item-summary-search.interface';
import { getEbayApiBaseUrl } from './utils/ebay-api-base-url.util';

@Injectable()
export class EbayService {
  private readonly logger = new Logger(EbayService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly ebayAuthService: EbayAuthService,
  ) {}

  async searchItems(keyword: string): Promise<EbayItemSummarySearchResponse> {
    const { accessToken } = await this.ebayAuthService.getAccessToken();
    const searchUrl = this.buildSearchUrl(keyword);

    try {
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': this.getMarketplaceId(),
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `eBay item search failed with status ${response.status}: ${errorBody}`,
        );
        throw new BadGatewayException(
          'Unable to search eBay items for the provided keyword.',
        );
      }

      return (await response.json()) as EbayItemSummarySearchResponse;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error('eBay item search request failed', error);
      throw new ServiceUnavailableException(
        'Unable to reach the eBay Browse API search endpoint.',
      );
    }
  }

  private buildSearchUrl(keyword: string): string {
    const url = new URL(
      `${getEbayApiBaseUrl(this.configService)}${EBAY_ITEM_SUMMARY_SEARCH_PATH}`,
    );
    url.searchParams.set('q', keyword);
    url.searchParams.set('limit', String(EBAY_DEFAULT_SEARCH_LIMIT));
    return url.toString();
  }

  private getMarketplaceId(): string {
    return (
      this.configService.get<string>('EBAY_MARKETPLACE_ID') ??
      EBAY_DEFAULT_MARKETPLACE_ID
    );
  }
}
