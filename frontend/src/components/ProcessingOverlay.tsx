interface ProcessingOverlayProps {
  message?: string;
  progress?: number | null;
}

export default function ProcessingOverlay({
  message = "Processing",
  progress = null,
}: ProcessingOverlayProps) {
  const progressLabel =
    progress === null ? null : `${Math.max(0, Math.min(100, Math.round(progress)))}%`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 backdrop-blur-[2px]"
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <p className="font-serif text-3xl text-ivory">{message}</p>
        {progressLabel && <p className="text-sm text-mist">{progressLabel}</p>}
      </div>
    </div>
  );
}
