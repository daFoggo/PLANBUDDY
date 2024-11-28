import { format, parse, parseISO } from "date-fns";
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
    if (!meeting.dateSelections || meeting.dateSelections.length === 0) {
      return { date: "TBD", time: "TBD" };
    }

    const finalDate = meeting.dateSelections.find((date) => date.isFinal);
    const dates = finalDate
      ? [finalDate.date.date]
      : meeting.dateSelections.map((date) => date.date.date);

    const parsedDates = dates
      .map((dateStr) => {
        try {
          return parseISO(dateStr);
        } catch {
          return null;
        }
      })
      .filter((date): date is Date => date !== null);

    if (parsedDates.length === 0) {
      return { date: "Invalid date", time: "Invalid time" };
    }

    const defaultDate = new Date();
    const startTime = meeting.startTime
      ? parse(meeting.startTime, "HH:mm", defaultDate)
      : null;
    const endTime = meeting.endTime
      ? parse(meeting.endTime, "HH:mm", defaultDate)
      : null;

    const formattedDates = parsedDates
      .map((date) => format(date, "MMM d"))
      .join(", ");

    const formattedTime =
      startTime && endTime
        ? `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`
        : "TBD";

    return {
      date: formattedDates,
      time: formattedTime,
    };
  } catch (error) {
    console.error("Error formatting meeting date/time:", error);
    return { date: "Error", time: "Error" };
  }
};
