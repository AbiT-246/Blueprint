/**
 * Simplified room box in front of the camera (meters). The camera stands at the origin looking down -Z,
 * the floor is at y = 0 and the back wall is parallel to the image plane.
 */
export interface RoomBounds {
  halfWidth: number;
  backWallZ: number;
  /** Items can't come closer to the camera than this, or they'd fill the view. */
  nearZ: number;
  ceilingY: number;
}

export const DEFAULT_ROOM_BOUNDS: RoomBounds = {
  halfWidth: 3,
  backWallZ: -6,
  nearZ: -1.5,
  ceilingY: 2.6,
};
