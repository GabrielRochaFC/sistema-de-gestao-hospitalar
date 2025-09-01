-- CreateEnum
CREATE TYPE "public"."ExamStatus" AS ENUM ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."ExamType" AS ENUM ('BLOOD_TEST', 'URINE_TEST', 'IMAGING', 'XRAY', 'MRI', 'CT', 'ULTRASOUND', 'ECG', 'BIOPSY', 'OTHER');

-- CreateTable
CREATE TABLE "public"."exams" (
    "id" TEXT NOT NULL,
    "type" "public"."ExamType" NOT NULL,
    "status" "public"."ExamStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "resultText" TEXT,
    "notes" TEXT,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT,
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exams_status_idx" ON "public"."exams"("status");

-- CreateIndex
CREATE INDEX "exams_patientId_idx" ON "public"."exams"("patientId");

-- CreateIndex
CREATE INDEX "exams_unitId_idx" ON "public"."exams"("unitId");

-- CreateIndex
CREATE INDEX "exams_type_idx" ON "public"."exams"("type");

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "public"."professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."hospital_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
