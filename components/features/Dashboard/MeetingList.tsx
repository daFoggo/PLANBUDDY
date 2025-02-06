"use client";

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
import { useMemo, useState } from "react";

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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MEETING_TYPE } from "@/components/utils/constant";
import {
  formatMeetingDateTime,
  getStatusColor,
  localeMapping,
} from "@/components/utils/helper/meeting-list";
import { IMeeting, IMeetingListProps } from "@/types/dashboard";
import { useLocale, useTranslations } from "next-intl";

const MeetingList = ({ meetingListData }: IMeetingListProps) => {
  const t = useTranslations("Dashboard.MeetingList");
  const locale = useLocale();
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
        const formattedDate = format(new Date(date), "yyyy-MM-dd");
        if (!groups[formattedDate]) {
          groups[formattedDate] = [];
        }
        groups[formattedDate].push(meeting);
      }
    });
    return groups;
  }, [sortedMeetings]);

  const renderMeetingCard = (meeting: IMeeting) => {
    const { date, time } = formatMeetingDateTime(
      meeting,
      localeMapping[locale] || "en-US"
    );

    return (
      <Card
        key={meeting.id}
        className="w-full hover:shadow-md hover:shadow-primary/10 transition-shadow duration-300 p-4"
      >
        <CardHeader className="p-0 pb-2">
          <div className="flex items-center justify-between">
            <Badge
              className={`${getStatusColor(
                meeting.status
              )} text-white rounded-md`}
            >
              <p className="text-xs sm:text-sm">{meeting.status}</p>
            </Badge>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    {meeting?.meetingType === MEETING_TYPE.ONLINE ? (
                      <Video className="size-4 sm:size-5" />
                    ) : (
                      <MapPin className="size-4 sm:size-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center" className="text-xs sm:text-sm">
                  {meeting?.meetingType === MEETING_TYPE.INPERSON
                    ? t("MeetingCard.tooltip.online")
                    : t("MeetingCard.tooltip.inperson")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-base sm:text-lg font-bold truncate line-clamp-1">
            {meeting.title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm line-clamp-2">
            {meeting.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pb-2"></CardContent>
        <CardFooter className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-0">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="size-3 sm:size-4" />
                <div className="flex -space-x-1 sm:-space-x-2">
                  {meeting.participants.slice(0, 5).map((participant) => (
                    <Avatar
                      key={participant.id}
                      className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-background"
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
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-background">
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

              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground font-semibold">
                <Calendar className="size-3 sm:size-4 text-foreground" />
                <span>{date}</span>
              </div>

              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />

              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground font-semibold">
                <Clock className="size-3 sm:size-4 text-foreground" />
                <span>{time}</span>
              </div>
            </div>
            <Link href={`/meeting/${meeting.id}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {t("MeetingCard.button")}
                <ArrowUpRight className="size-3 sm:size-4" />
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
        <div className="text-center text-base sm:text-lg font-semibold text-muted-foreground">
          {t("noMeetings")}
        </div>
      ) : (
        Object.entries(groupedMeetings).map(([date, meetings]) => (
          <div key={date} className="space-y-2">
            <h1 className="text-base sm:text-lg font-semibold sticky top-0 bg-background z-10 py-2">
              {t("createdAt")} {format(parseISO(date), "MMMM d, yyyy")}
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
