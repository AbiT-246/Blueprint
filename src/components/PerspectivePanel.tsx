"use client";

import { OVERLAY_PANEL_CLASS, OVERLAY_SLIDER_CLASS } from "@/components/overlayStyles";
import {
  CAMERA_SETTING_RANGES,
  type CameraSettings,
  DEFAULT_CAMERA_SETTINGS,
} from "@/lib/room-canvas/cameraSettings";

interface SettingField {
  key: keyof CameraSettings;
  label: string;
  unit: string;
}

const SETTING_FIELDS: SettingField[] = [
  { key: "heightMeters", label: "Camera height", unit: "m" },
  { key: "pitchDegrees", label: "Tilt", unit: "°" },
  { key: "verticalFovDegrees", label: "Field of view", unit: "°" },
];

interface PerspectivePanelProps {
  settings: CameraSettings;
  onChange: (settings: CameraSettings) => void;
}

/** Sliders for lining the 3D floor grid up with the floor in the room photo. */
export default function PerspectivePanel({ settings, onChange }: PerspectivePanelProps) {
  return (
    <div className={`${OVERLAY_PANEL_CLASS} w-64`}>
      <p className="text-mist">Line the purple grid up with the floor in your photo.</p>
      {SETTING_FIELDS.map(({ key, label, unit }) => (
        <label key={key} className="flex flex-col gap-1">
          <span className="flex justify-between font-medium">
            {label}
            <span className="text-mist tabular-nums">
              {settings[key]}
              {unit}
            </span>
          </span>
          <input
            type="range"
            {...CAMERA_SETTING_RANGES[key]}
            value={settings[key]}
            onChange={(event) => onChange({ ...settings, [key]: Number(event.target.value) })}
            className={OVERLAY_SLIDER_CLASS}
          />
        </label>
      ))}
      <button
        type="button"
        onClick={() => onChange(DEFAULT_CAMERA_SETTINGS)}
        className="self-start text-mist underline underline-offset-4 transition-colors hover:text-ivory"
      >
        Reset
      </button>
    </div>
  );
}
