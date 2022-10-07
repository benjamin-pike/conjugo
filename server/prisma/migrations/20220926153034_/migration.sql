-- CreateTable
CREATE TABLE "PracticeConfig" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "subjects" TEXT[],
    "tense" TEXT[],
    "verbs" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PracticeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticeConfig_userId_idx" ON "PracticeConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeConfig_userId_language_key" ON "PracticeConfig"("userId", "language");

-- CreateIndex
CREATE INDEX "SavedVerbs_userId_idx" ON "SavedVerbs"("userId");

-- AddForeignKey
ALTER TABLE "PracticeConfig" ADD CONSTRAINT "PracticeConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
