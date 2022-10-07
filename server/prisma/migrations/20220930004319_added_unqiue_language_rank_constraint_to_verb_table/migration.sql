/*
  Warnings:

  - A unique constraint covering the columns `[language,rank]` on the table `Verb` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verb_language_rank_key" ON "Verb"("language", "rank");

-- RenameIndex
ALTER INDEX "VerbCorpus_language_infinitive_idx" RENAME TO "Verb_language_infinitive_idx";

-- RenameIndex
ALTER INDEX "VerbCorpus_language_infinitive_key" RENAME TO "Verb_language_infinitive_key";
