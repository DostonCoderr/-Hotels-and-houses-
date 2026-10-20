-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "cls" TEXT,
ADD COLUMN     "genplan" JSONB,
ADD COLUMN     "imo" TEXT,
ADD COLUMN     "metro" TEXT,
ADD COLUMN     "metroDist" TEXT,
ADD COLUMN     "metroTime" TEXT,
ADD COLUMN     "progressPhotos" JSONB,
ADD COLUMN     "videos" JSONB,
ADD COLUMN     "wall" TEXT;
