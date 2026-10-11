import type { Plane, Vector2, Vector3 } from "three";

/** World axis an item spins around: vertical for floor and ceiling items, out of the wall for wall items. */
export type RotationAxis = "y" | "z";

/** Where a model's pivot sits: its base center (rests on a surface) or its center (spins in place on a wall). */
export type ModelPivot = "base" | "center";

/** How an item attaches to the room: which surface it slides along and which positions are valid. */
export interface PlacementStrategy {
  /** Surface the pointer is projected onto while dragging. */
  readonly dragPlane: Plane;
  readonly rotationAxis: RotationAxis;
  readonly pivot: ModelPivot;
  /** Where on screen (normalized device coordinates) a newly added item first appears. */
  readonly spawnScreenPoint: Vector2;
  /**
   * Converts a point on the drag plane into a valid pivot position for an item whose rotated bounding box
   * has the given size. Must not mutate `point`.
   */
  constrain(point: Vector3, itemSize: Vector3): Vector3;
}
