-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveDetail" DROP CONSTRAINT "LeaveDetail_companyId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRecord" DROP CONSTRAINT "LeaveRecord_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRecord" DROP CONSTRAINT "LeaveRecord_leaveDetailId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRecord" DROP CONSTRAINT "LeaveRecord_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_companyId_fkey";

-- DropForeignKey
ALTER TABLE "TeamUser" DROP CONSTRAINT "TeamUser_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamUser" DROP CONSTRAINT "TeamUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Update" DROP CONSTRAINT "Update_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Update" DROP CONSTRAINT "Update_teamId_fkey";

-- DropForeignKey
ALTER TABLE "UpdateResponse" DROP CONSTRAINT "UpdateResponse_updateId_fkey";

-- DropForeignKey
ALTER TABLE "UpdateResponse" DROP CONSTRAINT "UpdateResponse_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_approverId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Workday" DROP CONSTRAINT "Workday_teamId_fkey";

-- AddForeignKey
ALTER TABLE "LeaveDetail" ADD CONSTRAINT "LeaveDetail_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_leaveDetailId_fkey" FOREIGN KEY ("leaveDetailId") REFERENCES "LeaveDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workday" ADD CONSTRAINT "Workday_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateResponse" ADD CONSTRAINT "UpdateResponse_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Update"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateResponse" ADD CONSTRAINT "UpdateResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
