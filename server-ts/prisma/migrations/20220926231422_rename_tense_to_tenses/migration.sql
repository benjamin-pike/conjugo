/*
  Warnings:

  - You are about to drop the column `tense` on the `PracticeConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PracticeConfig" DROP COLUMN "tense",
ADD COLUMN     "tenses" TEXT[];
