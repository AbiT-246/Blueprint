import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { GetMoreProductsDto } from './dto/get-more-products.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { IkeaService } from './ikea.service';
import { IkeaCategory } from './interfaces/ikea-category.interface';
import {
  IkeaMoreProductsResponse,
  IkeaProductsByCategoryResponse,
} from './interfaces/ikea-product.interface';

@Controller('ikea')
export class IkeaController {
  constructor(private readonly ikeaService: IkeaService) {}

  @Get('categories')
  getCategories(): Promise<IkeaCategory[]> {
    return this.ikeaService.getCategories();
  }

  @Get('products')
  getProducts(
    @Query() { category, size }: GetProductsDto,
  ): Promise<IkeaProductsByCategoryResponse> {
    return this.ikeaService.getProductsByCategory(category.trim(), size);
  }

  @Get('products/more')
  getMoreProducts(
    @Query() query: GetMoreProductsDto,
  ): Promise<IkeaMoreProductsResponse> {
    if (!query.isValidRange()) {
      throw new BadRequestException(
        'Invalid pagination parameters. Ensure end > start and the page size is at most 50.',
      );
    }

    return this.ikeaService.getMoreProducts(
      query.category.trim(),
      query.start,
      query.end,
    );
  }

  @Get('product/:productId')
  getProduct(@Param('productId') productId: string): Promise<unknown> {
    return this.ikeaService.getProductById(productId);
  }
}
