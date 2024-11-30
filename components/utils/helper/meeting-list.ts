import { format, isThisWeek, parse, parseISO } from "date-fns";
import { IMeeting } from "@/types/dashboard";

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "published":
      return "bg-green-400 border-green-600 dark:bg-green-700 dark:border-green-500";
    case "draft":
      return "bg-yellow-400 border-yellow-600 dark:bg-yellow-700 dark:border-yellow-500 ";
    case "cancelled":
      return "bg-red-400 border-red-600 dark:bg-red-700 dark:border-red-500";
    default:
      return "bg-gray-400 border-gray-600 dark:bg-gray-700 dark:border-gray-500";
  }
};

export const formatMeetingDateTime = (meeting: IMeeting) => {
  try {
    const dates = meeting.proposedDates.map((date) => new Date(date));
    const formattedDates = dates
      .map((date) => {
        if (isThisWeek(date, { weekStartsOn: 1 })) {
          return format(date, "EEE");
        }
        return format(date, "MMM d");
      })
      .join(", ");

    let formattedTime = "TBD";
    if (meeting.availableSlots && meeting.availableSlots.length > 0) {
      const slot = meeting.availableSlots[0];
      const defaultDate = new Date();
      const startTime = parse(slot.startTime, "HH:mm", defaultDate);
      const endTime = parse(slot.endTime, "HH:mm", defaultDate);
      formattedTime = `${format(startTime, "h:mm a")} - ${format(
        endTime,
        "h:mm a"
      )}`;
    }

    return {
      date: formattedDates,
      time: formattedTime,
    };
  } catch (error) {
    console.error("Error formatting meeting date/time:", error);
    return { date: "Error", time: "Error" };
  }
};
