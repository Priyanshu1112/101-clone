-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "updateResponseId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_updateResponseId_fkey" FOREIGN KEY ("updateResponseId") REFERENCES "UpdateResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
