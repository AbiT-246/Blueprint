import { IsDataURI } from 'class-validator';

export class GenerateEmptyRoomImageDto {
  @IsDataURI()
  image!: string;
}
