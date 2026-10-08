"use client";

import Image from "next/image";
import { useCallback } from "react";
import SidebarStatusMessage from "@/components/SidebarStatusMessage";
import { SIDEBAR_CARD_CLASS, SIDEBAR_CARD_LABEL_CLASS, SIDEBAR_IMAGE_SIZES } from "@/components/sidebarStyles";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getTemplateItems, type TemplateItemSummary } from "@/lib/api/templates";

/** Render with `key={templateId}` so switching templates resets the loading state. */
export default function TemplateItemList({ templateId }: { templateId: string }) {
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
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}

function ItemCard({ item }: { item: TemplateItemSummary }) {
  return (
    <button type="button" className={SIDEBAR_CARD_CLASS}>
      <div className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-900">
        <Image src={item.imageUrl} alt={item.title} fill sizes={SIDEBAR_IMAGE_SIZES} className="object-contain p-4" />
      </div>
      <span className={SIDEBAR_CARD_LABEL_CLASS}>{item.title}</span>
    </button>
  );
}
