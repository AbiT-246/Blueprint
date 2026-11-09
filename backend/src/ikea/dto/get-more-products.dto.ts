import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { IKEA_MAX_PRODUCT_PAGE_SIZE } from '../constants/ikea.constants';

export class GetMoreProductsDto {
  @IsString()
  @IsNotEmpty()
  category!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  start!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  end!: number;

  isValidRange(): boolean {
    return (
      this.end > this.start &&
      this.end - this.start <= IKEA_MAX_PRODUCT_PAGE_SIZE
    );
  }
}
