import Image from "next/image";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import {
  SIDEBAR_CARD_CLASS,
  SIDEBAR_CIRCLE_ACTION_CLASS,
  SIDEBAR_IMAGE_SIZES,
} from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getTemplates, type TemplateSummary } from "@/lib/api/templates";

interface TemplateListProps {
  onSelect: (template: TemplateSummary) => void;
}

export default function TemplateList({ onSelect }: TemplateListProps) {
  const resource = useAsyncResource(getTemplates);

  if (resource.status === "loading") {
    return <SidebarStatusMessage message="Loading aesthetics..." />;
  }

  if (resource.status === "error") {
    return (
      <SidebarStatusMessage message="Unable to load aesthetics. Please try again later." isError />
    );
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
