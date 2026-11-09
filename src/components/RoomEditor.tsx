"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AestheticSidebar from "@/components/AestheticSidebar";
import PerspectivePanel from "@/components/PerspectivePanel";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import RoomCanvas, { type RoomCanvasHandle } from "@/components/RoomCanvas";
import SelectedItemToolbar from "@/components/SelectedItemToolbar";
import type { IkeaProduct } from "@/lib/api/ikea";
import {
  createImageTo3DFromUrl,
  getMeshyGlbProxyUrl,
  waitForMeshyTask,
} from "@/lib/api/meshy";
import { createPlaceableItemFromIkeaProduct } from "@/lib/ikea/generatedItem";
import { type CameraSettings, DEFAULT_CAMERA_SETTINGS } from "@/lib/room-canvas/cameraSettings";
import type { ItemSelection } from "@/lib/room-canvas/PlacedItem";
import type { PlaceableItem } from "@/lib/room-canvas/RoomScene";

const OVERLAY_BUTTON_CLASS =
  "flex h-8 items-center justify-center rounded-full border border-night-line bg-night-raised/90 px-3 text-sm text-ivory backdrop-blur transition-colors hover:bg-night-raised";

interface RoomEditorProps {
  imageUrl: string;
  onClose: () => void;
}

export default function RoomEditor({ imageUrl, onClose }: RoomEditorProps) {
  const canvasRef = useRef<RoomCanvasHandle>(null);
  const generationAbortRef = useRef<AbortController | null>(null);
  const [placementError, setPlacementError] = useState<string | null>(null);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS);
  const [isPerspectiveOpen, setIsPerspectiveOpen] = useState(false);
  const [selection, setSelection] = useState<ItemSelection | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      generationAbortRef.current?.abort();
    };
  }, []);

  const placeItem = useCallback((item: PlaceableItem) => {
    setPlacementError(null);
    canvasRef.current
      ?.addItem(item)
      .catch(() => setPlacementError(`Unable to place ${item.title}. Please try again.`));
  }, []);

  const handleIkeaProductSelect = useCallback(
    async (product: IkeaProduct) => {
      if (isGenerating) {
        return;
      }

      const imageUrlForGeneration = product.mainImageUrl;
      if (!imageUrlForGeneration) {
        setPlacementError(`No image available for ${product.name}.`);
        return;
      }

      generationAbortRef.current?.abort();
      const abortController = new AbortController();
      generationAbortRef.current = abortController;

      setPlacementError(null);
      setIsGenerating(true);
      setGenerationProgress(0);

      try {
        const { result: taskId } = await createImageTo3DFromUrl(imageUrlForGeneration);
        const task = await waitForMeshyTask(taskId, {
          signal: abortController.signal,
          onProgress: setGenerationProgress,
        });

        if (!task.model_urls?.glb) {
          throw new Error("Meshy did not return a GLB model URL.");
        }

        placeItem(
          createPlaceableItemFromIkeaProduct(product, getMeshyGlbProxyUrl(taskId)),
        );
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        setPlacementError(
          error instanceof Error
            ? error.message
            : `Unable to generate a 3D model for ${product.name}.`,
        );
      } finally {
        if (generationAbortRef.current === abortController) {
          generationAbortRef.current = null;
          setIsGenerating(false);
          setGenerationProgress(null);
        }
      }
    },
    [isGenerating, placeItem],
  );

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
              onColorChange={(color) => canvasRef.current?.setSelectedItemColor(color)}
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
      <AestheticSidebar onIkeaProductSelect={handleIkeaProductSelect} />

      {isGenerating && <ProcessingOverlay message="Processing" progress={generationProgress} />}
    </div>
  );
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
