interface IconProps {
  className?: string;
}

const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function FlowerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...STROKE_PROPS}>
      <circle cx="12" cy="5.5" r="3" />
      <circle cx="8" cy="9.5" r="3" />
      <circle cx="16" cy="9.5" r="3" />
      <circle cx="12" cy="13.5" r="3" />
      <circle cx="12" cy="9.5" r="1.2" />
      <path d="M12 16.5V22" />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...STROKE_PROPS}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m20.5 15-4.5-4.5L6 20.5" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...STROKE_PROPS}>
      <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...STROKE_PROPS}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...STROKE_PROPS}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
