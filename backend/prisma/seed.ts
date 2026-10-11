import { DesignStyle, ItemCategory, ItemPlacement, Prisma, PrismaClient } from '@prisma/client';

interface TemplateSeed {
  style: DesignStyle;
  description: string;
  previewImageFile: string;
}

/**
 * Position in room space (meters, Y up, camera looking down -Z). Floor items use their base center and omit
 * positionY; wall items use their center and set positionY to its height. The back wall is at z = -6.
 * Rotation is in degrees around Y for floor items and around Z (out of the wall) for wall items.
 */
interface TemplatePlacement {
  positionX: number;
  positionY?: number;
  positionZ: number;
  rotation: number;
}

type ItemDimensions = Pick<Prisma.ItemCreateInput, 'widthMeters' | 'depthMeters' | 'heightMeters'>;

interface ItemSeed {
  title: string;
  thumbnailFile: string;
  modelFile: string;
  category: ItemCategory;
  placement: ItemPlacement;
  dimensions: ItemDimensions;
  description: string;
  templatePlacements: Partial<Record<DesignStyle, TemplatePlacement>>;
}

const AESTHETICS_PUBLIC_PATH = '/Aesthetics';
const ITEMS_PUBLIC_PATH = '/Items';
const MODELS_PUBLIC_PATH = '/Models';

const TEMPLATE_SEEDS: TemplateSeed[] = [
  {
    style: DesignStyle.INDIE,
    description:
      'Bright, oversaturated colors with cow prints, rainbow daisies, mushrooms and smiley faces. Wall collages, painted CDs, vinyls, posters, tapestries and hanging vines.',
    previewImageFile: 'Indie.webp',
  },
  {
    style: DesignStyle.COTTAGECORE,
    description:
      'Simple living in harmony with nature. Floral bedding, botanical prints, candles, dried flowers, vintage mirrors and plenty of potted plants and greenery.',
    previewImageFile: 'cottagecore.webp',
  },
  {
    style: DesignStyle.SOFT_GIRL,
    description:
      'Cutesy and feminine with pink and yellow tones. Strawberry-pattern bedding, string lights, flowers, heart-shaped mirrors and sweet desk accessories.',
    previewImageFile: 'softgirl.webp',
  },
  {
    style: DesignStyle.GRUNGE,
    description:
      'Dark and edgy, rooted in 90s alternative rock. Music posters, wall collages, vinyl records, record players, neon accents, skull decor and electric guitars.',
    previewImageFile: 'grunge.webp',
  },
  {
    style: DesignStyle.E_GIRL,
    description:
      'Alt, electronic and geeky with a gaming focus. Anime wall art, LED strip lighting, neon signs, halo desk lamps and streaming accessories.',
    previewImageFile: 'egirl.jpg',
  },
  {
    style: DesignStyle.GALAXY,
    description:
      'Spacecore centered on astronomy, stars and planets. Galaxy lamps, constellation globes, astronaut figurines, half-moon planters and a feature telescope.',
    previewImageFile: 'galaxy.webp',
  },
  {
    style: DesignStyle.ANIME,
    description:
      'Fiction and fantasy inspired by Japanese animation. Anime bedside lamps, character figurines, gaming collections and favorite-series wall art.',
    previewImageFile: 'anime.webp',
  },
  {
    style: DesignStyle.BOHO,
    description:
      'Eclectic and individual, mixing global patterns and natural materials. Macramé, layered cushions, candles, boho vases and mirrors, and lots of indoor plants.',
    previewImageFile: 'boho.webp',
  },
  {
    style: DesignStyle.DARK_ACADEMIA,
    description:
      'Literature, mystery and classical arts. Antique globes, old desk lamps, ink pots, sculptures, stacks of old books, candle holders and dried plants in glass flasks.',
    previewImageFile: 'darkacademia.webp',
  },
];

