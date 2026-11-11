/** Approximation of the camera that took the room photo, tuned by the user to line the floor grid up with the image. */
export interface CameraSettings {
  heightMeters: number;
  /** Negative values tilt the camera down toward the floor. */
  pitchDegrees: number;
  verticalFovDegrees: number;
}

export interface SettingRange {
  min: number;
  max: number;
  step: number;
}

/** Typical eye-level phone photo of a room. */
export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  heightMeters: 1.5,
  pitchDegrees: -12,
  verticalFovDegrees: 55,
};

export const CAMERA_SETTING_RANGES: Record<keyof CameraSettings, SettingRange> = {
  heightMeters: { min: 0.5, max: 3, step: 0.05 },
  pitchDegrees: { min: -45, max: 10, step: 0.5 },
  verticalFovDegrees: { min: 30, max: 90, step: 1 },
};
