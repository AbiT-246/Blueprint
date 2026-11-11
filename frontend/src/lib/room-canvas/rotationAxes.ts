import type { Vector3 } from "three";
import type { PrimaryRotationAxis, RotationAxis } from "./placement/PlacementStrategy";

/** Thinnest edge / longest edge at or below this ratio counts as a flat item (rug, painting, etc.). */
const FLAT_ASPECT_RATIO = 0.2;

/**
 * Flat items get an extra X ring so they can tip/flip, not only spin in their placement plane.
 * Furniture and other bulky items keep the single primary axis.
 */
export function resolveRotationAxes(
  primaryAxis: PrimaryRotationAxis,
  size: Vector3,
): readonly RotationAxis[] {
  if (!isFlatItemSize(size)) {
    return [primaryAxis];
  }

  return [primaryAxis, "x"];
}

export function isFlatItemSize(size: Vector3): boolean {
  const thinnest = Math.min(size.x, size.y, size.z);
  const longest = Math.max(size.x, size.y, size.z);
  return longest > 0 && thinnest / longest <= FLAT_ASPECT_RATIO;
}
