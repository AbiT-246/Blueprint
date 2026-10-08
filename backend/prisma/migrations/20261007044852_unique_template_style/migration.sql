-- DropIndex
DROP INDEX "Template_style_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Template_style_key" ON "Template"("style");

