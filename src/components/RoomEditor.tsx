"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AestheticSidebar, {
  type StudioChromeState,
} from "@/components/AestheticSidebar";
import PerspectivePanel from "@/components/PerspectivePanel";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import RoomCanvas, { type RoomCanvasHandle } from "@/components/RoomCanvas";
import SelectedItemToolbar from "@/components/SelectedItemToolbar";
import type { StoreProduct } from "@/lib/api/catalog";
import {
  createImageTo3DFromUrl,
  getMeshyGlbProxyUrl,
  waitForMeshyTask,
} from "@/lib/api/meshy";
import { createPlaceableItemFromStoreProduct } from "@/lib/ikea/generatedItem";
import { type CameraSettings, DEFAULT_CAMERA_SETTINGS } from "@/lib/room-canvas/cameraSettings";
import type { ItemSelection } from "@/lib/room-canvas/PlacedItem";
import type { PlaceableItem } from "@/lib/room-canvas/RoomScene";
import { FlowerIcon } from "./landing/icons";

const CANVAS_PILL_CLASS =
  "flex h-9 items-center gap-2 rounded-full border border-night-line/70 bg-night/75 px-3.5 text-sm text-ivory backdrop-blur-md transition-colors hover:bg-night/90";

const STUDIO_INSTRUCTIONS = "Drag to move · Ring or R to rotate · +/− to resize · Delete to remove";

const INITIAL_CHROME_STATE: StudioChromeState = { view: "ready" };

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
  const [chromeState, setChromeState] = useState<StudioChromeState>(INITIAL_CHROME_STATE);
  const [areInstructionsOpen, setAreInstructionsOpen] = useState(true);

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

  const handleProductSelect = useCallback(
    async (product: StoreProduct) => {
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
          createPlaceableItemFromStoreProduct(product, getMeshyGlbProxyUrl(taskId)),
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

  const activeStep = chromeState.view === "ready" ? 2 : 3;

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-night px-4 pt-3 pb-4 font-sans">
      <RoomStudioHeader activeStep={activeStep} onClose={onClose} />

      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-[1.75rem] border border-night-line/60 bg-night-sunken">
          <RoomCanvas
            ref={canvasRef}
            backgroundUrl={imageUrl}
            cameraSettings={cameraSettings}
            isGridVisible={isPerspectiveOpen}
            onSelectionChange={setSelection}
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-3">
              <span className={CANVAS_PILL_CLASS}>
                <span className="size-1.5 rounded-full bg-ivory" aria-hidden="true" />
                Your original room
              </span>

              <div className="pointer-events-auto flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPerspectiveOpen((isOpen) => !isOpen)}
                  aria-expanded={isPerspectiveOpen}
                  className={CANVAS_PILL_CLASS}
                >
                  {isPerspectiveOpen ? "Done" : "Adjust perspective"}
                  {!isPerspectiveOpen && <span aria-hidden="true">↗</span>}
                </button>
                {isPerspectiveOpen && (
                  <PerspectivePanel settings={cameraSettings} onChange={setCameraSettings} />
                )}
                {selection && (
                  <SelectedItemToolbar
                    selection={selection}
                    onScaleChange={(scale) => canvasRef.current?.setSelectedItemScale(scale)}
                    onColorChange={(color) => canvasRef.current?.setSelectedItemColor(color)}
                    onRemove={() => canvasRef.current?.removeSelectedItem()}
                  />
                )}
              </div>
            </div>
          </div>

          {placementError && (
            <p className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full bg-red-600 px-4 py-2 text-sm text-white">
              {placementError}
            </p>
          )}
        </div>

        <AestheticSidebar
          onProductSelect={handleProductSelect}
          onChromeChange={setChromeState}
        />
      </div>

      {isGenerating && <ProcessingOverlay message="Processing" progress={generationProgress} />}
    </div>
  );
}

function RoomStudioHeader({
  activeStep,
  onClose,
}: {
  activeStep: 2 | 3;
  onClose: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-4 px-1">
      <div className="flex min-w-0 items-baseline gap-3">
        <FlowerIcon className="h-7 w-7" />
        <span className="font-serif text-2xl text-ivory">Blueprint</span>
      </div>

      <nav aria-label="Studio progress" className="hidden items-center gap-2 md:flex">
        <StepPill label="Upload" index={1} state="complete" />
        <StepDivider />
        <StepPill
          label="Your room"
          index={2}
          state={activeStep === 2 ? "active" : "complete"}
        />
        <StepDivider />
        <StepPill
          label="Make it yours"
          index={3}
          state={activeStep === 3 ? "active" : "upcoming"}
        />
      </nav>

      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-2 rounded-full border border-night-line/80 bg-transparent px-3.5 py-2 text-sm text-ivory transition-colors hover:border-mist hover:bg-night-raised"
      >
        Close
        <span aria-hidden="true" className="text-base leading-none">
          ×
        </span>
      </button>
    </header>
  );
}

function StepPill({
  label,
  index,
  state,
}: {
  label: string;
  index: number;
  state: "complete" | "active" | "upcoming";
}) {
  const indexLabel = String(index).padStart(2, "0");

  if (state === "active") {
    return (
      <span className="rounded-full bg-[#2a2033] px-3.5 py-1.5 text-sm text-ivory">
        <span className="text-mist">{indexLabel}</span> {label}
      </span>
    );
  }

  if (state === "complete") {
    return (
      <span className="px-1 text-sm text-mist">
        <span aria-hidden="true">✓</span> {label}
      </span>
    );
  }

  return (
    <span className="px-1 text-sm text-mist/55">
      {indexLabel} {label}
    </span>
  );
}

function StepDivider() {
  return <span className="text-mist/40" aria-hidden="true">—</span>;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
