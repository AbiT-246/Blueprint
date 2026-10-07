"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { generateEmptyRoomImage } from "@/lib/api/openai";
import { base64ToFile, readFileAsDataUrl } from "@/lib/files";

const BYTES_PER_MEGABYTE = 1024 * 1024;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * BYTES_PER_MEGABYTE;
const GENERATED_IMAGE_FILE_NAME = "empty-room.png";

const ACCEPTED_IMAGE_TYPES: Accept = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export default function ImageDropzone() {
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const previewRef = useRef<ImagePreview | null>(preview);

  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  useEffect(() => {
    return () => {
      if (previewRef.current) revokePreview(previewRef.current);
    };
  }, []);

  const onDropAccepted = useCallback(([file]: File[]) => {
    setPreview(createPreview(file));
  }, []);

  const replacePreview = useCallback((file: File) => {
    setPreview((current) => {
      if (current) revokePreview(current);
      return createPreview(file);
    });
  }, []);

  const clearPreview = useCallback(() => {
    setPreview((current) => {
      if (current) revokePreview(current);
      return null;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
    useDropzone({
      accept: ACCEPTED_IMAGE_TYPES,
      maxSize: MAX_FILE_SIZE_BYTES,
      multiple: false,
      disabled: preview !== null,
      onDropAccepted,
    });

  if (preview) {
    return <SelectedImage preview={preview} onClear={clearPreview} onReplace={replacePreview} />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors ${getDropzoneStateClasses(isDragActive, isDragReject)}`}
      >
        <input {...getInputProps()} />
        <p className="text-lg font-medium text-black dark:text-zinc-50">
          {getDropzoneMessage(isDragActive, isDragReject)}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          PNG, JPG, GIF, or WebP up to {MAX_FILE_SIZE_MB} MB
        </p>
      </div>

      {fileRejections.length > 0 && <RejectionList rejections={fileRejections} />}
    </div>
  );
}

interface SelectedImageProps {
  preview: ImagePreview;
  onClear: () => void;
  onReplace: (file: File) => void;
}

function SelectedImage({ preview, onClear, onReplace }: SelectedImageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const processImage = useCallback(async () => {
    setIsProcessing(true);
    setProcessError(null);
    try {
      const imageDataUrl = await readFileAsDataUrl(preview.file);
      const { base64, mimeType } = await generateEmptyRoomImage(imageDataUrl);
      onReplace(base64ToFile(base64, mimeType, GENERATED_IMAGE_FILE_NAME));
    } catch {
      setProcessError("Something went wrong while processing the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [preview.file, onReplace]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={preview.previewUrl}
          alt={preview.file.name}
          fill
          unoptimized
          className="object-contain"
        />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-lg leading-none text-white transition-colors hover:bg-black/80"
          aria-label={`Remove ${preview.file.name}`}
        >
          ×
        </button>
      </div>

      <button
        type="button"
        onClick={processImage}
        disabled={isProcessing}
        className="rounded-full bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
      >
        {isProcessing ? "Processing..." : "Process"}
      </button>

      {processError && (
        <p className="text-sm text-red-600 dark:text-red-400">{processError}</p>
      )}
    </div>
  );
}

function RejectionList({ rejections }: { rejections: readonly FileRejection[] }) {
  return (
    <ul className="flex flex-col gap-1 text-sm text-red-600 dark:text-red-400">
      {rejections.map(({ file, errors }) => (
        <li key={`${file.name}-${file.lastModified}`}>
          {file.name}: {errors.map((error) => error.message).join(", ")}
        </li>
      ))}
    </ul>
  );
}

function createPreview(file: File): ImagePreview {
  return { file, previewUrl: URL.createObjectURL(file) };
}

function revokePreview(preview: ImagePreview): void {
  URL.revokeObjectURL(preview.previewUrl);
}

function getDropzoneMessage(isDragActive: boolean, isDragReject: boolean): string {
  if (isDragReject) return "Only a single image file is accepted";
  if (isDragActive) return "Drop the image here";
  return "Drag 'n' drop an image here, or click to select";
}

function getDropzoneStateClasses(isDragActive: boolean, isDragReject: boolean): string {
  if (isDragReject) return "border-red-400 bg-red-50 dark:bg-red-950/30";
  if (isDragActive) return "border-blue-400 bg-blue-50 dark:bg-blue-950/30";
  return "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950";
}
