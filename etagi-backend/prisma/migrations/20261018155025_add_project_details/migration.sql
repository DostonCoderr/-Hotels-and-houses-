-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "companyDesc" TEXT,
ADD COLUMN     "companyExp" INTEGER,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "foundation" TEXT,
ADD COLUMN     "kitchenArea" DOUBLE PRECISION,
ADD COLUMN     "packages" JSONB,
ADD COLUMN     "roof" TEXT,
ADD COLUMN     "terassa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wallHeight" DOUBLE PRECISION;
