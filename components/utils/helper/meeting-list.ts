import { IMeeting } from "@/types/dashboard";
import { format, isThisWeek, Locale, parse } from "date-fns";
import { enUS, vi } from "date-fns/locale";

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "published":
      return "bg-green-400 border-green-600 dark:bg-green-700 dark:border-green-500 hover:bg-green-500 hover:border-green-700 dark:hover:bg-green-600 dark:hover:border-green-400";
    case "draft":
      return "bg-yellow-400 border-yellow-600 dark:bg-yellow-700 dark:border-yellow-500 hover:bg-yellow-500 hover:border-yellow-700 dark:hover:bg-yellow-600 dark:hover:border-yellow-400";
    case "cancelled":
      return "bg-red-400 border-red-600 dark:bg-red-700 dark:border-red-500 hover:bg-red-500 hover:border-red-700 dark:hover:bg-red-600 dark:hover:border-red-400";
    default:
      return "bg-gray-400 border-gray-600 dark:bg-gray-700 dark:border-gray-500 hover:bg-gray-500 hover:border-gray-700 dark:hover:bg-gray-600 dark:hover:border-gray-400";
  }
};

export const formatMeetingDateTime = (
  meeting: IMeeting,
  locale: string = "en-US"
) => {
  try {
    const dates = meeting.proposedDates.map((date) => new Date(date));
    const formattedDates = dates
      .map((date) => {
        if (locale === "vi-VN") {
          return formatVietnameseDate(date);
        }
        if (isThisWeek(date, { weekStartsOn: 1 })) {
          return format(date, "EEE", { locale: getLocale(locale) });
        }
        return format(date, "MMM d", { locale: getLocale(locale) });
      })
      .join(", ");

    let formattedTime = "TBD";
    const defaultDate = new Date();
    const startTime = parse(meeting.startTime, "HH:mm", defaultDate);
    const endTime = parse(meeting.endTime, "HH:mm", defaultDate);

    const midnightStart =
      startTime.getHours() === 0 && startTime.getMinutes() === 0;
    const lastMinuteEnd =
      endTime.getHours() === 23 && endTime.getMinutes() === 30;

    if (midnightStart && lastMinuteEnd) {
      formattedTime = getAllDayText(locale);
    } else {
      if (locale === "vi-VN") {
        formattedTime = `${formatVietnameseTime(
          startTime
        )} - ${formatVietnameseTime(endTime)}`;
      } else {
        const timeFormatOptions: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        const formattedStart = startTime.toLocaleTimeString(
          locale,
          timeFormatOptions
        );
        const formattedEnd = endTime.toLocaleTimeString(
          locale,
          timeFormatOptions
        );
        formattedTime = `${formattedStart} - ${formattedEnd}`;
      }
    }

    return {
      date: formattedDates,
      time: formattedTime,
    };
  } catch (error) {
    console.error("Error formatting meeting date/time:", error);
    const errorText = getErrorText(locale);
    return { date: errorText, time: errorText };
  }
};

const getAllDayText = (locale: string): string => {
  const allDayTexts: { [key: string]: string } = {
    "en-US": "All Day",
    "vi-VN": "Cả ngày",
  };
  return allDayTexts[locale] || allDayTexts["en-US"];
};

const getErrorText = (locale: string): string => {
  const errorTexts: { [key: string]: string } = {
    "en-US": "Error",
    "vi-VN": "Lỗi",
  };
  return errorTexts[locale] || errorTexts["en-US"];
};

const getLocale = (locale: string) => {
  const locales: { [key: string]: Locale } = {
    "en-US": enUS,
    "vi-VN": vi,
  };
  return locales[locale] || enUS;
};

export const localeMapping: { [key: string]: string } = {
  en: "en-US",
  vi: "vi-VN",
};

const formatVietnameseDate = (date: Date): string => {
  const day = format(date, "d");
  const month = format(date, "LL");
  return `Ngày ${day}/${month}`;
};

const formatVietnameseTime = (time: Date): string => {
  const hour = format(time, "H");
  const minute = format(time, "mm");
  return `${hour}:${minute}`;
};
