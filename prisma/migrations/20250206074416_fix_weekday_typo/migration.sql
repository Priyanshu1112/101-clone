/*
  Warnings:

  - The values [Thurday] on the enum `WeekDay` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WeekDay_new" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
ALTER TABLE "Workday" ALTER COLUMN "weekOff" TYPE "WeekDay_new"[] USING ("weekOff"::text::"WeekDay_new"[]);
ALTER TABLE "Workday" ALTER COLUMN "startOfWeek" TYPE "WeekDay_new" USING ("startOfWeek"::text::"WeekDay_new");
ALTER TYPE "WeekDay" RENAME TO "WeekDay_old";
ALTER TYPE "WeekDay_new" RENAME TO "WeekDay";
DROP TYPE "WeekDay_old";
COMMIT;
