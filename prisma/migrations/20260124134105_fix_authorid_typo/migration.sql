/*
  Warnings:

  - You are about to drop the column `authodId` on the `comments` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "comments_authodId_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authodId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");
