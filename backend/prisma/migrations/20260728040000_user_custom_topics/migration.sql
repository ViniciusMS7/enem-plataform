-- CreateTable
CREATE TABLE "UserCustomTopic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customTopicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCustomTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomTopic_userId_customTopicId_key" ON "UserCustomTopic"("userId", "customTopicId");

-- AddForeignKey
ALTER TABLE "UserCustomTopic" ADD CONSTRAINT "UserCustomTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomTopic" ADD CONSTRAINT "UserCustomTopic_customTopicId_fkey" FOREIGN KEY ("customTopicId") REFERENCES "CustomTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
