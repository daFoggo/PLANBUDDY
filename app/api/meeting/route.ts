import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }
  
  try {
    const ownedMeetings = await prisma.meeting.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
            role: "OWNER",
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        dateSelections: {
          include: {
            date: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const participatedMeetings = await prisma.meeting.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
            role: "PARTICIPANT",
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        dateSelections: {
          include: {
            date: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Meetings fetched successfully",
        ownedMeetings,
        participatedMeetings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Failed to fetch meetings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      meetingType,
      onlineMeetingUrl,
      description,
      location,
      note,
      startTime,
      endTime,
      dates,
      participants,
    } = await req.json();

    const meeting = await prisma.meeting.create({
      data: {
        title,
        meetingType,
        onlineMeetingUrl,
        description,
        location,
        note,
        startTime,
        endTime,
        status: "PUBLISHED",
      },
    });

    const ownerParticipant = await prisma.meetingParticipant.create({
      data: {
        role: "OWNER",
        user: {
          connect: { id: participants[0] },
        },
        meeting: {
          connect: { id: meeting.id },
        },
      },
    });

    const dateSelections = await Promise.all(
      dates.map(async (date: any) => {
        const meetingDate = await prisma.meetingDate.upsert({
          where: { date: new Date(date.date) },
          update: {},
          create: { date: new Date(date.date) },
        });

        return prisma.meetingDateSelection.create({
          data: {
            meeting: { connect: { id: meeting.id } },
            date: { connect: { id: meetingDate.id } },
            isFinal: false,
          },
        });
      })
    );

    return NextResponse.json(
      {
        message: "Meeting created successfully",
        meeting,
        ownerParticipant,
        dateSelections,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to create meeting",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
