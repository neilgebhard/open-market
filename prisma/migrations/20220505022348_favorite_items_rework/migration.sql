/*
  Warnings:

  - You are about to drop the `FavoritesByUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoritesByUsers" DROP CONSTRAINT "FavoritesByUsers_itemId_fkey";

-- DropForeignKey
ALTER TABLE "FavoritesByUsers" DROP CONSTRAINT "FavoritesByUsers_userId_fkey";

-- DropTable
DROP TABLE "FavoritesByUsers";

-- CreateTable
CREATE TABLE "_FavoriteItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteItems_AB_unique" ON "_FavoriteItems"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteItems_B_index" ON "_FavoriteItems"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteItems" ADD CONSTRAINT "_FavoriteItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteItems" ADD CONSTRAINT "_FavoriteItems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
