-- CreateEnum
CREATE TYPE "public"."AdmissionStatus" AS ENUM ('ACTIVE', 'DISCHARGED', 'CANCELED');

-- CreateTable
CREATE TABLE "public"."admissions" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" "public"."AdmissionStatus" NOT NULL DEFAULT 'ACTIVE',
    "patientId" TEXT NOT NULL,
    "bedId" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admissions_status_idx" ON "public"."admissions"("status");

-- CreateIndex
CREATE INDEX "admissions_patientId_idx" ON "public"."admissions"("patientId");

-- CreateIndex
CREATE INDEX "admissions_unitId_idx" ON "public"."admissions"("unitId");

-- AddForeignKey
ALTER TABLE "public"."admissions" ADD CONSTRAINT "admissions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admissions" ADD CONSTRAINT "admissions_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "public"."beds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admissions" ADD CONSTRAINT "admissions_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."hospital_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
