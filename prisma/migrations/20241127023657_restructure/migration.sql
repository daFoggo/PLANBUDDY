/*
  Warnings:

  - Added the required column `meetingType` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "meetingType" TEXT NOT NULL,
ADD COLUMN     "onlineMeetingUrl" TEXT;
