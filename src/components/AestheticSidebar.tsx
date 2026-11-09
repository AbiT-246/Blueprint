"use client";

import Image from "next/image";
import { useState } from "react";
import EbaySearchPanel from "@/components/EbaySearchPanel";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import TemplateItemList from "@/components/TemplateItemList";
import {
  SIDEBAR_CARD_CLASS,
  SIDEBAR_CARD_LABEL_CLASS,
  SIDEBAR_IMAGE_SIZES,
  SIDEBAR_OPTION_BUTTON_CLASS,
} from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getTemplates, type TemplateItemSummary, type TemplateSummary } from "@/lib/api/templates";

type SidebarMode = "choice" | "templates" | "ebay";

interface AestheticSidebarProps {
  onItemSelect: (item: TemplateItemSummary) => void;
}

export default function AestheticSidebar({ onItemSelect }: AestheticSidebarProps) {
  const [mode, setMode] = useState<SidebarMode>("choice");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummary | null>(null);

  const showBackButton = mode !== "choice";
  const title = getSidebarTitle(mode, selectedTemplate);

  return (
    <aside className="fixed inset-y-0 right-0 z-10 flex w-80 flex-col border-l border-night-line bg-night">
      <header className="flex items-center gap-2 border-b border-night-line px-6 py-5">
        {showBackButton && (
          <BackButton
            onClick={() => {
              if (selectedTemplate) {
                setSelectedTemplate(null);
                return;
              }
              setMode("choice");
            }}
            ariaLabel={selectedTemplate ? "Back to aesthetics" : "Back to options"}
          />
        )}
        <h2 className="font-serif text-2xl text-ivory">{title}</h2>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {mode === "choice" ? (
          <SourceChoicePanel
            onUseTemplates={() => setMode("templates")}
            onShopEbay={() => setMode("ebay")}
          />
        ) : mode === "ebay" ? (
          <EbaySearchPanel />
        ) : selectedTemplate ? (
          <TemplateItemList
            key={selectedTemplate.id}
            templateId={selectedTemplate.id}
            onItemSelect={onItemSelect}
          />
        ) : (
          <TemplateList onSelect={setSelectedTemplate} />
        )}
      </div>
    </aside>
  );
}

function getSidebarTitle(mode: SidebarMode, selectedTemplate: TemplateSummary | null): string {
  if (selectedTemplate) {
    return selectedTemplate.label;
  }

  if (mode === "templates") {
    return "Pick your aesthetic";
  }

  if (mode === "ebay") {
    return "Shop eBay";
  }

  return "Room ready";
}

function SourceChoicePanel({
  onUseTemplates,
  onShopEbay,
}: {
  onUseTemplates: () => void;
  onShopEbay: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-mist">Your room has been scanned!</p>
      <div className="flex flex-col gap-3">
        <button type="button" onClick={onUseTemplates} className={SIDEBAR_OPTION_BUTTON_CLASS}>
          Use templates
        </button>
        <button type="button" onClick={onShopEbay} className={SIDEBAR_OPTION_BUTTON_CLASS}>
          Shop directly from eBay
        </button>
      </div>
    </div>
  );
}

function BackButton({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="-ml-2 rounded-md p-1 text-mist transition-colors hover:bg-night-raised hover:text-ivory"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5">
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
          clipRule="evenodd"
        />
      </svg>
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
    <ul className="flex flex-col gap-4">
      {resource.data.map((template) => (
        <li key={template.id}>
          <TemplateCard template={template} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

interface TemplateCardProps {
  template: TemplateSummary;
  onSelect: (template: TemplateSummary) => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button type="button" onClick={() => onSelect(template)} className={SIDEBAR_CARD_CLASS}>
      {template.previewImageUrl && (
        <div className="relative aspect-video w-full bg-night-raised">
          <Image
            src={template.previewImageUrl}
            alt={`${template.label} room`}
            fill
            sizes={SIDEBAR_IMAGE_SIZES}
            className="object-cover"
          />
        </div>
      )}
      <span className={SIDEBAR_CARD_LABEL_CLASS}>{template.label}</span>
    </button>
  );
}
