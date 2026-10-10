import type { ItemPlacement } from "@/lib/api/templates";
import type { RoomBounds } from "../roomBounds";
import { CeilingPlacementStrategy } from "./CeilingPlacementStrategy";
import { FloorPlacementStrategy } from "./FloorPlacementStrategy";
import type { PlacementStrategy } from "./PlacementStrategy";
import { WallPlacementStrategy } from "./WallPlacementStrategy";

export function createPlacementStrategies(bounds: RoomBounds): Record<ItemPlacement, PlacementStrategy> {
  return {
    FLOOR: new FloorPlacementStrategy(bounds),
    WALL: new WallPlacementStrategy(bounds),
    CEILING: new CeilingPlacementStrategy(bounds),
  };
}
