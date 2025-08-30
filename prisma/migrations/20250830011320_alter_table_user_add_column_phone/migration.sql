/*
  Warnings:

  - You are about to drop the column `phone` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `professionals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."patients" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "public"."professionals" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "phone" TEXT;
