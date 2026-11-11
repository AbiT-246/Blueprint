import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CATALOG_MAX_PAGE_SIZE } from '../constants/catalog.constants';

export class SearchCatalogProductsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  aesthetic?: string;

  /** When omitted, the service picks a store-specific default page size. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(CATALOG_MAX_PAGE_SIZE)
  size?: number;
}
