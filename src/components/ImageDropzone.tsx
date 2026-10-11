"use client";

import type { DropzoneState, FileRejection } from "react-dropzone";
import { ImageIcon, UploadIcon } from "@/components/landing/icons";
import { MAX_FILE_SIZE_MB } from "@/lib/roomUpload";

interface ImageDropzoneProps {
  dropzone: DropzoneState;
}

export default function ImageDropzone({ dropzone }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, open, isDragActive, isDragReject, fileRejections } = dropzone;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="rounded-3xl bg-night-raised p-2">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed px-6 py-10 text-center transition-colors ${getDropzoneStateClasses(isDragActive, isDragReject)}`}
        >
          <input {...getInputProps()} />
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-lilac text-grape">
            <ImageIcon className="h-5 w-5" />
          </span>
          <p className="text-base font-semibold text-ivory">{getDropzoneMessage(isDragActive, isDragReject)}</p>
          <p className="text-sm text-mist">Drop your room photo, or choose one below</p>
          <button
            type="button"
            onClick={open}
            className="mt-3 flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-sm font-medium text-night transition-colors hover:bg-lilac"
          >
            Upload my room
            <UploadIcon className="h-4 w-4 text-mist" />
          </button>
          <p className="mt-1 text-xs text-mist">
            JPG, PNG, GIF or WebP · Up to {MAX_FILE_SIZE_MB} MB · Just one photo
          </p>
        </div>
      </div>

      {fileRejections.length > 0 && <RejectionList rejections={fileRejections} />}
    </div>
  );
}

function RejectionList({ rejections }: { rejections: readonly FileRejection[] }) {
  return (
    <ul className="flex flex-col gap-1 text-sm text-red-400">
      {rejections.map(({ file, errors }) => (
        <li key={`${file.name}-${file.lastModified}`}>
          {file.name}: {errors.map((error) => error.message).join(", ")}
        </li>
      ))}
    </ul>
  );
}

function getDropzoneMessage(isDragActive: boolean, isDragReject: boolean): string {
  if (isDragReject) return "Only a single image file is accepted";
  if (isDragActive) return "Drop it like it's hot";
  return "Your room's glow-up starts here";
}

function getDropzoneStateClasses(isDragActive: boolean, isDragReject: boolean): string {
  if (isDragReject) return "border-red-400 bg-red-950/30";
  if (isDragActive) return "border-grape-light bg-grape/10";
  return "border-night-line bg-night-sunken";
}