const ITEM_SEEDS: ItemSeed[] = [
  {
    title: 'Green Boho Bed',
    thumbnailFile: 'indie-green-bed.png',
    modelFile: 'indie-green-bed.glb',
    category: ItemCategory.FURNITURE,
    placement: ItemPlacement.FLOOR,
    dimensions: { widthMeters: 1.7, depthMeters: 1.79, heightMeters: 1.05 },
    description: 'Boho bed with a green quilted cover and woven headboard.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0, positionZ: -3.5, rotation: 0 },
    },
  },
  {
    title: 'Rattan Sofa',
    thumbnailFile: 'indie-couch.png',
    modelFile: 'indie-couch.glb',
    category: ItemCategory.FURNITURE,
    placement: ItemPlacement.FLOOR,
    dimensions: { widthMeters: 1.9, depthMeters: 0.95, heightMeters: 0.88 },
    description: 'Dark green sofa with cane-panel arms, boho cushions and a fringed throw.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: -1.9, positionZ: -5, rotation: 0 },
    },
  },
  {
    title: 'Rattan Desk & Chair',
    thumbnailFile: 'indie-desk.png',
    modelFile: 'indie-desk.glb',
    category: ItemCategory.FURNITURE,
    placement: ItemPlacement.FLOOR,
    dimensions: { widthMeters: 1.31, depthMeters: 1.14, heightMeters: 0.77 },
    description: 'Light wood writing desk with cane drawer fronts and a matching cane-back chair.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 2.1, positionZ: -5, rotation: 0 },
    },
  },
  {
    title: 'Monstera Plant',
    thumbnailFile: 'indie-plant.png',
    modelFile: 'indie-plant.glb',
    category: ItemCategory.PLANTS_AND_NATURE,
    placement: ItemPlacement.FLOOR,
    dimensions: { widthMeters: 0.99, depthMeters: 0.96, heightMeters: 1.1 },
    description: 'Monstera in a woven seagrass basket on a wooden plant stand.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 2.4, positionZ: -2.8, rotation: 0 },
    },
  },
  {
    title: 'Boho Arch Print',
    thumbnailFile: 'indie-painting.png',
    modelFile: 'indie-painting.glb',
    category: ItemCategory.WALL_DECOR,
    placement: ItemPlacement.WALL,
    dimensions: { widthMeters: 0.6, depthMeters: 0.035, heightMeters: 0.6 },
    description: 'Abstract boho print of a terracotta vase, leafy stem and rainbow arch in a light wood frame.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 2.1, positionY: 1.5, positionZ: -5.98, rotation: 0 },
    },
  },
  {
    title: 'Woven Wall Plates',
    thumbnailFile: 'indie-decor.png',
    modelFile: 'indie-decor.glb',
    category: ItemCategory.WALL_DECOR,
    placement: ItemPlacement.WALL,
    dimensions: { widthMeters: 1, depthMeters: 0.05, heightMeters: 0.66 },
    description: 'Cluster of woven rattan, seagrass and carved white wall plates in natural tones.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: -1.9, positionY: 1.55, positionZ: -5.975, rotation: 0 },
    },
  },
];

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    await seedTemplates();
    console.log(`Seeded ${TEMPLATE_SEEDS.length} templates.`);

    const templateItemCount = await seedItems();
    console.log(`Seeded ${ITEM_SEEDS.length} items and ${templateItemCount} template items.`);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedTemplates(): Promise<void> {
  try {
    await prisma.$transaction(
      TEMPLATE_SEEDS.map(({ style, description, previewImageFile }) => {
        const data = {
          description,
          previewImageUrl: `${AESTHETICS_PUBLIC_PATH}/${previewImageFile}`,
        };

        return prisma.template.upsert({
          where: { style },
          update: data,
          create: { style, ...data },
        });
      }),
    );
  } catch (error) {
    throw new Error('Failed to seed templates.', { cause: error });
  }
}

async function seedItems(): Promise<number> {
  try {
    return await prisma.$transaction(async (tx) => {
      const items = await Promise.all(ITEM_SEEDS.map((seed) => upsertItem(tx, seed)));
      const templateIdByStyle = await findTemplateIdsByStyle(tx);

      const templateItemUpserts = ITEM_SEEDS.flatMap((seed, index) =>
        Object.entries(seed.templatePlacements).map(([style, placement]) =>
          upsertTemplateItem(tx, getTemplateId(templateIdByStyle, style as DesignStyle), items[index].id, placement),
        ),
      );

      await Promise.all(templateItemUpserts);
      return templateItemUpserts.length;
    });
  } catch (error) {
    throw new Error('Failed to seed items.', { cause: error });
  }
}

function upsertItem(tx: Prisma.TransactionClient, seed: ItemSeed) {
  const modelUrl = `${MODELS_PUBLIC_PATH}/${seed.modelFile}`;
  const data = {
    title: seed.title,
    imageUrl: `${ITEMS_PUBLIC_PATH}/${seed.thumbnailFile}`,
    category: seed.category,
    placement: seed.placement,
    description: seed.description,
    ...seed.dimensions,
  };

  return tx.item.upsert({
    where: { modelUrl },
    update: data,
    create: { modelUrl, ...data },
    select: { id: true },
  });
}

async function findTemplateIdsByStyle(tx: Prisma.TransactionClient): Promise<Map<DesignStyle, string>> {
  const templates = await tx.template.findMany({ select: { id: true, style: true } });
  return new Map(templates.map(({ id, style }) => [style, id]));
}

function getTemplateId(templateIdByStyle: Map<DesignStyle, string>, style: DesignStyle): string {
  const templateId = templateIdByStyle.get(style);
  if (!templateId) {
    throw new Error(`No template found for style ${style}.`);
  }
  return templateId;
}

function upsertTemplateItem(
  tx: Prisma.TransactionClient,
  templateId: string,
  itemId: string,
  placement: TemplatePlacement,
) {
  return tx.templateItem.upsert({
    where: { templateId_itemId: { templateId, itemId } },
    update: placement,
    create: { templateId, itemId, ...placement },
  });
}

main().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});
