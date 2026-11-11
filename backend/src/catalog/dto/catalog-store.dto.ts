import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SHOPPING_STORES } from '../constants/catalog.constants';
import type { ShoppingStore } from '../interfaces/store-catalog.interface';

export class CatalogStoreParamDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(SHOPPING_STORES)
  store!: ShoppingStore;
}
