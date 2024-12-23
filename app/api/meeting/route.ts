import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PARTICIPANT_ROLE } from "@/components/utils/constant";
import {
  getMeetingById,
  getUserMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  deleteParticipant,
  updateAvailability,
} from "@/lib/meeting";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const meetingId = searchParams.get("meetingId");

    // Get meeting by ID
    if (meetingId) {
      try {
        const meeting = await getMeetingById(meetingId);
        if (!meeting) {
          return NextResponse.json(
            { error: "Meeting not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ meeting });
      } catch (error) {
        return NextResponse.json(
          {
            error: "Failed to get meeting",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    // Get user meetings
    if (userId) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      try {
        const result = await getUserMeetings(userId);
        return NextResponse.json(result);
      } catch (error) {
        return NextResponse.json(
          {
            error: "Failed to get meeting",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Operation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meetingData = await req.json();
    const meeting = await createMeeting(meetingData, session.user.id);

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create meeting",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meetingData = await req.json();
    if (!meetingData.id) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Check owner permission
    const existingMeeting = await getMeetingById(meetingData.id);
    if (
      !existingMeeting ||
      !existingMeeting.participants.some(
        (p) => p.userId === session.user.id && p.role === PARTICIPANT_ROLE.OWNER
      )
    ) {
      return NextResponse.json(
        { error: "You do not have permission to update this meeting" },
        { status: 403 }
      );
    }

    const updatedMeeting = await updateMeeting(meetingData, session.user.id);

    return NextResponse.json(
      {
        meeting: updatedMeeting,
        message: "Meeting updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update meeting",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");
    const participantId = searchParams.get("participantId");

    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Check owner permission
    const existingMeeting = await getMeetingById(meetingId);
    if (
      !existingMeeting ||
      !existingMeeting.participants.some(
        (p) => p.userId === session.user.id && p.role === PARTICIPANT_ROLE.OWNER
      )
    ) {
      return NextResponse.json(
        { error: "You do not have permission for this action" },
        { status: 403 }
      );
    }

    if (participantId) {
      await deleteParticipant(meetingId, participantId);
      return NextResponse.json(
        { message: "Participant deleted successfully" },
        { status: 200 }
      );
    } else {
      await deleteMeeting(meetingId);
      return NextResponse.json(
        { message: "Meeting deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Operation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");
    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const result = await updateAvailability(
      meetingId,
      session.user.id,
      body,
      session.user.timeZone || "UTC"
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error updating availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
