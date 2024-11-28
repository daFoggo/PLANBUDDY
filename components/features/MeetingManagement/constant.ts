import { z } from "zod";

export const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const steps = ["Basic Infos", "Date & Time"];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


export const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    meetingType: z.string().min(1, "Meeting type is required"),
    description: z.string().optional(),
    location: z.string().optional(),
    note: z.string().optional(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    dates: z.array(z.date()).min(1, {
      message: "Please select at least one date",
    }),
    participants: z
      .array(z.string())
      .min(1, "At least one participant is required"),
    isAllDay: z.boolean(),
    dateType: z.string(),
  })
  .refine(
    (data) => {
      if (data.isAllDay) return true;
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      return startHour * 60 + startMinute < endHour * 60 + endMinute;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );