import {
  SIDEBAR_CARD_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_PRIMARY_CLASS,
} from "@/components/sidebarStyles";
import type { StoreProduct } from "@/lib/api/catalog";

interface StoreProductCardProps {
  product: StoreProduct;
  onSelect: (product: StoreProduct) => void;
}

export default function StoreProductCard({ product, onSelect }: StoreProductCardProps) {
  const priceLabel = formatPrice(product.salesPrice);
  const canGenerate = Boolean(product.mainImageUrl);

  return (
    <article className={`${SIDEBAR_CARD_CLASS} bg-night-sunken/40`}>
      <button
        type="button"
        onClick={() => onSelect(product)}
        disabled={!canGenerate}
        aria-label={`Generate 3D model for ${product.name}`}
        className="relative aspect-square w-full bg-ivory/95 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {product.mainImageUrl ? (
          // Product images are hosted remotely; native img avoids Next remote config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-mist">
            No image available
          </div>
        )}
      </button>

      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium tracking-wide text-ivory uppercase">{product.name}</h3>
          {product.typeName && <p className="text-sm text-mist">{product.typeName}</p>}
          {priceLabel && <p className="text-sm text-mist">{priceLabel}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSelect(product)}
            disabled={!canGenerate}
            className={
              canGenerate
                ? SIDEBAR_ITEM_ACTION_BUTTON_PRIMARY_CLASS
                : SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS
            }
          >
            + Add to room
          </button>
          {product.pipUrl ? (
            <a
              href={product.pipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={SIDEBAR_ITEM_ACTION_BUTTON_CLASS}
            >
              Shop now ↗
            </a>
          ) : (
            <span className={SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS}>Shop now ↗</span>
          )}
        </div>
      </div>
    </article>
  );
}

function formatPrice(price: StoreProduct["salesPrice"]): string | null {
  if (price?.numeral === undefined || !price.currencyCode) {
    return null;
  }

  return `${price.currencyCode} ${price.numeral.toFixed(2)}`;
}
