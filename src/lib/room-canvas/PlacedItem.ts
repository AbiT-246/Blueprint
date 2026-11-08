import { Box3, type Group, Matrix4, Vector3 } from "three";
import type { PlacementStrategy } from "./placement/PlacementStrategy";

/** A model instance in the room. `root` is a pivot at the model's base center or center (see `strategy.pivot`). */
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

/** Size of the axis-aligned box around the item at its current scale and rotation. */
export function getPlacementSize(item: PlacedItem): Vector3 {
  const halfSize = item.baseSize.clone().multiplyScalar(item.scale / 2);
  const rotation = new Matrix4().makeRotationFromQuaternion(item.root.quaternion);
  return new Box3(halfSize.clone().negate(), halfSize).applyMatrix4(rotation).getSize(new Vector3());
}
