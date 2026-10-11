"use client";

import Image from "next/image";
import ScanOverlay from "@/components/ScanOverlay";
import { useEmptyRoomGeneration } from "@/hooks/useEmptyRoomGeneration";

interface SelectedRoomPreviewProps {
  file: File;
  previewUrl: string;
  onClear: () => void;
  onGenerated: (file: File) => void;
}

export default function SelectedRoomPreview({ file, previewUrl, onClear, onGenerated }: SelectedRoomPreviewProps) {
  const { isProcessing, processError, processImage } = useEmptyRoomGeneration(file, onGenerated);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-night px-6 py-12 font-sans">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-night-raised">
          <Image src={previewUrl} alt={file.name} fill unoptimized className="object-contain" />
          {isProcessing && <ScanOverlay />}
          {!isProcessing && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-night-line bg-night-raised/90 text-lg leading-none text-ivory backdrop-blur transition-colors hover:bg-night-raised"
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={processImage}
          disabled={isProcessing}
          className="rounded-full bg-ivory px-8 py-3 font-medium text-night transition-colors hover:bg-lilac disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? "Processing..." : "Process"}
        </button>

        {processError && <p className="text-sm text-red-400">{processError}</p>}
      </div>
    </div>
  );
}
