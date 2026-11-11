import { Module } from '@nestjs/common';
import { AmazonModule } from '../amazon/amazon.module';
import { IkeaModule } from '../ikea/ikea.module';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [AmazonModule, IkeaModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
