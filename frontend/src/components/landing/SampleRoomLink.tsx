"use client";

import { useCallback, useState } from "react";
import { ArrowRightIcon } from "@/components/landing/icons";
import { fetchFile } from "@/lib/files";
import { SAMPLE_ROOM_FILE_NAME, SAMPLE_ROOM_URL } from "@/lib/roomUpload";

interface SampleRoomLinkProps {
  onSampleLoaded: (file: File) => void;
}

export default function SampleRoomLink({ onSampleLoaded }: SampleRoomLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSample = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      onSampleLoaded(await fetchFile(SAMPLE_ROOM_URL, SAMPLE_ROOM_FILE_NAME));
    } catch {
      setLoadError("Couldn't load the sample room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [onSampleLoaded]);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={loadSample}
        disabled={isLoading}
        className="flex w-fit items-center gap-2 text-sm font-medium text-ivory underline underline-offset-4 transition-colors hover:text-lilac disabled:opacity-60"
      >
        Try a sample room
        <ArrowRightIcon className="h-4 w-4 text-grape-light" />
      </button>
      {loadError && <p className="text-sm text-red-400">{loadError}</p>}
    </div>
  );
}
