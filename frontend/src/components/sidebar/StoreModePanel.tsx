import StoreChoiceButton from "@/components/sidebar/StoreChoiceButton";
import { STORE_LABELS, type ShoppingStore } from "@/lib/api/catalog";

interface StoreModePanelProps {
  store: ShoppingStore;
  onShopByTheme: () => void;
  onShopByCategory: () => void;
}

export default function StoreModePanel({
  store,
  onShopByTheme,
  onShopByCategory,
}: StoreModePanelProps) {
  const storeLabel = STORE_LABELS[store];

  return (
    <section className="flex flex-col gap-3">
      <StoreChoiceButton
        title="Shop by theme"
        description={`Find ${storeLabel} pieces that match an aesthetic.`}
        onClick={onShopByTheme}
      />
      <StoreChoiceButton
        title="Shop by category"
        description={`Browse ${storeLabel} categories for furniture and decor.`}
        onClick={onShopByCategory}
      />
    </section>
  );
}
