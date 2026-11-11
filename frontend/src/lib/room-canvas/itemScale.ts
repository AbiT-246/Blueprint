import { MathUtils } from "three";

/** Uniform size multiplier on top of an item's real-world dimensions. */
export const ITEM_SCALE = {
  min: 0.5,
  max: 2,
  default: 1,
  /** Slider granularity. */
  step: 0.05,
  /** Change per +/- key press. */
  keyStep: 0.1,
} as const;

export function clampItemScale(scale: number): number {
  return MathUtils.clamp(scale, ITEM_SCALE.min, ITEM_SCALE.max);
}
