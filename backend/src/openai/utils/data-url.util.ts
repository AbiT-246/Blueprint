import { BadRequestException } from '@nestjs/common';
import { toFile, Uploadable } from 'openai';

const BASE64_DATA_URL_PATTERN = /^data:(image\/[\w.+-]+);base64,(.+)$/;

export async function dataUrlToUploadable(
  dataUrl: string,
  fileNameWithoutExtension: string,
): Promise<Uploadable> {
  const match = BASE64_DATA_URL_PATTERN.exec(dataUrl);
  if (!match) {
    throw new BadRequestException('Image must be a base64-encoded data URL.');
  }

  const [, mimeType, base64] = match;
  const extension = mimeType.split('/')[1];
  return toFile(
    Buffer.from(base64, 'base64'),
    `${fileNameWithoutExtension}.${extension}`,
    { type: mimeType },
  );
}
