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
import type { IkeaCategory, IkeaProduct } from "@/lib/api/ikea";
import { getTemplates, type TemplateSummary } from "@/lib/api/templates";

type SidebarMode = "choice" | "templates" | "ikea";

export type StudioChromeView = "ready" | "aesthetics" | "aesthetic-search" | "ikea" | "ikea-category";

export interface StudioChromeState {
  view: StudioChromeView;
  aestheticLabel?: string;
}

interface AestheticSidebarProps {
  onIkeaProductSelect: (product: IkeaProduct) => void;
  onChromeChange?: (state: StudioChromeState) => void;
}

const TEMPLATES_PREVIEW_IMAGE = "/Aesthetics/Indie.webp";

export default function AestheticSidebar({
  onIkeaProductSelect,
  onChromeChange,
}: AestheticSidebarProps) {
  const [mode, setMode] = useState<SidebarMode>("choice");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummary | null>(null);
  const [selectedIkeaCategory, setSelectedIkeaCategory] = useState<IkeaCategory | null>(null);

  useEffect(() => {
    onChromeChange?.(getChromeState(mode, selectedTemplate, selectedIkeaCategory));
  }, [mode, selectedTemplate, selectedIkeaCategory, onChromeChange]);

  const showBackButton = mode !== "choice";
  const title = getSidebarTitle(mode, selectedTemplate, selectedIkeaCategory);
  const subtitle = getSidebarSubtitle(mode, selectedTemplate, selectedIkeaCategory);

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
              if (selectedIkeaCategory) {
                setSelectedIkeaCategory(null);
                return;
              }
              setMode("choice");
            }}
            className={`${SIDEBAR_BACK_PILL_CLASS} mb-5`}
          >
            <span aria-hidden="true">←</span>
            {getBackLabel(selectedTemplate, selectedIkeaCategory)}
          </button>
        )}

        {mode === "choice" ? (
          <SourceChoicePanel
            onUseTemplates={() => setMode("templates")}
            onShopIkea={() => {
              setSelectedIkeaCategory(null);
              setMode("ikea");
            }}
          />
        ) : (
          <>
            <header className="mb-5 flex flex-col gap-2">
              <h2 className="font-serif text-[1.75rem] leading-tight text-ivory">{title}</h2>
              {subtitle && <p className="text-sm leading-relaxed text-mist">{subtitle}</p>}
            </header>

            {mode === "ikea" ? (
              <IkeaBrowsePanel
                selectedCategory={selectedIkeaCategory}
                onSelectCategory={setSelectedIkeaCategory}
                onProductSelect={onIkeaProductSelect}
              />
            ) : selectedTemplate ? (
              <AestheticSearchPanel
                key={selectedTemplate.id}
                aestheticLabel={selectedTemplate.label}
                onProductSelect={onIkeaProductSelect}
              />
            ) : (
              <TemplateList onSelect={setSelectedTemplate} />
            )}
          </>
        )}
      </div>
    </aside>
  );
}

function getChromeState(
  mode: SidebarMode,
  selectedTemplate: TemplateSummary | null,
  selectedIkeaCategory: IkeaCategory | null,
): StudioChromeState {
  if (selectedTemplate) {
    return { view: "aesthetic-search", aestheticLabel: selectedTemplate.label };
  }

  if (selectedIkeaCategory) {
    return { view: "ikea-category" };
  }

  if (mode === "templates") {
    return { view: "aesthetics" };
  }

  if (mode === "ikea") {
    return { view: "ikea" };
  }

  return { view: "ready" };
}

function getSidebarTitle(
  mode: SidebarMode,
  selectedTemplate: TemplateSummary | null,
  selectedIkeaCategory: IkeaCategory | null,
): string {
  if (selectedTemplate) {
    return selectedTemplate.label;
  }

  if (selectedIkeaCategory) {
    return selectedIkeaCategory.name;
  }

  if (mode === "templates") {
    return "Pick your aesthetic";
  }

  if (mode === "ikea") {
    return "Shop IKEA";
  }

  return "Room ready";
}

function getSidebarSubtitle(
  mode: SidebarMode,
  selectedTemplate: TemplateSummary | null,
  selectedIkeaCategory: IkeaCategory | null,
): string | null {
  if (selectedTemplate) {
    return `Search IKEA for pieces that fit the ${selectedTemplate.label} aesthetic.`;
  }

  if (selectedIkeaCategory) {
    return "Browse pieces and add them to your room.";
  }

  if (mode === "templates") {
    return "Find a look that feels like you. Choose a style to explore in your room.";
  }

  if (mode === "ikea") {
    return "Browse IKEA categories for furniture and decor that fits your room.";
  }

  return null;
}

function getBackLabel(
  selectedTemplate: TemplateSummary | null,
  selectedIkeaCategory: IkeaCategory | null,
): string {
  if (selectedTemplate) {
    return "Your aesthetics";
  }

  if (selectedIkeaCategory) {
    return "Shop IKEA";
  }

  return "Room ready";
}

function SourceChoicePanel({
  onUseTemplates,
  onShopIkea,
}: {
  onUseTemplates: () => void;
  onShopIkea: () => void;
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

        <button
          type="button"
          onClick={onUseTemplates}
          className="group flex w-full items-center gap-3 rounded-2xl border border-night-line/60 bg-[#24182c] p-3 text-left transition-colors hover:border-mist/50"
        >
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-night-sunken">
            <Image
              src={TEMPLATES_PREVIEW_IMAGE}
              alt=""
              fill
              sizes="5rem"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ivory">Use templates</p>
            <p className="mt-0.5 text-xs leading-relaxed text-mist">
              Find a look you love, then make it yours.
            </p>
          </div>
          <span className={SIDEBAR_CIRCLE_ACTION_CLASS} aria-hidden="true">
            →
          </span>
        </button>

        <button
          type="button"
          onClick={onShopIkea}
          className="group flex w-full items-start justify-between gap-3 rounded-2xl border border-night-line/80 bg-transparent px-4 py-3.5 text-left transition-colors hover:border-mist/50"
        >
          <div>
            <p className="text-sm font-semibold text-ivory">Shop directly from IKEA</p>
            <p className="mt-0.5 text-xs leading-relaxed text-mist">
              Start with the pieces you love.
            </p>
          </div>
          <span className="mt-0.5 text-sm text-mist transition-colors group-hover:text-ivory" aria-hidden="true">
            ↗
          </span>
        </button>
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
