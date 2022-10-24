-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fname" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "lname" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedVerbs" (
    "id" SERIAL NOT NULL,
    "spanish" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "french" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "german" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "italian" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "portuguese" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SavedVerbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeConfig" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "subjects" TEXT[],
    "verbs" INTEGER NOT NULL DEFAULT 20,
    "target" INTEGER NOT NULL DEFAULT 10,
    "time" INTEGER NOT NULL DEFAULT 120,
    "tenses" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PracticeConfig_pkey" PRIMARY KEY ("id")
);

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
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "knownVerbs" INTEGER NOT NULL DEFAULT 3,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "lessonXP" INTEGER[] DEFAULT ARRAY[0]::INTEGER[],
    "lastLesson" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavedVerbs_userId_key" ON "SavedVerbs"("userId");

-- CreateIndex
CREATE INDEX "SavedVerbs_userId_idx" ON "SavedVerbs"("userId");

-- CreateIndex
CREATE INDEX "PracticeConfig_userId_idx" ON "PracticeConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeConfig_userId_language_key" ON "PracticeConfig"("userId", "language");

-- CreateIndex
CREATE INDEX "Verb_language_infinitive_idx" ON "Verb"("language", "infinitive");

-- CreateIndex
CREATE UNIQUE INDEX "Verb_language_infinitive_key" ON "Verb"("language", "infinitive");

-- CreateIndex
CREATE UNIQUE INDEX "Verb_language_rank_key" ON "Verb"("language", "rank");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_language_key" ON "UserProgress"("userId", "language");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedVerbs" ADD CONSTRAINT "SavedVerbs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeConfig" ADD CONSTRAINT "PracticeConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
