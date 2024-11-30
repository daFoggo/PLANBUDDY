/*
  Warnings:

  - Added the required column `timeZone` to the `AvailableSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailableSlot" ADD COLUMN     "timeZone" TEXT NOT NULL;
