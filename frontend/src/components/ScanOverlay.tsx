export default function ScanOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-night/25" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-1/4 translate-x-[150%] motion-safe:animate-scan">
        <div className="absolute inset-y-0 inset-x-1/4 bg-linear-to-r from-transparent via-lilac/60 to-transparent blur-md" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/90 shadow-[0_0_12px_3px_rgba(184,150,220,0.8)] blur-[0.5px]" />
      </div>
    </div>
  );
}
