import type { Plane, Vector2, Vector3 } from "three";

/** How an item attaches to the room: which surface it slides along and which positions are valid. */
export interface PlacementStrategy {
  /** Surface the pointer is projected onto while dragging. */
  readonly dragPlane: Plane;
  readonly canRotate: boolean;
  /** Where on screen (normalized device coordinates) a newly added item first appears. */
  readonly spawnScreenPoint: Vector2;
  /**
   * Converts a point on the drag plane into a valid base-center position for an item of the given size.
   * Must not mutate `point`.
   */
  constrain(point: Vector3, itemSize: Vector3): Vector3;
}
