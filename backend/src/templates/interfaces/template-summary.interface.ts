import { Template } from '@prisma/client';

export type TemplateSummaryFields = Pick<
  Template,
  'id' | 'style' | 'description' | 'previewImageUrl'
>;

export interface TemplateSummary extends TemplateSummaryFields {
  label: string;
}
