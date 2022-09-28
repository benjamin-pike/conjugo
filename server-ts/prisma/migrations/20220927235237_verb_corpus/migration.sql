-- CreateTable
CREATE TABLE "VerbCorpus" (
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

-- CreateIndex
CREATE INDEX "VerbCorpus_language_infinitive_idx" ON "VerbCorpus"("language", "infinitive");

-- CreateIndex
CREATE UNIQUE INDEX "VerbCorpus_language_infinitive_key" ON "VerbCorpus"("language", "infinitive");
