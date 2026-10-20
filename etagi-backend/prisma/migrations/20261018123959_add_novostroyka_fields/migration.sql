-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "completionDate" TEXT,
ADD COLUMN     "constructionStatus" TEXT,
ADD COLUMN     "declarations" JSONB,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 5.0,
ADD COLUMN     "reviewsCount" INTEGER DEFAULT 0;
