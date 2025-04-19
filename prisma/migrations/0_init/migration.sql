-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('Deductible', 'Non_Deductible', 'Mestrual', 'Comp_Off');

-- CreateEnum
CREATE TYPE "AllowanceType" AS ENUM ('Monthly', 'Yearly');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "LeaveTime" AS ENUM ('FULL_DAY', 'FIRST_HALF', 'SECOND_HALF');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Administrator', 'Lead', 'Member');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google', 'Slack');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "UpdateResponseStatus" AS ENUM ('Complete', 'Incomplete', 'Scheduled');

-- CreateTable
CREATE TABLE "LeaveDetail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "needsApproval" BOOLEAN NOT NULL DEFAULT false,
    "notifyAdmin" BOOLEAN NOT NULL DEFAULT false,
    "carryForward" BOOLEAN NOT NULL DEFAULT false,
    "unlimited" BOOLEAN NOT NULL DEFAULT false,
    "addedOn" TEXT NOT NULL,
    "type" "LeaveType" NOT NULL,
    "companyId" TEXT NOT NULL,
    "allowanceType" "AllowanceType",
    "allowance" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "strength" INTEGER,
    "domain" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "slackTeamId" TEXT,
    "slackTeamName" TEXT,
    "slackNotification" BOOLEAN NOT NULL DEFAULT false,
    "slackBirthday" JSONB,
    "slackWorkanniversary" JSONB,
    "slackUpcomingHoliday" JSONB,
    "dailyLeaveSummary" JSONB,
    "weeklyLeaveSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender",
    "birthday" TEXT,
    "workAnniversary" TEXT,
    "slackId" TEXT,
    "googleId" TEXT,
    "companyId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'Member',
    "colorCode" INTEGER NOT NULL,
    "approverId" TEXT,
    "needsOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "compOff" INTEGER NOT NULL DEFAULT 0,
    "lastSignInProvider" "Provider",
    "googleNotification" BOOLEAN NOT NULL DEFAULT false,
    "googleLeaves" BOOLEAN NOT NULL DEFAULT false,
    "autoDeclineOnLeave" BOOLEAN NOT NULL DEFAULT false,
    "autoDeclineOnHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "start" TEXT NOT NULL,
    "startTime" "LeaveTime" NOT NULL,
    "end" TEXT,
    "endTime" "LeaveTime",
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaveDetailId" TEXT NOT NULL,
    "approvedById" TEXT,
    "timeStamp" TEXT[],

    CONSTRAINT "LeaveRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workday" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workWeek" INTEGER NOT NULL,
    "weekOff" "WeekDay"[],
    "startOfWeek" "WeekDay" NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamUser" (
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TeamUser_pkey" PRIMARY KEY ("teamId","userId")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "questions" TEXT[],
    "teamId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateResponse" (
    "id" TEXT NOT NULL,
    "answer" TEXT[],
    "updateId" TEXT NOT NULL,
    "status" "UpdateResponseStatus" NOT NULL DEFAULT 'Scheduled',
    "userId" TEXT NOT NULL,
    "timeStamp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UpdateToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UpdateToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_domain_key" ON "Company"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Company_createdById_key" ON "Company"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_slackId_key" ON "User"("slackId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "_UpdateToUser_B_index" ON "_UpdateToUser"("B");

-- AddForeignKey
ALTER TABLE "LeaveDetail" ADD CONSTRAINT "LeaveDetail_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_leaveDetailId_fkey" FOREIGN KEY ("leaveDetailId") REFERENCES "LeaveDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workday" ADD CONSTRAINT "Workday_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateResponse" ADD CONSTRAINT "UpdateResponse_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Update"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateResponse" ADD CONSTRAINT "UpdateResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpdateToUser" ADD CONSTRAINT "_UpdateToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Update"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpdateToUser" ADD CONSTRAINT "_UpdateToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

