import { MathUtils, Plane, Vector2, Vector3 } from "three";
import type { RoomBounds } from "../roomBounds";
import type { PlacementStrategy } from "./PlacementStrategy";

const SPAWN_SCREEN_POINT = new Vector2(0, 0.7);

/** Items hang from the ceiling (their top touches it), can be rotated, and slide across it. */
export class CeilingPlacementStrategy implements PlacementStrategy {
  readonly dragPlane: Plane;
  readonly rotationAxis = "y";
  readonly pivot = "base";
  readonly spawnScreenPoint = SPAWN_SCREEN_POINT;

  constructor(private readonly bounds: RoomBounds) {
    this.dragPlane = new Plane(new Vector3(0, -1, 0), bounds.ceilingY);
  }

  constrain(point: Vector3, itemSize: Vector3): Vector3 {
    const halfFootprint = Math.max(itemSize.x, itemSize.z) / 2;
    return new Vector3(
      MathUtils.clamp(point.x, -this.bounds.halfWidth + halfFootprint, this.bounds.halfWidth - halfFootprint),
      this.bounds.ceilingY - itemSize.y,
      MathUtils.clamp(point.z, this.bounds.backWallZ + halfFootprint, this.bounds.nearZ),
    );
  }
}
