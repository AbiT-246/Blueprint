import { Body, Controller, Post } from '@nestjs/common';
import { GenerateEmptyRoomImageDto } from './dto/generate-empty-room-image.dto';
import { GeneratedImage } from './interfaces/generated-image.interface';
import { OpenAiService } from './openai.service';

@Controller('openai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('empty-room-image')
  generateEmptyRoomImage(
    @Body() { image }: GenerateEmptyRoomImageDto,
  ): Promise<GeneratedImage> {
    return this.openAiService.generateEmptyRoomImage(image);
  }
}
