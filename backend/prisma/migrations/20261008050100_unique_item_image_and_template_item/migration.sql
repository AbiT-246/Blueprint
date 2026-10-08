-- CreateIndex
CREATE UNIQUE INDEX "Item_imageUrl_key" ON "Item"("imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateItem_templateId_itemId_key" ON "TemplateItem"("templateId", "itemId");
