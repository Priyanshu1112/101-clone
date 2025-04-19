/*
  Warnings:

  - You are about to drop the `_NotificationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_NotificationToUser" DROP CONSTRAINT "_NotificationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_NotificationToUser" DROP CONSTRAINT "_NotificationToUser_B_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "for" TEXT[];

-- DropTable
DROP TABLE "_NotificationToUser";
