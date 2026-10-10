import { Item } from '@prisma/client';

export type TemplateItemSummary = Pick<
  Item,
  | 'id'
  | 'title'
  | 'imageUrl'
  | 'modelUrl'
  | 'placement'
  | 'widthMeters'
  | 'depthMeters'
  | 'heightMeters'
>;
