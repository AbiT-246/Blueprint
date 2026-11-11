import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogStoreParamDto } from './dto/catalog-store.dto';
import { GetCatalogProductsDto } from './dto/get-catalog-products.dto';
import { GetMoreCatalogProductsDto } from './dto/get-more-catalog-products.dto';
import { SearchCatalogProductsDto } from './dto/search-catalog-products.dto';
import type {
  StoreCategory,
  StoreKeywordSearchResponse,
  StoreProduct,
  StoreProductsPage,
} from './interfaces/store-catalog.interface';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get(':store/categories')
  getCategories(
    @Param() { store }: CatalogStoreParamDto,
  ): Promise<StoreCategory[]> {
    return this.catalogService.getCategories(store);
  }

  @Get(':store/products')
  getProducts(
    @Param() { store }: CatalogStoreParamDto,
    @Query() { category, size }: GetCatalogProductsDto,
  ): Promise<StoreProductsPage> {
    return this.catalogService.getProducts(store, category.trim(), size);
  }

  @Get(':store/products/more')
  getMoreProducts(
    @Param() { store }: CatalogStoreParamDto,
    @Query() query: GetMoreCatalogProductsDto,
  ): Promise<StoreProduct[]> {
    if (!query.isValidRange()) {
      throw new BadRequestException(
        'Invalid pagination parameters. Ensure end > start and the page size is at most 50.',
      );
    }

    return this.catalogService.getMoreProducts(
      store,
      query.category.trim(),
      query.start,
      query.end,
    );
  }

  @Get(':store/search')
  searchProducts(
    @Param() { store }: CatalogStoreParamDto,
    @Query() { q, aesthetic, size }: SearchCatalogProductsDto,
  ): Promise<StoreKeywordSearchResponse> {
    return this.catalogService.searchProducts(
      store,
      (q ?? '').trim(),
      aesthetic?.trim(),
      size,
    );
  }
}
