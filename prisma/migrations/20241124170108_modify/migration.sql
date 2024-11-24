/*
  Warnings:

  - The primary key for the `AvailableFor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Meeting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MeetingDate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MeetingDateSelection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MeetingParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableFor" DROP CONSTRAINT "AvailableFor_dateSelectionId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableFor" DROP CONSTRAINT "AvailableFor_participantId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingDateSelection" DROP CONSTRAINT "MeetingDateSelection_dateId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingDateSelection" DROP CONSTRAINT "MeetingDateSelection_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingParticipant" DROP CONSTRAINT "MeetingParticipant_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingParticipant" DROP CONSTRAINT "MeetingParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AvailableFor" DROP CONSTRAINT "AvailableFor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "participantId" SET DATA TYPE TEXT,
ALTER COLUMN "dateSelectionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AvailableFor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AvailableFor_id_seq";

-- AlterTable
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Meeting_id_seq";

-- AlterTable
ALTER TABLE "MeetingDate" DROP CONSTRAINT "MeetingDate_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MeetingDate_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MeetingDate_id_seq";

-- AlterTable
ALTER TABLE "MeetingDateSelection" DROP CONSTRAINT "MeetingDateSelection_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "meetingId" SET DATA TYPE TEXT,
ALTER COLUMN "dateId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MeetingDateSelection_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MeetingDateSelection_id_seq";

-- AlterTable
ALTER TABLE "MeetingParticipant" DROP CONSTRAINT "MeetingParticipant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "meetingId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MeetingParticipant_id_seq";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingDateSelection" ADD CONSTRAINT "MeetingDateSelection_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingDateSelection" ADD CONSTRAINT "MeetingDateSelection_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "MeetingDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableFor" ADD CONSTRAINT "AvailableFor_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "MeetingParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableFor" ADD CONSTRAINT "AvailableFor_dateSelectionId_fkey" FOREIGN KEY ("dateSelectionId") REFERENCES "MeetingDateSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
