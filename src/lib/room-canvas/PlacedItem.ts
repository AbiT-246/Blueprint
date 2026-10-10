import type { Group, Vector3 } from "three";
import type { PlacementStrategy } from "./placement/PlacementStrategy";

/** A model instance in the room. `root` is a pivot whose origin is the model's base center. */
export interface PlacedItem {
  title: string;
  root: Group;
  strategy: PlacementStrategy;
  /** Unrotated bounding-box size in meters at scale 1. */
  baseSize: Vector3;
  scale: number;
}

/** What the UI needs to know about the current selection. */
export interface ItemSelection {
  title: string;
  scale: number;
}

export function getScaledSize(item: PlacedItem): Vector3 {
  return item.baseSize.clone().multiplyScalar(item.scale);
}
