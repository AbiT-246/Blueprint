import { MathUtils, Plane, Vector2, Vector3 } from "three";
import type { RoomBounds } from "../roomBounds";
import type { PlacementStrategy } from "./PlacementStrategy";

const SPAWN_SCREEN_POINT = new Vector2(0, -0.35);

/** Items stand on the floor (y = 0), can be rotated, and stay between the camera and the back wall. */
export class FloorPlacementStrategy implements PlacementStrategy {
  readonly dragPlane = new Plane(new Vector3(0, 1, 0), 0);
  readonly canRotate = true;
  readonly spawnScreenPoint = SPAWN_SCREEN_POINT;

  constructor(private readonly bounds: RoomBounds) {}

  constrain(point: Vector3, itemSize: Vector3): Vector3 {
    const halfFootprint = Math.max(itemSize.x, itemSize.z) / 2;
    return new Vector3(
      MathUtils.clamp(point.x, -this.bounds.halfWidth + halfFootprint, this.bounds.halfWidth - halfFootprint),
      0,
      MathUtils.clamp(point.z, this.bounds.backWallZ + halfFootprint, this.bounds.nearZ),
    );
  }
}
