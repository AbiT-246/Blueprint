import type { IkeaProduct } from "@/lib/api/ikea";
import type { PlaceableItem } from "@/lib/room-canvas/RoomScene";

/** Neutral real-world size used until IKEA measure parsing exists. */
const DEFAULT_GENERATED_WIDTH_METERS = 1;
const DEFAULT_GENERATED_DEPTH_METERS = 1;
const DEFAULT_GENERATED_HEIGHT_METERS = 1;

export function createPlaceableItemFromIkeaProduct(
  product: IkeaProduct,
  modelUrl: string,
): PlaceableItem {
  return {
    title: product.name,
    modelUrl,
    placement: "FLOOR",
    widthMeters: DEFAULT_GENERATED_WIDTH_METERS,
    depthMeters: DEFAULT_GENERATED_DEPTH_METERS,
    heightMeters: DEFAULT_GENERATED_HEIGHT_METERS,
  };
}
