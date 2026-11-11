import { postJson } from "./client";

interface EmptyRoomImageRequest {
  image: string;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

export function generateEmptyRoomImage(imageDataUrl: string): Promise<GeneratedImage> {
  return postJson<EmptyRoomImageRequest, GeneratedImage>("/openai/empty-room-image", {
    image: imageDataUrl,
  });
}
