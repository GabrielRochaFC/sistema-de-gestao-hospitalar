/*
  Warnings:

  - You are about to drop the column `birthDate` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."patients" DROP COLUMN "birthDate",
ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "healthPlan" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "birthDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT,
    "patientId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_patientId_key" ON "public"."Address"("patientId");

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
