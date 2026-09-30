"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";

const BYTES_PER_MEGABYTE = 1024 * 1024;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * BYTES_PER_MEGABYTE;

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
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const previewsRef = useRef<ImagePreview[]>(previews);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => previewsRef.current.forEach(revokePreview);
  }, []);

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPreviews((current) => [...current, ...newPreviews]);
  }, []);

  const removePreview = useCallback((previewUrl: string) => {
    setPreviews((current) => {
      const target = current.find((preview) => preview.previewUrl === previewUrl);
      if (target) revokePreview(target);
      return current.filter((preview) => preview.previewUrl !== previewUrl);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
    useDropzone({
      accept: ACCEPTED_IMAGE_TYPES,
      maxSize: MAX_FILE_SIZE_BYTES,
      onDropAccepted,
    });

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

      {previews.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {previews.map((preview) => (
            <li
              key={preview.previewUrl}
              className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900"
            >
              <Image
                src={preview.previewUrl}
                alt={preview.file.name}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removePreview(preview.previewUrl)}
                className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                aria-label={`Remove ${preview.file.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
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

function revokePreview(preview: ImagePreview): void {
  URL.revokeObjectURL(preview.previewUrl);
}

function getDropzoneMessage(isDragActive: boolean, isDragReject: boolean): string {
  if (isDragReject) return "Only image files are accepted";
  if (isDragActive) return "Drop the images here";
  return "Drag 'n' drop images here, or click to select";
}

function getDropzoneStateClasses(isDragActive: boolean, isDragReject: boolean): string {
  if (isDragReject) return "border-red-400 bg-red-50 dark:bg-red-950/30";
  if (isDragActive) return "border-blue-400 bg-blue-50 dark:bg-blue-950/30";
  return "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950";
}
