"use client";

import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { CameraSettings } from "@/lib/room-canvas/cameraSettings";
import type { ItemSelection } from "@/lib/room-canvas/PlacedItem";
import { type PlaceableItem, RoomScene } from "@/lib/room-canvas/RoomScene";

export interface RoomCanvasHandle {
  addItem: (item: PlaceableItem) => Promise<void>;
  setSelectedItemScale: (scale: number) => void;
  removeSelectedItem: () => void;
}

interface RoomCanvasProps {
  backgroundUrl: string;
  cameraSettings: CameraSettings;
  isGridVisible: boolean;
  onSelectionChange: (selection: ItemSelection | null) => void;
  ref?: Ref<RoomCanvasHandle>;
}

export default function RoomCanvas({
  backgroundUrl,
  cameraSettings,
  isGridVisible,
  onSelectionChange,
  ref,
}: RoomCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoomScene | null>(null);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const [hasBackgroundError, setHasBackgroundError] = useState(false);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new RoomScene(containerRef.current, {
      onSelectionChange: (selection) => onSelectionChangeRef.current(selection),
    });
    sceneRef.current = scene;
    scene.setBackground(backgroundUrl).catch(() => setHasBackgroundError(true));

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [backgroundUrl]);

  useEffect(() => {
    sceneRef.current?.setCameraSettings(cameraSettings);
  }, [cameraSettings, backgroundUrl]);

  useEffect(() => {
    sceneRef.current?.setGridVisible(isGridVisible);
  }, [isGridVisible, backgroundUrl]);

  useImperativeHandle(
    ref,
    () => ({
      addItem: (item) => sceneRef.current?.addItem(item) ?? Promise.reject(new Error("Room canvas is not ready.")),
      setSelectedItemScale: (scale) => sceneRef.current?.setSelectedItemScale(scale),
      removeSelectedItem: () => sceneRef.current?.removeSelectedItem(),
    }),
    [],
  );

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {hasBackgroundError && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-red-400">
          Unable to load the room image.
        </p>
      )}
    </div>
  );
}
