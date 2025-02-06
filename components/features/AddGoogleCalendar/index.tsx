"use client";
import { Button } from "@/components/ui/button";
import { IAddGoogleCalendarProps } from "@/types/add-google-calendar";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SiGooglecalendar } from "react-icons/si";
import { toast } from "sonner";

const AddGoogleCalendar = ({
  meeting,
  availability,
  proposedDates,
  onSelectionStart,
  onSelectionEnd,
  selection,
  isSelectionValid,
}: IAddGoogleCalendarProps) => {
  const t = useTranslations("AddGoogleCalendar");
  const [isSelecting, setIsSelecting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleStartSelection = () => {
    setIsSelecting(true);
    onSelectionStart();
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    onSelectionEnd();
  };

  const handleScheduleToGoogle = async () => {
    if (!isSelectionValid) {
      toast.error(t("toast.selectionNotValid"));
      return;
    }

    setIsScheduling(true);
    try {
      const { start, end } = selection;
      if (!start || !end) return;

      // Calculate date
      const selectedDate = proposedDates[start.col];
      const startTime = availability[start.row].time;
      const endTime = availability[end.row].time;

      // Format the date and time for Google Calendar
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(
        parseInt(startTime.split(":")[0]),
        parseInt(startTime.split(":")[1])
      );

      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(
        parseInt(endTime.split(":")[0]),
        parseInt(endTime.split(":")[1]) + 30
      );

      // Create Google Calendar event URL
      const title = encodeURIComponent(meeting.title);
      const location = encodeURIComponent(meeting.location || "");
      const description = encodeURIComponent(meeting.description || "");
      const dates = `${startDateTime
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, "")}/${endDateTime
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, "")}`;
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}&details=${description}`;

      window.open(googleCalendarUrl, "_blank");

      toast.success(t("toast.success"));
      handleCancelSelection();
    } catch (error) {
      console.error("Error scheduling to Google Calendar:", error);
      toast.error(t("toast.error"));
    } finally {
      setIsScheduling(false);
    }
  };

  if (!isSelecting) {
    return (
      <Button
        variant="outline"
        className="border-primary text-primary bg-primary/20 hover:text-primary hover:bg-primary/30"
        onClick={handleStartSelection}
      >
        {t("button.add")}
        <SiGooglecalendar className="ml-2 size-4" />
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="border-red-500 text-red-500 bg-red-500/20 hover:bg-red-500/30 hover:text-red-500"
        onClick={handleCancelSelection}
      >
        {t("button.cancel")}
      </Button>
      <Button
        onClick={handleScheduleToGoogle}
        disabled={isScheduling || !isSelectionValid}
      >
        {isScheduling ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("button.scheduling")}
          </>
        ) : (
          <>
            {t("button.schedule")}
            <SiGooglecalendar className="ml-2 size-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default AddGoogleCalendar;
