import { IsNotEmpty, IsString } from 'class-validator';

export class SearchItemsDto {
  @IsString()
  @IsNotEmpty()
  q!: string;
}
