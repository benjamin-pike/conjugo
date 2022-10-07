-- AlterTable
ALTER TABLE "PracticeConfig" ALTER COLUMN "verbs" SET DEFAULT 20,
ALTER COLUMN "target" SET DEFAULT 10,
ALTER COLUMN "time" SET DEFAULT 120;

-- CreateTable
CREATE TABLE "xp" (
    "id" TEXT NOT NULL,
    "spanish" INTEGER NOT NULL DEFAULT 0,
    "french" INTEGER NOT NULL DEFAULT 0,
    "german" INTEGER NOT NULL DEFAULT 0,
    "italian" INTEGER NOT NULL DEFAULT 0,
    "portuguese" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "xp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "xp_userId_idx" ON "xp"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "xp_userId_key" ON "xp"("userId");

-- AddForeignKey
ALTER TABLE "xp" ADD CONSTRAINT "xp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
