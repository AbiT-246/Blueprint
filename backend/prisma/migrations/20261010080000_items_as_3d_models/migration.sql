-- Existing items are 2D images with no 3D model; remove them (and their placements) before adding required model columns.
DELETE FROM "TemplateItem";
DELETE FROM "RoomItem";
DELETE FROM "Item";

-- CreateEnum
CREATE TYPE "ItemPlacement" AS ENUM ('FLOOR', 'WALL', 'CEILING');

-- DropIndex
DROP INDEX "Item_imageUrl_key";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "depthMeters" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "heightMeters" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "modelUrl" TEXT NOT NULL,
ADD COLUMN     "placement" "ItemPlacement" NOT NULL DEFAULT 'FLOOR',
ADD COLUMN     "widthMeters" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "RoomItem" DROP COLUMN "zIndex",
ADD COLUMN     "positionZ" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "positionY" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "TemplateItem" DROP COLUMN "zIndex",
ADD COLUMN     "positionZ" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "positionY" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Item_modelUrl_key" ON "Item"("modelUrl");
