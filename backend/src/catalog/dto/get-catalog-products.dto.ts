import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  CATALOG_DEFAULT_PAGE_SIZE,
  CATALOG_MAX_PAGE_SIZE,
} from '../constants/catalog.constants';

export class GetCatalogProductsDto {
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(CATALOG_MAX_PAGE_SIZE)
  size: number = CATALOG_DEFAULT_PAGE_SIZE;
}
