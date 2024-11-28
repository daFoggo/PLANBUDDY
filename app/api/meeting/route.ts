import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const meetingId = searchParams.get("meetingId");

  // fetch meeting detail
  if (meetingId) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id: meetingId },
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
      });

      if (!meeting) {
        return NextResponse.json(
          { message: "Meeting not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Meeting fetched successfully",
          meeting,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Failed to fetch meeting",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  // fetch overview meeting data
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const [hostedMeeting, joinedMeeting, stats] = await Promise.all([
      prisma.meeting.findMany({
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
      }),
      prisma.meeting.findMany({
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
      }),

      prisma.meeting.groupBy({
        where: {
          OR: [
            {
              participants: {
                some: {
                  userId: userId,
                  role: "OWNER",
                },
              },
            },
            {
              participants: {
                some: {
                  userId: userId,
                  role: "PARTICIPANT",
                },
              },
            },
          ],
        },
        by: ["status"],
        _count: {
          id: true,
        },
      }),
    ]);

    // Calculate statistics
    const statsResult = {
      hostedMeeting: await prisma.meeting.count({
        where: {
          participants: {
            some: {
              userId: userId,
              role: "OWNER",
            },
          },
        },
      }),
      joinedMeeting: await prisma.meeting.count({
        where: {
          participants: {
            some: {
              userId: userId,
              role: "PARTICIPANT",
            },
          },
        },
      }),
      arrangingMeeting:
        stats.find((s) => s.status === "PUBLISHED")?._count.id || 0,
      scheduledMeeting:
        stats.find((s) => s.status === "SCHEDULED")?._count.id || 0,
    };

    return NextResponse.json(
      {
        message: "Meetings fetched successfully",
        hostedMeeting,
        joinedMeeting,
        stats: statsResult,
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
      description,
      location,
      note,
      dateType,
      isAllDay,
      startTime,
      endTime,
      dates,
      participants,
    } = await req.json();

    const meeting = await prisma.meeting.create({
      data: {
        title,
        meetingType,
        description,
        location,
        note,
        dateType,
        isAllDay,
        startTime,
        endTime,
        status: "PUBLISHED",
      },
    });

    const ownerParticipant = await prisma.meetingParticipant.create({
      data: {
        role: "OWNER",
        responseStatus: "ACCEPTED",
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

export async function PUT(req: NextRequest) {
  try {
    const {
      id,
      title,
      meetingType,
      description,
      location,
      note,
      dateType,
      isAllDay,
      startTime,
      endTime,
      dates,
      status,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Meeting ID is required for update" },
        { status: 400 }
      );
    }

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        title,
        meetingType,
        description,
        location,
        note,
        dateType,
        isAllDay,
        startTime,
        endTime,
        status: status || "PUBLISHED",
      },
    });

    if (dates && dates.length > 0) {
      await prisma.meetingDateSelection.deleteMany({
        where: { meetingId: id },
      });

      await Promise.all(
        dates.map(async (date: any) => {
          const meetingDate = await prisma.meetingDate.upsert({
            where: { date: new Date(date.date) },
            update: {},
            create: { date: new Date(date.date) },
          });

          return prisma.meetingDateSelection.create({
            data: {
              meeting: { connect: { id } },
              date: { connect: { id: meetingDate.id } },
              isFinal: false,
            },
          });
        })
      );
    }

    return NextResponse.json(
      {
        message: "Meeting updated successfully",
        meeting: updatedMeeting,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to update meeting",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
