"use client";

import { OVERLAY_PANEL_CLASS } from "@/components/overlayStyles";
import { ITEM_SCALE } from "@/lib/room-canvas/itemScale";
import type { ItemSelection } from "@/lib/room-canvas/PlacedItem";

const PERCENT = 100;

interface SelectedItemToolbarProps {
  selection: ItemSelection;
  onScaleChange: (scale: number) => void;
  onRemove: () => void;
}

export default function SelectedItemToolbar({ selection, onScaleChange, onRemove }: SelectedItemToolbarProps) {
  return (
    <div className={`${OVERLAY_PANEL_CLASS} w-56`}>
      <p className="truncate font-medium text-black dark:text-zinc-50">{selection.title}</p>
      <label className="flex flex-col gap-1">
        <span className="flex justify-between text-zinc-600 dark:text-zinc-400">
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
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full bg-red-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-red-700"
      >
        Remove
      </button>
    </div>
  );
}
