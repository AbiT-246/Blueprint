import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateImageTo3DFromUrlDto {
  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  imageUrl!: string;
}
