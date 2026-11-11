import {
  STORE_LABELS,
  type ShoppingStore,
  type StoreCategory,
} from "@/lib/api/catalog";
import type { TemplateSummary } from "@/lib/api/templates";

export type SidebarMode = "choice" | "store" | "themes" | "categories";

export type StudioChromeView =
  | "ready"
  | "store"
  | "aesthetics"
  | "aesthetic-search"
  | "categories"
  | "category";

export interface StudioChromeState {
  view: StudioChromeView;
  aestheticLabel?: string;
}

export function getChromeState(
  mode: SidebarMode,
  selectedTemplate: TemplateSummary | null,
  selectedCategory: StoreCategory | null,
): StudioChromeState {
  if (selectedTemplate) {
    return { view: "aesthetic-search", aestheticLabel: selectedTemplate.label };
  }

  if (selectedCategory) {
    return { view: "category" };
  }

  if (mode === "themes") {
    return { view: "aesthetics" };
  }

  if (mode === "categories") {
    return { view: "categories" };
  }

  if (mode === "store") {
    return { view: "store" };
  }

  return { view: "ready" };
}

export function getSidebarTitle(
  mode: SidebarMode,
  store: ShoppingStore | null,
  selectedTemplate: TemplateSummary | null,
  selectedCategory: StoreCategory | null,
): string {
  if (selectedTemplate) {
    return selectedTemplate.label;
  }

  if (selectedCategory) {
    return selectedCategory.name;
  }

  if (mode === "themes") {
    return "Pick your aesthetic";
  }

  if ((mode === "categories" || mode === "store") && store) {
    return `Shop ${STORE_LABELS[store]}`;
  }

  return "Room ready";
}

export function getSidebarSubtitle(
  mode: SidebarMode,
  store: ShoppingStore | null,
  selectedTemplate: TemplateSummary | null,
  selectedCategory: StoreCategory | null,
): string | null {
  const storeLabel = store ? STORE_LABELS[store] : null;

  if (selectedTemplate && storeLabel) {
    return `Search ${storeLabel} for pieces that fit the ${selectedTemplate.label} aesthetic.`;
  }

  if (selectedCategory) {
    return "Browse pieces and add them to your room.";
  }

  if (mode === "themes") {
    return "Find a look that feels like you. Choose a style to explore in your room.";
  }

  if (mode === "categories" && storeLabel) {
    return `Browse ${storeLabel} categories for furniture and decor that fits your room.`;
  }

  if (mode === "store" && storeLabel) {
    return `Shop ${storeLabel} by theme or category.`;
  }

  return null;
}

export function getBackLabel(
  mode: SidebarMode,
  store: ShoppingStore | null,
  selectedTemplate: TemplateSummary | null,
  selectedCategory: StoreCategory | null,
): string {
  if (selectedTemplate) {
    return "Your aesthetics";
  }

  if (selectedCategory && store) {
    return `Shop ${STORE_LABELS[store]}`;
  }

  if ((mode === "themes" || mode === "categories") && store) {
    return `Shop ${STORE_LABELS[store]}`;
  }

  return "Room ready";
}
