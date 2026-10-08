"use client";

import Image from "next/image";
import { useState } from "react";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import TemplateItemList from "@/components/TemplateItemList";
import { SIDEBAR_CARD_CLASS, SIDEBAR_CARD_LABEL_CLASS, SIDEBAR_IMAGE_SIZES } from "@/components/sidebarStyles";
import { type AsyncResource, useAsyncResource } from "@/hooks/useAsyncResource";
import { getTemplates, type TemplateSummary } from "@/lib/api/templates";

export default function AestheticSidebar() {
  const templatesResource = useAsyncResource(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummary | null>(null);

  return (
    <aside className="fixed inset-y-0 right-0 z-10 flex w-80 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center gap-2 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
        {selectedTemplate && <BackButton onClick={() => setSelectedTemplate(null)} />}
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
          {selectedTemplate ? selectedTemplate.label : "Pick your aesthetic"}
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {selectedTemplate ? (
          <TemplateItemList key={selectedTemplate.id} templateId={selectedTemplate.id} />
        ) : (
          <TemplateList resource={templatesResource} onSelect={setSelectedTemplate} />
        )}
      </div>
    </aside>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to aesthetics"
      className="-ml-2 rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
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
  resource: AsyncResource<TemplateSummary[]>;
  onSelect: (template: TemplateSummary) => void;
}

function TemplateList({ resource, onSelect }: TemplateListProps) {
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
    <button
      type="button"
      onClick={() => onSelect(template)}
      className={SIDEBAR_CARD_CLASS}
    >
      {template.previewImageUrl && (
        <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900">
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
