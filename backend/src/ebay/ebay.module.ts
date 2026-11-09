import { Module } from '@nestjs/common';
import { EbayAuthService } from './ebay-auth.service';
import { EbayController } from './ebay.controller';
import { EbayService } from './ebay.service';

@Module({
  controllers: [EbayController],
  providers: [EbayAuthService, EbayService],
  exports: [EbayAuthService, EbayService],
})
export class EbayModule {}
