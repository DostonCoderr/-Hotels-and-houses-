/*
  Warnings:

  - You are about to drop the column `videos` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "videos",
ADD COLUMN     "videoUrl" TEXT;
