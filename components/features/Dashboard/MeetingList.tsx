"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";

import ViewToggle from "@/components/common/ViewToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IMeetingListProps, IMeeting } from "@/types/dashboard";
import {
  formatMeetingDateTime,
  getStatusColor,
} from "@/components/utils/helper/meeting-list";
import { Separator } from "@/components/ui/separator";

const MeetingList = ({ meetingListData }: IMeetingListProps) => {
  const [currentView, setCurrentView] = useState<"list" | "grid">("list");

  const sortedMeetings = useMemo(() => {
    return [...(meetingListData || [])].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [meetingListData]);

  const groupedMeetings = useMemo(() => {
    const groups: { [key: string]: IMeeting[] } = {};
    sortedMeetings.forEach((meeting) => {
      const date = meeting.createdAt;
      if (date) {
        const formattedDate = format(parseISO(date), "yyyy-MM-dd");
        if (!groups[formattedDate]) {
          groups[formattedDate] = [];
        }
        groups[formattedDate].push(meeting);
      }
    });
    return groups;
  }, [sortedMeetings]);

  const renderMeetingCard = (meeting: IMeeting) => {
    const { date, time } = formatMeetingDateTime(meeting);

    return (
      <Card
        key={meeting.id}
        className="w-full hover:shadow-md transition-shadow duration-300 p-4"
      >
        <CardHeader className="p-0 pb-2">
          <div className="flex items-center justify-between">
            <Badge
              className={`${getStatusColor(
                meeting.status
              )} text-white rounded-md`}
            >
              <p>{meeting.status}</p>
            </Badge>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    {meeting.meetingType === "online" ? (
                      <Video className="size-4" />
                    ) : (
                      <MapPin className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center" className="text-xs">
                  {meeting.meetingType === "online"
                    ? "Online Meeting"
                    : "In-person Meeting"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-lg font-bold truncate">
            {meeting.title}
          </CardTitle>
          <CardDescription>{meeting.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pb-2"></CardContent>
        <CardFooter className="p-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
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
            </div>
            <Link href={`/meeting/${meeting.id}`}>
              <Button
                variant="outline"
                rightIcon={<ArrowUpRight className="size-4" />}
              >
                View Details
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="self-end">
        <ViewToggle onViewChange={setCurrentView} defaultView={currentView} />
      </div>
      {sortedMeetings.length === 0 ? (
        <div className="text-center text-lg font-semibold text-muted-foreground">
          No meetings found. Create or join a meeting to get started :)
        </div>
      ) : (
        Object.entries(groupedMeetings).map(([date, meetings]) => (
          <div key={date} className="space-y-2">
            <h1 className="text-lg font-semibold sticky top-0 bg-background z-10">
              Created at {format(parseISO(date), "MMMM d, yyyy")}
            </h1>
            <div
              className={`grid gap-4 ${
                currentView === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {meetings.map((meeting) => renderMeetingCard(meeting))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MeetingList;
