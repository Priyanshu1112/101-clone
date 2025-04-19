-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "leaveRecordId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_leaveRecordId_fkey" FOREIGN KEY ("leaveRecordId") REFERENCES "LeaveRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
