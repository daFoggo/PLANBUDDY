import { auth } from "@/auth";
import PageTitle from "@/components/common/PageTitle";
import AvailabilityChoose from "@/components/features/AvailabilityFill/AvailabilityChoose";
import AvailabilityGrid from "@/components/features/AvailabilityFill/AvailabilityGrid";
import MeetingCopy from "@/components/features/MeetingCUForm/MeetingCopy";
import MeetingCUDialog from "@/components/features/MeetingCUForm/MeetingCUDialog";
import MeetingDelete from "@/components/features/MeetingCUForm/MeetingDelete";
import MeetingQRGen from "@/components/features/MeetingCUForm/MeetingQRGen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MEETING_TYPE } from "@/components/utils/constant";
import {
  formatMeetingDateTime,
  getStatusColor,
} from "@/components/utils/helper/meeting-list";
import { IMeeting } from "@/types/dashboard";
import {
  Calendar,
  CalendarSearch,
  Clock,
  MapPin,
  MessageCircleWarning,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SiGooglemeet } from "react-icons/si";

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
      (participant) =>
        participant.userId === userId && participant.role === "OWNER"
    );

    const { date, time } = formatMeetingDateTime(meeting);

    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <PageTitle name="Meeting detail" icon={<CalendarSearch />} />

        <Card className="flex flex-col p-4">
          <CardHeader className="p-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="space-y-2 w-full sm:w-1/2">
              <CardTitle className="flex flex-col space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-semibold line-clamp-1">
                    {meeting.title}
                  </h1>
                  <Badge
                    className={`${getStatusColor(
                      meeting.status
                    )} text-white rounded-md text-xs sm:text-sm w-fit`}
                  >
                    <p>{meeting.status}</p>
                  </Badge>
                </div>
              </CardTitle>

              <p className="text-sm line-clamp-2">{meeting.description}</p>
              <div className="text-xs line-clamp-2 text-red-500 flex flex-row items-center gap-2">
                <MessageCircleWarning className="size-4 flex-shrink-0" />
                <span>{meeting.note}</span>
              </div>
              <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex gap-2 items-center">
                  <Users className="size-4 flex-shrink-0" />
                  <div className="flex -space-x-1">
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
                    {meeting.participants.length > 5 && (
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarFallback>
                          +{meeting.participants.length - 5}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>

                <Separator
                  orientation="vertical"
                  className="h-4 hidden sm:block"
                />

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-semibold">
                  <Calendar className="size-4 text-foreground flex-shrink-0" />
                  <span>{date}</span>
                </div>

                <Separator
                  orientation="vertical"
                  className="h-4 hidden sm:block"
                />

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-semibold">
                  <Clock className="size-4 text-foreground flex-shrink-0" />
                  <span>{time}</span>
                </div>

                <Separator
                  orientation="vertical"
                  className="h-4 hidden sm:block"
                />

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-semibold">
                  {meeting.meetingType === MEETING_TYPE.INPERSON ? (
                    <>
                      <MapPin className="size-4 flex-shrink-0" />
                      <span className="line-clamp-1">{meeting?.location}</span>
                    </>
                  ) : (
                    <>
                      <SiGooglemeet className="size-4 flex-shrink-0" />
                      <a
                        href={meeting?.location || ""}
                        target="_blank"
                        className="hover:underline"
                      >
                        Join meeting
                      </a>
                    </>
                  )}
                </div>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 sm:space-x-2 sm:flex-nowrap">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
