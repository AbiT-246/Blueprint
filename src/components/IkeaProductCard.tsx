import {
  SIDEBAR_CARD_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_CLASS,
  SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS,
} from "@/components/sidebarStyles";
import type { IkeaProduct } from "@/lib/api/ikea";

interface IkeaProductCardProps {
  product: IkeaProduct;
}

export default function IkeaProductCard({ product }: IkeaProductCardProps) {
  const priceLabel = formatPrice(product.salesPrice);

  return (
    <article className={SIDEBAR_CARD_CLASS}>
      <div className="relative aspect-square w-full bg-night-raised">
        {product.mainImageUrl ? (
          // IKEA product images are hosted on ikea.com; native img avoids Next remote config.
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
      </div>

      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-ivory">{product.name}</h3>
          {product.typeName && <p className="text-sm text-mist">{product.typeName}</p>}
          {priceLabel && <p className="text-sm text-mist">{priceLabel}</p>}
        </div>

        <div className="flex gap-2">
          <button type="button" disabled className={SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS}>
            Add to room
          </button>
          {product.pipUrl ? (
            <a
              href={product.pipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={SIDEBAR_ITEM_ACTION_BUTTON_CLASS}
            >
              Shop now
            </a>
          ) : (
            <span className={SIDEBAR_ITEM_ACTION_BUTTON_DISABLED_CLASS}>Shop now</span>
          )}
        </div>
      </div>
    </article>
  );
}

function formatPrice(price: IkeaProduct["salesPrice"]): string | null {
  if (price?.numeral === undefined || !price.currencyCode) {
    return null;
  }

  return `${price.currencyCode} ${price.numeral.toFixed(2)}`;
}
