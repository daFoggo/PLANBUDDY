import { prisma } from "./prisma";
import { PARTICIPANT_ROLE } from "@/components/utils/constant";

export async function getMeetingById(meetingId: string) {
  return prisma.meeting.findUnique({
    where: {
      id: meetingId,
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      availableSlots: true,
    },
  });
}

export async function getUserMeetings(userId: string) {
  const [hostedMeeting, joinedMeeting, stats] = await Promise.all([
    prisma.meeting.findMany({
      where: {
        participants: {
          some: {
            userId,
            role: PARTICIPANT_ROLE.OWNER,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        availableSlots: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.meeting.findMany({
      where: {
        participants: {
          some: {
            userId,
            role: PARTICIPANT_ROLE.PARTICIPANT,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        availableSlots: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.meeting.groupBy({
      where: {
        OR: [
          {
            participants: {
              some: {
                userId,
                role: PARTICIPANT_ROLE.OWNER,
              },
            },
          },
          {
            participants: {
              some: {
                userId,
                role: PARTICIPANT_ROLE.PARTICIPANT,
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

  const statsResult = {
    hostedMeeting: await prisma.meeting.count({
      where: {
        participants: {
          some: {
            userId,
            role: PARTICIPANT_ROLE.OWNER,
          },
        },
      },
    }),
    joinedMeeting: await prisma.meeting.count({
      where: {
        participants: {
          some: {
            userId,
            role: PARTICIPANT_ROLE.PARTICIPANT,
          },
        },
      },
    }),
    arrangingMeeting:
      stats.find((stat: any) => stat.status === "PUBLISHED")?._count?.id || 0,
    scheduledMeeting:
      stats.find((stat: any) => stat.status === "SCHEDULED")?._count?.id || 0,
  };

  return {
    hostedMeeting,
    joinedMeeting,
    stats: statsResult,
  };
}

export async function createMeeting(meetingData: any, userId: string) {
  return prisma.meeting.create({
    data: {
      title: meetingData.title,
      description: meetingData.description || null,
      meetingType: meetingData.meetingType,
      location: meetingData.location || null,
      note: meetingData.note || null,
      dateType: meetingData.dateType,
      proposedDates: meetingData.proposedDates.map(
        (date: string) => new Date(date)
      ),
      startTime: meetingData.startTime,
      endTime: meetingData.endTime,
      status: meetingData.status,
      participants: {
        create: [
          {
            userId: userId,
            role: "OWNER",
          },
          ...(meetingData.participants || [])
            .filter((participant: any) => participant.userId !== userId)
            .map((participant: any) => ({
              userId: participant.userId,
              role: participant.role || "PARTICIPANT",
            })),
        ],
      },
      availableSlots: {
        create: meetingData.availableSlots.map((slot: any) => ({
          userId,
          date: new Date(slot.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
          timeZone: slot.timeZone,
        })),
      },
    },
    include: {
      participants: true,
      availableSlots: true,
    },
  });
}

export async function updateMeeting(meetingData: any, userId: string) {
  const updateData: any = {
    ...(meetingData.title && { title: meetingData.title }),
    ...(meetingData.description !== undefined && {
      description: meetingData.description,
    }),
    ...(meetingData.meetingType && { meetingType: meetingData.meetingType }),
    ...(meetingData.location !== undefined && {
      location: meetingData.location,
    }),
    ...(meetingData.note !== undefined && { note: meetingData.note }),
    ...(meetingData.dateType && { dateType: meetingData.dateType }),
    ...(meetingData.proposedDates && {
      proposedDates: meetingData.proposedDates.map(
        (date: string) => new Date(date)
      ),
    }),
    ...(meetingData.startTime && { startTime: meetingData.startTime }),
    ...(meetingData.endTime && { endTime: meetingData.endTime }),
    ...(meetingData.status && { status: meetingData.status }),
  };

  const updatedMeeting = await prisma.meeting.update({
    where: { id: meetingData.id },
    data: updateData,
    include: {
      participants: true,
      availableSlots: true,
    },
  });

  if (meetingData.participants) {
    await prisma.meetingParticipant.deleteMany({
      where: { meetingId: meetingData.id },
    });

    await prisma.meetingParticipant.createMany({
      data: [
        {
          userId,
          meetingId: meetingData.id,
          role: PARTICIPANT_ROLE.OWNER,
        },
        ...(meetingData.participants || [])
          .filter((participant: any) => participant.userId !== userId)
          .map((participant: any) => ({
            userId: participant.userId,
            meetingId: meetingData.id,
            role: participant.role || PARTICIPANT_ROLE.PARTICIPANT,
          })),
      ],
    });
  }

  if (meetingData.availableSlots) {
    await prisma.availableSlot.deleteMany({
      where: { meetingId: meetingData.id },
    });

    await prisma.availableSlot.createMany({
      data: meetingData.availableSlots.map((slot: any) => ({
        meetingId: meetingData.id,
        userId,
        date: new Date(slot.date),
        startTime: slot.startTime,
        endTime: slot.endTime,
        timeZone: slot.timeZone,
      })),
    });

    const newSlots = await prisma.availableSlot.findMany({
      where: { meetingId: meetingData.id },
    });

    updatedMeeting.availableSlots = newSlots;
  }

  return updatedMeeting;
}

export async function deleteMeeting(meetingId: string) {
  await prisma.$transaction([
    prisma.availableSlot.deleteMany({
      where: { meetingId },
    }),
    prisma.meetingParticipant.deleteMany({
      where: { meetingId },
    }),
    prisma.meeting.delete({
      where: { id: meetingId },
    }),
  ]);
}

export async function deleteParticipant(
  meetingId: string,
  participantId: string
) {
  return prisma.$transaction([
    prisma.availableSlot.deleteMany({
      where: {
        meetingId,
        userId: (
          await prisma.meetingParticipant.findUnique({
            where: { id: participantId },
          })
        )?.userId,
      },
    }),
    prisma.meetingParticipant.delete({
      where: { id: participantId },
    }),
  ]);
}

export async function updateAvailability(
  meetingId: string,
  userId: string,
  slots: any[],
  timeZone: string
) {
  return prisma.$transaction(async (tx) => {
    let participant = await tx.meetingParticipant.findFirst({
      where: {
        userId,
        meetingId,
      },
    });

    if (!participant) {
      participant = await tx.meetingParticipant.create({
        data: {
          userId,
          meetingId,
          role: PARTICIPANT_ROLE.PARTICIPANT,
        },
      });
    }

    await tx.availableSlot.deleteMany({
      where: {
        userId,
        meetingId,
      },
    });

    await tx.availableSlot.createMany({
      data: slots.map((slot) => ({
        userId,
        meetingId,
        date: new Date(slot.date),
        startTime: slot.startTime,
        endTime: slot.endTime,
        timeZone: timeZone || "UTC",
        status: slot.status,
      })),
    });

    return tx.availableSlot.findMany({
      where: {
        userId,
        meetingId,
      },
    });
  });
}
