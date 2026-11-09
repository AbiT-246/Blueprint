import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  IKEA_DEFAULT_PRODUCT_PAGE_SIZE,
  IKEA_MAX_PRODUCT_PAGE_SIZE,
} from '../constants/ikea.constants';

export class GetProductsDto {
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(IKEA_MAX_PRODUCT_PAGE_SIZE)
  size: number = IKEA_DEFAULT_PRODUCT_PAGE_SIZE;
}
