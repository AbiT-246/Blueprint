-- Replace dorm-core aesthetics with the current public/Aesthetics set (Indie first).

-- Clear room references to styles/templates that will be removed.
UPDATE "Room"
SET "style" = NULL, "templateId" = NULL
WHERE "style" IS NOT NULL
  AND "style"::text NOT IN (
    'INDIE',
    'SCANDINAVIAN',
    'MINIMALIST',
    'INDUSTRIAL',
    'JAPANDI',
    'ECLECTIC'
  );

DELETE FROM "TemplateItem"
WHERE "templateId" IN (
  SELECT "id" FROM "Template"
  WHERE "style"::text NOT IN (
    'INDIE',
    'SCANDINAVIAN',
    'MINIMALIST',
    'INDUSTRIAL',
    'JAPANDI',
    'ECLECTIC'
  )
);

DELETE FROM "Template"
WHERE "style"::text NOT IN (
  'INDIE',
  'SCANDINAVIAN',
  'MINIMALIST',
  'INDUSTRIAL',
  'JAPANDI',
  'ECLECTIC'
);

CREATE TYPE "DesignStyle_new" AS ENUM (
  'INDIE',
  'SCANDINAVIAN',
  'MINIMALIST',
  'INDUSTRIAL',
  'JAPANDI',
  'ECLECTIC'
);

ALTER TABLE "Room"
  ALTER COLUMN "style" TYPE "DesignStyle_new"
  USING (
    CASE
      WHEN "style"::text IN (
        'INDIE',
        'SCANDINAVIAN',
        'MINIMALIST',
        'INDUSTRIAL',
        'JAPANDI',
        'ECLECTIC'
      ) THEN "style"::text::"DesignStyle_new"
      ELSE NULL
    END
  );

ALTER TABLE "Template"
  ALTER COLUMN "style" TYPE "DesignStyle_new"
  USING ("style"::text::"DesignStyle_new");

ALTER TYPE "DesignStyle" RENAME TO "DesignStyle_old";
ALTER TYPE "DesignStyle_new" RENAME TO "DesignStyle";
DROP TYPE "public"."DesignStyle_old";
