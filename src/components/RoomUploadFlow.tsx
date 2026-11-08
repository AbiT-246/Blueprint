"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LandingPage from "@/components/landing/LandingPage";
import RoomEditor from "@/components/RoomEditor";
import SelectedRoomPreview from "@/components/SelectedRoomPreview";

interface ImagePreview {
  file: File;
  previewUrl: string;
  isGenerated: boolean;
}

export default function RoomUploadFlow() {
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

  const replacePreview = useCallback((file: File | null, isGenerated: boolean) => {
    setPreview((current) => {
      if (current) revokePreview(current);
      return file ? createPreview(file, isGenerated) : null;
    });
  }, []);

  const showUploadedRoom = useCallback((file: File) => replacePreview(file, false), [replacePreview]);
  const showGeneratedRoom = useCallback((file: File) => replacePreview(file, true), [replacePreview]);
  const clearPreview = useCallback(() => replacePreview(null, false), [replacePreview]);

  if (preview?.isGenerated) {
    return <RoomEditor imageUrl={preview.previewUrl} onClose={clearPreview} />;
  }

  if (preview) {
    return (
      <SelectedRoomPreview
        file={preview.file}
        previewUrl={preview.previewUrl}
        onClear={clearPreview}
        onGenerated={showGeneratedRoom}
      />
    );
  }

  return <LandingPage onRoomSelected={showUploadedRoom} />;
}

function createPreview(file: File, isGenerated: boolean): ImagePreview {
  return { file, previewUrl: URL.createObjectURL(file), isGenerated };
}

function revokePreview(preview: ImagePreview): void {
  URL.revokeObjectURL(preview.previewUrl);
}
