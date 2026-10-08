-- AlterEnum
BEGIN;
CREATE TYPE "DesignStyle_new" AS ENUM ('INDIE', 'COTTAGECORE', 'SOFT_GIRL', 'GRUNGE', 'WITCHCORE', 'E_GIRL', 'GALAXY', 'ART_HOE', 'ANIME', 'BOHO', 'KAWAII', 'DARK_ACADEMIA', 'VINTAGE', 'DORM');
ALTER TABLE "Room" ALTER COLUMN "style" TYPE "DesignStyle_new" USING ("style"::text::"DesignStyle_new");
ALTER TABLE "Template" ALTER COLUMN "style" TYPE "DesignStyle_new" USING ("style"::text::"DesignStyle_new");
ALTER TYPE "DesignStyle" RENAME TO "DesignStyle_old";
ALTER TYPE "DesignStyle_new" RENAME TO "DesignStyle";
DROP TYPE "public"."DesignStyle_old";
COMMIT;

