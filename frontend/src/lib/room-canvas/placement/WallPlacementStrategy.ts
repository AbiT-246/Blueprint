import { MathUtils, Plane, Vector2, Vector3 } from "three";
import type { RoomBounds } from "../roomBounds";
import type { PlacementStrategy } from "./PlacementStrategy";

const SPAWN_SCREEN_POINT = new Vector2(0, 0.25);

/** Items hang flush against the back wall, facing the camera, slide across it and tilt around their center. */
export class WallPlacementStrategy implements PlacementStrategy {
  readonly dragPlane: Plane;
  readonly rotationAxis = "z";
  readonly pivot = "center";
  readonly spawnScreenPoint = SPAWN_SCREEN_POINT;

  constructor(private readonly bounds: RoomBounds) {
    this.dragPlane = new Plane(new Vector3(0, 0, 1), -bounds.backWallZ);
  }

  constrain(point: Vector3, itemSize: Vector3): Vector3 {
    const halfWidth = itemSize.x / 2;
    const halfHeight = itemSize.y / 2;
    return new Vector3(
      MathUtils.clamp(point.x, -this.bounds.halfWidth + halfWidth, this.bounds.halfWidth - halfWidth),
      MathUtils.clamp(point.y, halfHeight, this.bounds.ceilingY - halfHeight),
      this.bounds.backWallZ + itemSize.z / 2,
    );
  }
}
