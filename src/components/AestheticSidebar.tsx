"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AestheticSearchPanel from "@/components/AestheticSearchPanel";
import IkeaBrowsePanel from "@/components/IkeaBrowsePanel";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import {
  SIDEBAR_BACK_PILL_CLASS,
  SIDEBAR_CARD_CLASS,
  SIDEBAR_CIRCLE_ACTION_CLASS,
  SIDEBAR_IMAGE_SIZES,
  SIDEBAR_PANEL_CLASS,
} from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import {
  STORE_LABELS,
  type ShoppingStore,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/api/catalog";
import { getTemplates, type TemplateSummary } from "@/lib/api/templates";

type SidebarMode = "choice" | "store" | "themes" | "categories";

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

interface AestheticSidebarProps {
  onProductSelect: (product: StoreProduct) => void;
  onChromeChange?: (state: StudioChromeState) => void;
}

export default function AestheticSidebar({
  onProductSelect,
  onChromeChange,
}: AestheticSidebarProps) {
  const [mode, setMode] = useState<SidebarMode>("choice");
  const [store, setStore] = useState<ShoppingStore | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(null);

  useEffect(() => {
    onChromeChange?.(getChromeState(mode, selectedTemplate, selectedCategory));
  }, [mode, selectedTemplate, selectedCategory, onChromeChange]);

  const showBackButton = mode !== "choice";
  const title = getSidebarTitle(mode, store, selectedTemplate, selectedCategory);
  const subtitle = getSidebarSubtitle(mode, store, selectedTemplate, selectedCategory);

  return (
    <aside className={SIDEBAR_PANEL_CLASS}>
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
        {showBackButton && (
          <button
            type="button"
            onClick={() => {
              if (selectedTemplate) {
                setSelectedTemplate(null);
                return;
              }
              if (selectedCategory) {
                setSelectedCategory(null);
                return;
              }
              if (mode === "themes" || mode === "categories") {
                setMode("store");
                return;
              }
              setStore(null);
              setMode("choice");
            }}
            className={`${SIDEBAR_BACK_PILL_CLASS} mb-5`}
          >
            <span aria-hidden="true">←</span>
            {getBackLabel(mode, store, selectedTemplate, selectedCategory)}
          </button>
        )}

        {mode === "choice" ? (
          <SourceChoicePanel
            onShopStore={(nextStore) => {
              setStore(nextStore);
              setSelectedTemplate(null);
              setSelectedCategory(null);
              setMode("store");
            }}
          />
        ) : (
          <>
            <header className="mb-5 flex flex-col gap-2">
              <h2 className="font-serif text-[1.75rem] leading-tight text-ivory">{title}</h2>
              {subtitle && <p className="text-sm leading-relaxed text-mist">{subtitle}</p>}
            </header>

            {mode === "store" && store && (
              <StoreModePanel
                store={store}
                onShopByTheme={() => {
                  setSelectedTemplate(null);
                  setMode("themes");
                }}
                onShopByCategory={() => {
                  setSelectedCategory(null);
                  setMode("categories");
                }}
              />
            )}

            {mode === "categories" && store && (
              <IkeaBrowsePanel
                store={store}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onProductSelect={onProductSelect}
              />
            )}

            {mode === "themes" &&
              store &&
              (selectedTemplate ? (
                <AestheticSearchPanel
                  key={`${store}-${selectedTemplate.id}`}
                  store={store}
                  aestheticLabel={selectedTemplate.label}
                  onProductSelect={onProductSelect}
                />
              ) : (
                <TemplateList onSelect={setSelectedTemplate} />
              ))}
          </>
        )}
      </div>
    </aside>
  );
}

function getChromeState(
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

function getSidebarTitle(
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

  if (mode === "categories" && store) {
    return `Shop ${STORE_LABELS[store]}`;
  }

  if (mode === "store" && store) {
    return `Shop ${STORE_LABELS[store]}`;
  }

  return "Room ready";
}

function getSidebarSubtitle(
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

function getBackLabel(
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

function SourceChoicePanel({
  onShopStore,
}: {
  onShopStore: (store: ShoppingStore) => void;
}) {
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

function StoreModePanel({
  store,
  onShopByTheme,
  onShopByCategory,
}: {
  store: ShoppingStore;
  onShopByTheme: () => void;
  onShopByCategory: () => void;
}) {
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

function StoreChoiceButton({
  title,
  description,
  logoSrc,
  logoAlt,
  onClick,
}: {
  title: string;
  description: string;
  logoSrc?: string;
  logoAlt?: string;
  onClick: () => void;
}) {
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

interface TemplateListProps {
  onSelect: (template: TemplateSummary) => void;
}

function TemplateList({ onSelect }: TemplateListProps) {
  const resource = useAsyncResource(getTemplates);

  if (resource.status === "loading") {
    return <SidebarStatusMessage message="Loading aesthetics..." />;
  }

  if (resource.status === "error") {
    return <SidebarStatusMessage message="Unable to load aesthetics. Please try again later." isError />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {resource.data.map((template) => (
          <li key={template.id}>
            <TemplateCard template={template} onSelect={onSelect} />
          </li>
        ))}
      </ul>
      <p className="pt-1 text-center text-xs text-mist/70">A starting point, not a rulebook.</p>
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateSummary;
  onSelect: (template: TemplateSummary) => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template)}
      className={`${SIDEBAR_CARD_CLASS} group flex-row items-center gap-3 p-2.5`}
    >
      {template.previewImageUrl && (
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-night-raised">
          <Image
            src={template.previewImageUrl}
            alt={`${template.label} room`}
            fill
            sizes={SIDEBAR_IMAGE_SIZES}
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1 py-1">
        <span className="block font-serif text-lg leading-tight text-ivory">{template.label}</span>
        {template.description && (
          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-mist">
            {template.description}
          </span>
        )}
      </div>
      <span className={SIDEBAR_CIRCLE_ACTION_CLASS} aria-hidden="true">
        →
      </span>
    </button>
  );
}
