"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDays,
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import {
  DATE_TYPE,
  MEETING_STATUS,
  MEETING_TYPE,
} from "@/components/utils/constant";
import {
  filterCurrentWeekDates,
  normalizeDate,
} from "@/components/utils/helper/meeting-cu-form";
import { IMeetingCUForm } from "@/types/meeting-cu-form";
import { toast } from "sonner";
import { formSchema, steps, timeOptions, weekDays } from "./constant";

const MeetingCUForm = ({ onClose, meetingData }: IMeetingCUForm) => {
  const { session } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: meetingData?.title || "",
      meetingType: meetingData?.meetingType || MEETING_TYPE.INPERSON,
      description: meetingData?.description || "",
      location: meetingData?.location || "",
      note: meetingData?.note || "",

      dateType: meetingData?.dateType || DATE_TYPE.WEEKLY,
      proposedDates: meetingData?.proposedDates
        ? meetingData.proposedDates.map((date) => new Date(date))
        : [],
      startTime: meetingData?.startTime || "08:00",
      endTime: meetingData?.endTime || "19:00",
    },
  });

  // compare form value to set isAllDay
  useEffect(() => {
    if (meetingData) {
      const isAllDay =
        meetingData.startTime === "00:00" && meetingData.endTime === "23:30";
      setIsAllDay(isAllDay);
    }
  }, [meetingData]);

  //debug form
  useEffect(() => {
    if (form.formState.errors) {
      console.log(form.formState.errors);
      console.log(meetingData);
    }
  }, [form.formState.errors]);

  const handleDateTypeChange = (dateType: string) => {
    if (dateType === DATE_TYPE.WEEKLY) {
      const currentProposedDates = form.getValues("proposedDates");
      const filteredDates = filterCurrentWeekDates(currentProposedDates);
      form.setValue("proposedDates", filteredDates);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(session);
    if (!session?.user?.id) {
      console.error("No user session found");
      return;
    }

    setIsLoading(true);

    const createMeetingData = {
      title: values.title,
      description: values.description,
      meetingType: values.meetingType,
      location: values.location,
      note: values.note,
      dateType: values.dateType,
      proposedDates: values.proposedDates.map(normalizeDate),
      startTime: values.isAllDay ? "00:00" : values.startTime,
      endTime: values.isAllDay ? "23:30" : values.endTime,
      status: MEETING_STATUS.PUBLISHED,

      availableSlots: values.proposedDates.map((date) => ({
        date: normalizeDate(date),
        startTime: values.isAllDay ? "00:00" : values.startTime,
        endTime: values.isAllDay ? "23:30" : values.endTime,
        timeZone: session.user.timeZone,
      })),

      participants: [
        {
          userId: session?.user?.id,
          role: "OWNER",
          responseStatus: "ACCEPTED",
          timeZone: session.user.timeZone,
        },
      ],
    };

    try {
      const response = await fetch("/api/meeting", {
        method: meetingData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: meetingData
          ? JSON.stringify({ ...createMeetingData, id: meetingData.id })
          : JSON.stringify(createMeetingData),
      });

      if (response.ok) {
        const data = await response.json();
        meetingData
          ? router.refresh()
          : router.push(`/meeting/${data.meeting.id}`);

        onClose();
        meetingData
          ? toast.success("Meeting updated successfully")
          : toast.success("Meeting created successfully");
      }
    } catch (error) {
      console.error("Meeting creation failed:", error);
      meetingData
        ? toast.error("Error updating meeting")
        : toast.error("Error creating meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={steps[step]} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        {steps.map((stepName, index) => (
          <TabsTrigger
            key={stepName}
            value={stepName}
            disabled={index > step}
            className={cn(
              index < step && "text-primary",
              index === step && "bg-primary text-primary-foreground"
            )}
          >
            {stepName}
          </TabsTrigger>
        ))}
      </TabsList>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values);
          })}
          className="space-y-6 mt-6"
        >
          <TabsContent value="Basic Infos" className="space-y-4 text-left">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meeting title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meetingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meeting type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MEETING_TYPE.ONLINE}>
                          Online
                        </SelectItem>
                        <SelectItem value={MEETING_TYPE.INPERSON}>
                          In-person
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter meeting description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("meetingType") === MEETING_TYPE.ONLINE
                      ? "Online meeting URL"
                      : "Location"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        form.watch("meetingType") === MEETING_TYPE.ONLINE
                          ? "Enter online meeting URL"
                          : "Enter location"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note something for people"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="Date & Time" className="space-y-4 text-left">
            <FormField
              control={form.control}
              name="dateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDateTypeChange(value);
                    }}
                    value={field.value || DATE_TYPE.WEEKLY}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DATE_TYPE.WEEKLY}>
                        In this week
                      </SelectItem>
                      <SelectItem value={DATE_TYPE.ANY}>Any date</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proposedDates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Dates</FormLabel>
                  <div className="w-full">
                    {form.watch("dateType") === DATE_TYPE.WEEKLY ? (
                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, index) => {
                          const weekStart = startOfWeek(new Date(), {
                            weekStartsOn: 1,
                          });
                          const currentDate = addDays(weekStart, index);

                          const isDisabled = isBefore(
                            currentDate,
                            startOfDay(new Date())
                          );

                          return (
                            <Button
                              key={day}
                              type="button"
                              variant={isDisabled ? "ghost" : "outline"}
                              onClick={() => {
                                if (!isDisabled) {
                                  const currentDates = field.value || [];
                                  const dateIndex = currentDates.findIndex(
                                    (d) => isSameDay(d, currentDate)
                                  );

                                  const newDates =
                                    dateIndex !== -1
                                      ? currentDates.filter(
                                          (d) => !isSameDay(d, currentDate)
                                        )
                                      : [...currentDates, currentDate];

                                  field.onChange(newDates);
                                }
                              }}
                              disabled={isDisabled}
                              className={cn(
                                field.value?.some((d) =>
                                  isSameDay(d, currentDate)
                                )
                                  ? "bg-primary text-primary-foreground"
                                  : "",
                                isDisabled &&
                                  "text-muted-foreground cursor-not-allowed"
                              )}
                            >
                              {day}
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <Calendar
                        mode="multiple"
                        selected={
                          field.value.length > 0
                            ? field.value.map((date) => new Date(date))
                            : meetingData?.proposedDates
                            ? meetingData.proposedDates.map(
                                (date) => new Date(date)
                              )
                            : []
                        }
                        onSelect={field.onChange}
                        className="rounded-md border w-full"
                        disabled={(date) => date < new Date()}
                        classNames={{
                          months:
                            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1 text-center",
                          month: "space-y-4 w-full flex flex-col",
                          table: "w-full h-full border-collapse space-y-1",
                          head_row: "",
                          row: "w-full mt-2",
                        }}
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={isAllDay}
                      onCheckedChange={(checked) => {
                        setIsAllDay(checked as boolean);
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>All Day</FormLabel>
                    <FormDescription>
                      This will set the time from 00:00 to 23:30
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {!isAllDay && (
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Available Start Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Available End Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </TabsContent>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
            >
              Previous
            </Button>
            {step === steps.length - 1 ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {meetingData ? "Updating" : "Creating"} Meeting
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStep((prev) => prev + 1);
                }}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Tabs>
  );
};

export default MeetingCUForm;
