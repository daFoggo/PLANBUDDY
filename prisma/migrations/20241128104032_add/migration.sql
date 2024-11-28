-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "dateType" TEXT,
ADD COLUMN     "isAllDay" BOOLEAN NOT NULL DEFAULT false;
