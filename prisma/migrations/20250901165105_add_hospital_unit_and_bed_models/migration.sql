/*
  Warnings:

  - Added the required column `unitId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."BedStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."UnitType" AS ENUM ('HOSPITAL', 'CLINIC', 'LABORATORY', 'HOME_CARE');

-- AlterTable
ALTER TABLE "public"."appointments" ADD COLUMN     "unitId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."hospital_units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."UnitType" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospital_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."beds" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "public"."BedStatus" NOT NULL DEFAULT 'AVAILABLE',
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_HospitalUnitToProfessional" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HospitalUnitToProfessional_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "beds_code_key" ON "public"."beds"("code");

-- CreateIndex
CREATE INDEX "_HospitalUnitToProfessional_B_index" ON "public"."_HospitalUnitToProfessional"("B");

-- AddForeignKey
ALTER TABLE "public"."appointments" ADD CONSTRAINT "appointments_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."hospital_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."beds" ADD CONSTRAINT "beds_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."hospital_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_HospitalUnitToProfessional" ADD CONSTRAINT "_HospitalUnitToProfessional_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."hospital_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_HospitalUnitToProfessional" ADD CONSTRAINT "_HospitalUnitToProfessional_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
