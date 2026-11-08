"use client";

import Image from "next/image";
import { useCallback } from "react";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import { SIDEBAR_CARD_CLASS, SIDEBAR_CARD_LABEL_CLASS, SIDEBAR_IMAGE_SIZES } from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getTemplateItems, type TemplateItemSummary } from "@/lib/api/templates";

interface TemplateItemListProps {
  templateId: string;
  onItemSelect: (item: TemplateItemSummary) => void;
}

/** Render with `key={templateId}` so switching templates resets the loading state. */
export default function TemplateItemList({ templateId, onItemSelect }: TemplateItemListProps) {
  const loadItems = useCallback(() => getTemplateItems(templateId), [templateId]);
  const itemsResource = useAsyncResource(loadItems);

  if (itemsResource.status === "loading") {
    return <SidebarStatusMessage message="Loading items..." />;
  }

  if (itemsResource.status === "error") {
    return <SidebarStatusMessage message="Unable to load items. Please try again later." isError />;
  }

  return (
    <ul className="flex flex-col gap-4">
      {itemsResource.data.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} onSelect={onItemSelect} />
        </li>
      ))}
    </ul>
  );
}

interface ItemCardProps {
  item: TemplateItemSummary;
  onSelect: (item: TemplateItemSummary) => void;
}

function ItemCard({ item, onSelect }: ItemCardProps) {
  return (
    <button type="button" onClick={() => onSelect(item)} className={SIDEBAR_CARD_CLASS}>
      <div className="relative aspect-square w-full bg-night-raised">
        <Image src={item.imageUrl} alt={item.title} fill sizes={SIDEBAR_IMAGE_SIZES} className="object-contain p-4" />
      </div>
      <span className={SIDEBAR_CARD_LABEL_CLASS}>{item.title}</span>
    </button>
  );
}
