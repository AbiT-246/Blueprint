import { Controller, Get, Param, Query } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { GetProductsDto } from './dto/get-products.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import type { AmazonCategory } from './interfaces/amazon-category.interface';
import type {
  AmazonKeywordSearchResponse,
  AmazonProduct,
  AmazonProductsByCategoryResponse,
} from './interfaces/amazon-product.interface';

@Controller('amazon')
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Get('categories')
  getCategories(): AmazonCategory[] {
    return this.amazonService.getCategories();
  }

  @Get('products')
  getProducts(
    @Query() { category, size }: GetProductsDto,
  ): AmazonProductsByCategoryResponse {
    return this.amazonService.getProductsByCategory(category.trim(), size);
  }

  @Get('search')
  searchProducts(
    @Query() { q, size }: SearchProductsDto,
  ): AmazonKeywordSearchResponse {
    return this.amazonService.searchProductsByKeyword((q ?? '').trim(), size);
  }

  @Get('product/:asin')
  getProduct(@Param('asin') asin: string): AmazonProduct {
    return this.amazonService.getProductByAsin(asin);
  }
}
