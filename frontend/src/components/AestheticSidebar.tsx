"use client";

import { useEffect, useState } from "react";
import AestheticSearchPanel from "@/components/AestheticSearchPanel";
import StoreBrowsePanel from "@/components/StoreBrowsePanel";
import SourceChoicePanel from "@/components/sidebar/SourceChoicePanel";
import StoreModePanel from "@/components/sidebar/StoreModePanel";
import TemplateList from "@/components/sidebar/TemplateList";
import {
  getBackLabel,
  getChromeState,
  getSidebarSubtitle,
  getSidebarTitle,
  type SidebarMode,
  type StudioChromeState,
} from "@/components/sidebar/sidebarChrome";
import { SIDEBAR_BACK_PILL_CLASS, SIDEBAR_PANEL_CLASS } from "@/components/sidebarStyles";
import type { ShoppingStore, StoreCategory, StoreProduct } from "@/lib/api/catalog";
import type { TemplateSummary } from "@/lib/api/templates";

export type { StudioChromeState, StudioChromeView } from "@/components/sidebar/sidebarChrome";

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
              <StoreBrowsePanel
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
