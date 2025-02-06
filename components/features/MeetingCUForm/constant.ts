import { DATE_TYPE, MEETING_TYPE } from "@/components/utils/constant";
import { z } from "zod";

export const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  meetingType: z.enum([MEETING_TYPE.ONLINE, MEETING_TYPE.INPERSON]),
  location: z.string().optional(),
  note: z.string().optional(),

  dateType: z.enum([DATE_TYPE.WEEKLY, DATE_TYPE.ANY]),
  proposedDates: z.array(z.date()).min(1, "At least one date is required"),
  participants: z
    .array(
      z.object({
        userId: z.string(),
        role: z.string(),
        responseStatus: z.string(),
        timeZone: z.string().optional(),
      })
    )
    .min(1, { message: "At least one participant is required" }),
  availableSlots: z
    .array(
      z.object({
        date: z.date(),
        startTime: z.string(),
        endTime: z.string(),
        timeZone: z.string(),
      })
    )
    .optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().optional().default(false),
});
