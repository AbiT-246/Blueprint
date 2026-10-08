import { DesignStyle, ItemCategory, Prisma, PrismaClient } from '@prisma/client';

interface TemplateSeed {
  style: DesignStyle;
  description: string;
  previewImageFile: string;
}

/** Position values are fractions (0–1) of the canvas width/height, measured at the item's center. */
interface TemplatePlacement {
  positionX: number;
  positionY: number;
  zIndex: number;
}

interface ItemSeed {
  title: string;
  imageFile: string;
  category: ItemCategory;
  description: string;
  templatePlacements: Partial<Record<DesignStyle, TemplatePlacement>>;
}

const AESTHETICS_PUBLIC_PATH = '/Aesthetics';
const ITEMS_PUBLIC_PATH = '/Items';

const Z_INDEX = {
  WALL: 0,
  FLOOR: 1,
  FOREGROUND: 2,
  OVERHEAD: 3,
} as const;

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
    title: 'Bed',
    imageFile: 'Bed.png',
    category: ItemCategory.FURNITURE,
    description: 'Cozy bed with layered bedding.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.28, positionY: 0.72, zIndex: Z_INDEX.FLOOR },
    },
  },
  {
    title: 'Couch',
    imageFile: 'Couch.png',
    category: ItemCategory.FURNITURE,
    description: 'Relaxed lounge couch.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.72, positionY: 0.78, zIndex: Z_INDEX.FOREGROUND },
    },
  },
  {
    title: 'Desk',
    imageFile: 'Desk.png',
    category: ItemCategory.FURNITURE,
    description: 'Compact desk for studying or crafting.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.82, positionY: 0.58, zIndex: Z_INDEX.FLOOR },
    },
  },
  {
    title: 'Guitar',
    imageFile: 'Guitar.png',
    category: ItemCategory.DECORATIVE_OBJECTS,
    description: 'Acoustic guitar that doubles as decor.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.5, positionY: 0.65, zIndex: Z_INDEX.FOREGROUND },
    },
  },
  {
    title: 'Plant',
    imageFile: 'Plant.png',
    category: ItemCategory.PLANTS_AND_NATURE,
    description: 'Leafy potted floor plant.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.08, positionY: 0.75, zIndex: Z_INDEX.FOREGROUND },
    },
  },
  {
    title: 'Hanging Plant',
    imageFile: 'Hanging Plant.png',
    category: ItemCategory.PLANTS_AND_NATURE,
    description: 'Trailing plant in a hanging planter.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.6, positionY: 0.18, zIndex: Z_INDEX.OVERHEAD },
    },
  },
  {
    title: 'Rope Decor',
    imageFile: 'Rope Decor.png',
    category: ItemCategory.WALL_DECOR,
    description: 'Macramé rope wall hanging.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.28, positionY: 0.35, zIndex: Z_INDEX.WALL },
    },
  },
  {
    title: 'Decor',
    imageFile: 'Decor.png',
    category: ItemCategory.WALL_DECOR,
    description: 'Set of woven rattan and seagrass wall baskets.',
    templatePlacements: {
      [DesignStyle.INDIE]: { positionX: 0.75, positionY: 0.35, zIndex: Z_INDEX.WALL },
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

function upsertItem(tx: Prisma.TransactionClient, { title, imageFile, category, description }: ItemSeed) {
  const imageUrl = `${ITEMS_PUBLIC_PATH}/${imageFile}`;
  const data = { title, category, description };

  return tx.item.upsert({
    where: { imageUrl },
    update: data,
    create: { imageUrl, ...data },
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
