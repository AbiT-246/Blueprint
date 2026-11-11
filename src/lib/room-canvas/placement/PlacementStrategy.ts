import type { Plane, Vector2, Vector3 } from "three";

/**
 * World axis an item can spin around.
 * Strategies pick a primary axis (Y for floor/ceiling, Z for walls); flat items may also unlock X.
 */
export type RotationAxis = "x" | "y" | "z";

/** Primary spin axis enforced by a placement surface (never X — tipping is opt-in for flat items). */
export type PrimaryRotationAxis = Exclude<RotationAxis, "x">;

/** Where a model's pivot sits: its base center (rests on a surface) or its center (spins in place on a wall). */
export type ModelPivot = "base" | "center";

/** How an item attaches to the room: which surface it slides along and which positions are valid. */
export interface PlacementStrategy {
  /** Surface the pointer is projected onto while dragging. */
  readonly dragPlane: Plane;
  readonly rotationAxis: PrimaryRotationAxis;
  readonly pivot: ModelPivot;
  /** Where on screen (normalized device coordinates) a newly added item first appears. */
  readonly spawnScreenPoint: Vector2;
  /**
   * Converts a point on the drag plane into a valid pivot position for an item whose rotated bounding box
   * has the given size. Must not mutate `point`.
   */
  constrain(point: Vector3, itemSize: Vector3): Vector3;
}
