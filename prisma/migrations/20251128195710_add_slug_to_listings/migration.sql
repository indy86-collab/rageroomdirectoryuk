-- AlterTable
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "listings_slug_key" ON "listings"("slug");
