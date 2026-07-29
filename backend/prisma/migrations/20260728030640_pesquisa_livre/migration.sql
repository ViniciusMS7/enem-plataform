-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customSearchesUsed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CustomTopic" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomQuestion" (
    "id" TEXT NOT NULL,
    "customTopicId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "CustomQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomAlternative" (
    "id" TEXT NOT NULL,
    "customQuestionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CustomAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomTopic_slug_key" ON "CustomTopic"("slug");

-- AddForeignKey
ALTER TABLE "CustomQuestion" ADD CONSTRAINT "CustomQuestion_customTopicId_fkey" FOREIGN KEY ("customTopicId") REFERENCES "CustomTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomAlternative" ADD CONSTRAINT "CustomAlternative_customQuestionId_fkey" FOREIGN KEY ("customQuestionId") REFERENCES "CustomQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
