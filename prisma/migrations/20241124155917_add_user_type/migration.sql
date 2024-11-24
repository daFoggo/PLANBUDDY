-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('GOOGLE_USER', 'GUEST');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('OWNER', 'PARTICIPANT');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'TENTATIVE');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PUBLISHED', 'SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "profilePic" TEXT,
    "timeZone" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "note" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingParticipant" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "responseStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,

    CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingDate" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingDateSelection" (
    "id" SERIAL NOT NULL,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "dateId" INTEGER NOT NULL,

    CONSTRAINT "MeetingDateSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableFor" (
    "id" SERIAL NOT NULL,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableTo" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "participantId" INTEGER NOT NULL,
    "dateSelectionId" INTEGER NOT NULL,

    CONSTRAINT "AvailableFor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "MeetingParticipant_userId_idx" ON "MeetingParticipant"("userId");

-- CreateIndex
CREATE INDEX "MeetingParticipant_meetingId_idx" ON "MeetingParticipant"("meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingParticipant_userId_meetingId_key" ON "MeetingParticipant"("userId", "meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingDate_date_key" ON "MeetingDate"("date");

-- CreateIndex
CREATE INDEX "MeetingDateSelection_meetingId_idx" ON "MeetingDateSelection"("meetingId");

-- CreateIndex
CREATE INDEX "MeetingDateSelection_dateId_idx" ON "MeetingDateSelection"("dateId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingDateSelection_meetingId_dateId_key" ON "MeetingDateSelection"("meetingId", "dateId");

-- CreateIndex
CREATE INDEX "AvailableFor_participantId_idx" ON "AvailableFor"("participantId");

-- CreateIndex
CREATE INDEX "AvailableFor_dateSelectionId_idx" ON "AvailableFor"("dateSelectionId");

-- CreateIndex
CREATE UNIQUE INDEX "AvailableFor_participantId_dateSelectionId_key" ON "AvailableFor"("participantId", "dateSelectionId");

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
