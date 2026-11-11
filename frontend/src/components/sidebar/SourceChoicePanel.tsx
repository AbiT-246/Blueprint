import type { ShoppingStore } from "@/lib/api/catalog";
import StoreChoiceButton from "@/components/sidebar/StoreChoiceButton";

interface SourceChoicePanelProps {
  onShopStore: (store: ShoppingStore) => void;
}

export default function SourceChoicePanel({ onShopStore }: SourceChoicePanelProps) {
  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-grape/30 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-lilac uppercase">
          <span aria-hidden="true">✓</span>
          Scan complete
        </span>
        <h2 className="font-serif text-[2rem] leading-none text-ivory">Room ready</h2>
        <p className="text-sm leading-relaxed text-mist">Your room has been scanned!</p>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-[0.65rem] font-semibold tracking-[0.18em] text-mist uppercase">
          Make it yours
        </h3>

        <StoreChoiceButton
          title="Shop from Amazon"
          description="Browse Amazon furniture and decor for your room."
          logoSrc="/logos/amazon-logo.png"
          logoAlt="Amazon"
          onClick={() => onShopStore("amazon")}
        />
        <StoreChoiceButton
          title="Shop from IKEA"
          description="Start with the pieces you love."
          logoSrc="/logos/ikea-logo.png"
          logoAlt="IKEA"
          onClick={() => onShopStore("ikea")}
        />
      </section>

      <section className="mt-auto flex flex-col gap-2 border-t border-night-line/60 pt-5">
        <p className="text-xs leading-relaxed text-mist">
          Drag to move · Ring or R to rotate · +/− to resize · Delete to remove
        </p>
        <p className="text-xs text-mist/70">Add a piece to start arranging.</p>
      </section>
    </div>
  );
}
