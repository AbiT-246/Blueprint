import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  AMAZON_DEFAULT_PRODUCT_PAGE_SIZE,
  AMAZON_MAX_PRODUCT_PAGE_SIZE,
} from '../constants/amazon.constants';

export class SearchProductsDto {
  @IsString()
  @IsNotEmpty()
  q!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(AMAZON_MAX_PRODUCT_PAGE_SIZE)
  size: number = AMAZON_DEFAULT_PRODUCT_PAGE_SIZE;
}
