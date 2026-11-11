import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { CATALOG_MAX_PAGE_SIZE } from '../constants/catalog.constants';

export class GetMoreCatalogProductsDto {
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
    const pageSize = this.end - this.start;
    return this.end > this.start && pageSize <= CATALOG_MAX_PAGE_SIZE;
  }
}
