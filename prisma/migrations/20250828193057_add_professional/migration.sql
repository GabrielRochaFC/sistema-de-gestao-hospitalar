-- CreateEnum
CREATE TYPE "public"."ProfessionalType" AS ENUM ('DOCTOR', 'NURSE', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "public"."MedicalSpecialty" AS ENUM ('GENERAL_PRACTICE', 'CARDIOLOGY', 'DERMATOLOGY', 'EMERGENCY_MEDICINE', 'FAMILY_MEDICINE', 'INTERNAL_MEDICINE', 'NEUROLOGY', 'OBSTETRICS_GYNECOLOGY', 'ONCOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'PSYCHIATRY', 'RADIOLOGY', 'SURGERY', 'UROLOGY');

-- CreateTable
CREATE TABLE "public"."professionals" (
    "id" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "type" "public"."ProfessionalType" NOT NULL DEFAULT 'DOCTOR',
    "specialties" "public"."MedicalSpecialty"[],
    "phone" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professionals_licenseNumber_key" ON "public"."professionals"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_userId_key" ON "public"."professionals"("userId");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
