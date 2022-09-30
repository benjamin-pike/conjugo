/*
  Warnings:

  - You are about to drop the `VerbCorpus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "VerbCorpus";

-- CreateTable
CREATE TABLE "Verb" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "infinitive" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "regularity" TEXT NOT NULL,
    "translations" JSONB NOT NULL,
    "conjugations" JSONB NOT NULL,
    "participles" JSONB NOT NULL,

    CONSTRAINT "VerbCorpus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "knownVerbs" INTEGER NOT NULL DEFAULT 3,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerbCorpus_language_infinitive_idx" ON "Verb"("language", "infinitive");

-- CreateIndex
CREATE UNIQUE INDEX "VerbCorpus_language_infinitive_key" ON "Verb"("language", "infinitive");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_language_key" ON "UserProgress"("userId", "language");

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
