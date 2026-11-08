"use client";

import { useCallback, useRef, useState } from "react";
import AestheticSidebar from "@/components/AestheticSidebar";
import PerspectivePanel from "@/components/PerspectivePanel";
import RoomCanvas, { type RoomCanvasHandle } from "@/components/RoomCanvas";
import SelectedItemToolbar from "@/components/SelectedItemToolbar";
import type { TemplateItemSummary } from "@/lib/api/templates";
import { type CameraSettings, DEFAULT_CAMERA_SETTINGS } from "@/lib/room-canvas/cameraSettings";
import type { ItemSelection } from "@/lib/room-canvas/PlacedItem";

const OVERLAY_BUTTON_CLASS =
  "flex h-8 items-center justify-center rounded-full border border-night-line bg-night-raised/90 px-3 text-sm text-ivory backdrop-blur transition-colors hover:bg-night-raised";

interface RoomEditorProps {
  imageUrl: string;
  onClose: () => void;
}

export default function RoomEditor({ imageUrl, onClose }: RoomEditorProps) {
  const canvasRef = useRef<RoomCanvasHandle>(null);
  const [placementError, setPlacementError] = useState<string | null>(null);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS);
  const [isPerspectiveOpen, setIsPerspectiveOpen] = useState(false);
  const [selection, setSelection] = useState<ItemSelection | null>(null);

  const placeItem = useCallback((item: TemplateItemSummary) => {
    setPlacementError(null);
    canvasRef.current
      ?.addItem(item)
      .catch(() => setPlacementError(`Unable to place ${item.title}. Please try again.`));
  }, []);

  return (
    <div className="fixed inset-0 z-20 bg-night font-sans">
      <div className="absolute inset-y-0 right-80 left-0">
        <RoomCanvas
          ref={canvasRef}
          backgroundUrl={imageUrl}
          cameraSettings={cameraSettings}
          isGridVisible={isPerspectiveOpen}
          onSelectionChange={setSelection}
        />

        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          <div className="flex gap-2">
            <button type="button" onClick={onClose} aria-label="Close room editor" className={`${OVERLAY_BUTTON_CLASS} w-8 px-0 text-lg`}>
              ×
            </button>
            <button
              type="button"
              onClick={() => setIsPerspectiveOpen((isOpen) => !isOpen)}
              aria-expanded={isPerspectiveOpen}
              className={OVERLAY_BUTTON_CLASS}
            >
              {isPerspectiveOpen ? "Done" : "Adjust perspective"}
            </button>
          </div>
          {isPerspectiveOpen && <PerspectivePanel settings={cameraSettings} onChange={setCameraSettings} />}
        </div>

        {selection && (
          <div className="absolute top-4 right-4">
            <SelectedItemToolbar
              selection={selection}
              onScaleChange={(scale) => canvasRef.current?.setSelectedItemScale(scale)}
              onRemove={() => canvasRef.current?.removeSelectedItem()}
            />
          </div>
        )}

        <p className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-night-raised/90 px-3 py-1 text-xs text-mist backdrop-blur">
          Drag to move · Ring or R to rotate · +/− to resize · Delete to remove
        </p>

        {placementError && (
          <p className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-2 text-sm text-white">
            {placementError}
          </p>
        )}
      </div>
      <AestheticSidebar onItemSelect={placeItem} />
    </div>
  );
}
