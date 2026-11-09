import { Controller, Get, Query } from '@nestjs/common';
import { SearchItemsDto } from './dto/search-items.dto';
import { EbayAuthService } from './ebay-auth.service';
import { EbayService } from './ebay.service';
import { EbayAccessToken } from './interfaces/ebay-access-token.interface';
import { EbayItemSummarySearchResponse } from './interfaces/ebay-item-summary-search.interface';

@Controller('ebay')
export class EbayController {
  constructor(
    private readonly ebayAuthService: EbayAuthService,
    private readonly ebayService: EbayService,
  ) {}

  @Get('token')
  getAccessToken(): Promise<EbayAccessToken> {
    return this.ebayAuthService.getAccessToken();
  }

  @Get('search')
  searchItems(
    @Query() { q }: SearchItemsDto,
  ): Promise<EbayItemSummarySearchResponse> {
    return this.ebayService.searchItems(q);
  }
}
