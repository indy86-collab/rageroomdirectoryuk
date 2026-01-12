-- AlterTable
ALTER TABLE "listings" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "listings_slug_key" ON "listings"("slug");




