import { notFound } from "next/navigation";
import PageTitle from "@/components/common/PageTitle";
import { Calendar, CalendarSearch, Clock, Users } from "lucide-react";
import { IMeeting } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import {
  formatMeetingDateTime,
  getStatusColor,
} from "@/components/utils/helper/meeting-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MeetingCUDialog from "@/components/features/MeetingCUForm/MeetingCUDialog";
import { headers } from "next/headers";

const MeetingDetail = async ({ params }: { params: { meetingId: string } }) => {
  try {
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
            <MeetingCUDialog manageType="edit" meetingData={meeting} />
          </CardHeader>
          <CardContent className="flex items-center space-x-4 p-0"></CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Error loading meeting details</div>;
  }
};

export default MeetingDetail;
