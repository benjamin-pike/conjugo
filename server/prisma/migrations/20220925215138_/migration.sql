/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "SavedVerbs" (
    "id" TEXT NOT NULL,
    "spanish" TEXT[],
    "french" TEXT[],
    "german" TEXT[],
    "italian" TEXT[],
    "portuguese" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedVerbs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedVerbs_userId_key" ON "SavedVerbs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "SavedVerbs" ADD CONSTRAINT "SavedVerbs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
