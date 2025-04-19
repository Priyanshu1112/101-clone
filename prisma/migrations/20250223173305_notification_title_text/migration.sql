/*
  Warnings:

  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `text` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "text" SET NOT NULL;
