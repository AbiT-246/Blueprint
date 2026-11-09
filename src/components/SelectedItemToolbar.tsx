"use client";

import { OVERLAY_PANEL_CLASS, OVERLAY_SLIDER_CLASS } from "@/components/overlayStyles";
import { ITEM_SCALE } from "@/lib/room-canvas/itemScale";
import type { ItemSelection } from "@/lib/room-canvas/PlacedItem";

const PERCENT = 100;

interface SelectedItemToolbarProps {
  selection: ItemSelection;
  onScaleChange: (scale: number) => void;
  onColorChange: (color: string) => void;
  onRemove: () => void;
}

export default function SelectedItemToolbar({
  selection,
  onScaleChange,
  onColorChange,
  onRemove,
}: SelectedItemToolbarProps) {
  return (
    <div className={`${OVERLAY_PANEL_CLASS} w-56`}>
      <p className="truncate font-serif text-base">{selection.title}</p>
      <label className="flex flex-col gap-1">
        <span className="flex justify-between text-mist">
          Size
          <span className="tabular-nums">{Math.round(selection.scale * PERCENT)}%</span>
        </span>
        <input
          type="range"
          min={ITEM_SCALE.min}
          max={ITEM_SCALE.max}
          step={ITEM_SCALE.step}
          value={selection.scale}
          onChange={(event) => onScaleChange(Number(event.target.value))}
          className={OVERLAY_SLIDER_CLASS}
        />
      </label>
      <label className="flex items-center justify-between gap-3 text-mist">
        Color
        <input
          type="color"
          value={selection.color}
          onChange={(event) => onColorChange(event.target.value)}
          aria-label={`Color for ${selection.title}`}
          className="h-8 w-12 cursor-pointer rounded border border-night-line bg-transparent p-0.5"
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full border border-red-400/60 px-3 py-1.5 font-medium text-red-300 transition-colors hover:bg-red-400/15"
      >
        Remove
      </button>
    </div>
  );
}
