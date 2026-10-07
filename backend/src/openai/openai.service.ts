import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import OpenAI, { Uploadable } from 'openai';
import { GeneratedImage } from './interfaces/generated-image.interface';
import { OPENAI_CLIENT } from './openai.client';
import { dataUrlToUploadable } from './utils/data-url.util';

const VISION_MODEL = 'gpt-4o';
const IMAGE_MODEL = 'gpt-image-2';
const SOURCE_IMAGE_FILE_NAME = 'source-room';
const IMAGE_OUTPUT_FORMAT = 'png';
const IMAGE_MIME_TYPE = `image/${IMAGE_OUTPUT_FORMAT}`;

const EMPTY_ROOM_INSTRUCTIONS =
  "Imagine I'm trying to create an image of the empty version of this room (so just the base room is there with the window). No furniture, no decoration, no carpet, nothing. However, the angle of the image I'm generating should be exactly the same as this image, so an empty version of this room with the picture taken from the exact same angle. The colour of the wall, floor, etc...should remain the same. The image should be realistic (not animated). Give me a very detailed prompt that I can give the image model to generate it.";

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);

  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  async generateEmptyRoomImage(imageDataUrl: string): Promise<GeneratedImage> {
    const sourceImage = await dataUrlToUploadable(
      imageDataUrl,
      SOURCE_IMAGE_FILE_NAME,
    );
    const prompt = await this.requestEmptyRoomPrompt(imageDataUrl);
    this.logger.log(`Generated empty room prompt: ${prompt}`);
    const base64 = await this.requestImage(prompt, sourceImage);
    return { base64, mimeType: IMAGE_MIME_TYPE };
  }

  private async requestEmptyRoomPrompt(imageDataUrl: string): Promise<string> {
    try {
      const response = await this.openai.responses.create({
        model: VISION_MODEL,
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: EMPTY_ROOM_INSTRUCTIONS },
              { type: 'input_image', image_url: imageDataUrl, detail: 'auto' },
            ],
          },
        ],
      });
      return response.output_text;
    } catch (error) {
      this.logger.error('OpenAI empty room prompt request failed', error);
      throw new BadGatewayException(
        'Unable to generate the empty room prompt from OpenAI.',
      );
    }
  }

  private async requestImage(
    prompt: string,
    sourceImage: Uploadable,
  ): Promise<string> {
    const response = await this.editImage(prompt, sourceImage);
    const base64 = response.data?.[0]?.b64_json;

    if (!base64) {
      this.logger.error('OpenAI response did not contain a generated image');
      throw new BadGatewayException('OpenAI did not return a generated image.');
    }

    return base64;
  }

  private async editImage(
    prompt: string,
    sourceImage: Uploadable,
  ): Promise<OpenAI.Images.ImagesResponse> {
    try {
      return await this.openai.images.edit({
        model: IMAGE_MODEL,
        image: sourceImage,
        prompt,
        output_format: IMAGE_OUTPUT_FORMAT,
      });
    } catch (error) {
      this.logger.error('OpenAI image generation request failed', error);
      throw new BadGatewayException(
        'Unable to generate the empty room image from OpenAI.',
      );
    }
  }
}
