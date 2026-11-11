import { MathUtils, PerspectiveCamera } from "three";
import type { CameraSettings } from "./cameraSettings";

const NEAR_CLIP_METERS = 0.05;
const FAR_CLIP_METERS = 100;
/** Apply yaw before pitch so tilting never rolls the horizon. */
const EULER_ORDER = "YXZ";

/** Perspective camera standing at the room origin, looking down -Z, posed to match the photo. */
export function createRoomCamera(settings: CameraSettings): PerspectiveCamera {
  const camera = new PerspectiveCamera(settings.verticalFovDegrees, 1, NEAR_CLIP_METERS, FAR_CLIP_METERS);
  camera.rotation.order = EULER_ORDER;
  applyCameraSettings(camera, settings);
  return camera;
}

export function applyCameraSettings(camera: PerspectiveCamera, settings: CameraSettings): void {
  camera.position.set(0, settings.heightMeters, 0);
  camera.rotation.set(MathUtils.degToRad(settings.pitchDegrees), 0, 0);
  camera.fov = settings.verticalFovDegrees;
  camera.updateProjectionMatrix();
}
