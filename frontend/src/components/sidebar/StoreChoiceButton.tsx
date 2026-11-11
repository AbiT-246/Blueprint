import Image from "next/image";

interface StoreChoiceButtonProps {
  title: string;
  description: string;
  logoSrc?: string;
  logoAlt?: string;
  onClick: () => void;
}

export default function StoreChoiceButton({
  title,
  description,
  logoSrc,
  logoAlt,
  onClick,
}: StoreChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-night-line/80 bg-transparent px-4 py-3.5 text-left transition-colors hover:border-mist/50"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {logoSrc && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-night-sunken">
            <Image src={logoSrc} alt={logoAlt ?? ""} fill sizes="3rem" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ivory">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-mist">{description}</p>
        </div>
      </div>
      <span className="text-sm text-mist transition-colors group-hover:text-ivory" aria-hidden="true">
        ↗
      </span>
    </button>
  );
}
