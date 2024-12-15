import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { Calendar, CalendarSearch, Clock, Users } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MeetingCUDialog from "@/components/features/MeetingCUForm/MeetingCUDialog";
import MeetingDelete from "@/components/features/MeetingCUForm/MeetingDelete";
import MeetingCopy from "@/components/features/MeetingCUForm/MeetingCopy";
import AvailabilityGrid from "@/components/features/AvailabilityFill/AvailabilityGrid";
import {
  formatMeetingDateTime,
  getStatusColor,
} from "@/components/utils/helper/meeting-list";
import { IMeeting } from "@/types/dashboard";
import AvailabilityChoose from "@/components/features/AvailabilityFill/AvailabilityChoose";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import MeetingQRGen from "@/components/features/MeetingCUForm/MeetingQRGen";

const MeetingDetail = async ({ params }: { params: { meetingId: string } }) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/meeting?meetingId=${params.meetingId}`,
      {
        headers: {
          cookie: headers().get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      notFound();
    }
    const data = await response.json();
    const meeting: IMeeting = { ...data.meeting, id: params.meetingId };
    
    const isOwner = meeting.participants.some(
      (participant) => participant.userId === userId && participant.role === "OWNER"
    );

    const { date, time } = formatMeetingDateTime(meeting);

    return (
      <div className="flex flex-col gap-6">
        <PageTitle name="Meeting detail" icon={<CalendarSearch />} />

        <Card className="flex flex-col p-4">
          <CardHeader className="p-0 flex flex-row justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="flex flex-col space-y-2">
                <div className="flex space-x-2 items-center">
                  <h1 className="text-xl font-semibold">{meeting.title}</h1>
                  <Badge
                    className={`${getStatusColor(
                      meeting.status
                    )} text-white rounded-md`}
                  >
                    <p>{meeting.status}</p>
                  </Badge>
                </div>
              </CardTitle>

              <CardDescription className="flex items-center space-x-2">
                <div className="flex gap-2 items-center">
                  <Users className="size-4" />
                  <div className="flex space-x-2">
                    {meeting.participants.slice(0, 5).map((participant) => (
                      <Avatar
                        key={participant.id}
                        className="h-6 w-6 border-2 border-background"
                      >
                        <AvatarImage
                          src={participant.user.image}
                          alt={participant.user.name}
                        />
                        <AvatarFallback>
                          {participant.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {meeting.participants.length > 3 && (
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarFallback>
                          +{meeting.participants.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center space-x-2 text-sm text-muted-foreground font-semibold">
                  <Calendar className="size-4 text-foreground" />
                  <span>{date}</span>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center space-x-2 text-sm text-muted-foreground font-semibold">
                  <Clock className="size-4 text-foreground" />
                  <span>{time}</span>
                </div>
              </CardDescription>
            </div>
            <div className="space-x-2 flex items-center">
              <MeetingQRGen meetingId={params.meetingId} />
              <MeetingCopy meetingId={params.meetingId} />
              <MeetingDelete meetingId={params.meetingId} isOwner={isOwner} />
              <MeetingCUDialog
                manageType="edit"
                meetingData={meeting}
                isOwner={isOwner}
              />
            </div>
          </CardHeader>
          <CardContent className="flex items-center space-x-4 p-0"></CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <AvailabilityGrid meeting={meeting} isOwner={isOwner} />
          <AvailabilityChoose meeting={meeting} isOwner={isOwner} />
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Error loading meeting details</div>;
  }
};

export default MeetingDetail;
