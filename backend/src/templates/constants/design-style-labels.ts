import { DesignStyle } from '@prisma/client';

export const DESIGN_STYLE_LABELS: Record<DesignStyle, string> = {
  [DesignStyle.INDIE]: 'Indie',
  [DesignStyle.SCANDINAVIAN]: 'Scandinavian',
  [DesignStyle.MINIMALIST]: 'Minimalist',
  [DesignStyle.INDUSTRIAL]: 'Industrial',
  [DesignStyle.JAPANDI]: 'Japandi',
  [DesignStyle.ECLECTIC]: 'Eclectic',
};
