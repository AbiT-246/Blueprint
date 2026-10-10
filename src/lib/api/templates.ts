import { getJson } from "./client";

export interface TemplateSummary {
  id: string;
  style: string;
  label: string;
  description: string | null;
  previewImageUrl: string | null;
}

export type ItemPlacement = "FLOOR" | "WALL" | "CEILING";

export interface TemplateItemSummary {
  id: string;
  title: string;
  imageUrl: string;
  modelUrl: string;
  placement: ItemPlacement;
  widthMeters: number;
  depthMeters: number;
  heightMeters: number;
}

export function getTemplates(): Promise<TemplateSummary[]> {
  return getJson<TemplateSummary[]>("/templates");
}

export function getTemplateItems(templateId: string): Promise<TemplateItemSummary[]> {
  return getJson<TemplateItemSummary[]>(`/templates/${encodeURIComponent(templateId)}/items`);
}
