import { useCallback, useState } from "react";
import { generateEmptyRoomImage } from "@/lib/api/openai";
import { base64ToFile, readFileAsDataUrl } from "@/lib/files";

const GENERATED_IMAGE_FILE_NAME = "empty-room.png";

interface EmptyRoomGeneration {
  isProcessing: boolean;
  processError: string | null;
  processImage: () => Promise<void>;
}

export function useEmptyRoomGeneration(file: File, onGenerated: (file: File) => void): EmptyRoomGeneration {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const processImage = useCallback(async () => {
    setIsProcessing(true);
    setProcessError(null);
    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      const { base64, mimeType } = await generateEmptyRoomImage(imageDataUrl);
      onGenerated(base64ToFile(base64, mimeType, GENERATED_IMAGE_FILE_NAME));
    } catch {
      setProcessError("Something went wrong while processing the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, onGenerated]);

  return { isProcessing, processError, processImage };
}
