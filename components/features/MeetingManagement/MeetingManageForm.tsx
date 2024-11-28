"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isSameDay, startOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

import { timeOptions, steps, weekDays, formSchema } from "./constant";
import { IMeetingManageForm } from "@/types/meeting-manage-form";
import { addDays } from "@/components/utils/helper/meeting-manage-form";
import { Loader2 } from "lucide-react";

const MeetingManageForm = ({ onClose, meetingData }: IMeetingManageForm) => {
  const { session } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [isAllDay, setIsAllDay] = useState(meetingData?.isAllDay || false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: meetingData?.title || "",
      meetingType: meetingData?.meetingType || "",
      description: meetingData?.description || "",
      location: meetingData?.location || "",
      note: meetingData?.note || "",
      startTime: meetingData?.startTime || "",
      endTime: meetingData?.endTime || "",
      dates: meetingData?.dateSelections
        ? meetingData.dateSelections.map(
            (selection) => new Date(selection.date.date)
          )
        : [],
      participants: meetingData?.participants
        ? meetingData.participants.map((participant) => participant.user.id)
        : session?.user?.id
        ? [session.user.id]
        : [],
      isAllDay: meetingData?.isAllDay || false,
      dateType: meetingData?.dateType || "specificDates",
    },
  });

  // set start and end time if all day is checked
  useEffect(() => {
    if (isAllDay) {
      form.setValue("startTime", "00:00");
      form.setValue("endTime", "23:30");
    } else {
      if (meetingData) {
        form.setValue("startTime", meetingData.startTime || "");
        form.setValue("endTime", meetingData.endTime || "");
      } else {
        form.setValue("startTime", "");
        form.setValue("endTime", "");
      }
    }
  }, [isAllDay, form, meetingData]);

  // reset if change from specificDates to thisWeek
  useEffect(() => {
    const dateType = form.watch("dateType");

    if (dateType === "thisWeek") {
      const thisWeekDates = weekDays
        .map((_, index) => addDays(startOfWeek(new Date()), index))
        .filter((date) => date >= new Date());

      form.setValue("dates", thisWeekDates);
    }
  }, [form.watch("dateType")]);

  //debug form
  useEffect(() => {
    if (form.formState.errors) {
      console.log(form.formState.errors);
    }
  }, [form.formState.errors]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const createMeetingData = {
      ...values,
      dates: values.dates.map((date) => ({
        date: date.getTime(),
      })),
    };

    try {
      const response = await fetch("/api/meeting", {
        method: meetingData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: meetingData ? JSON.stringify({ ...createMeetingData, id: meetingData.id }) : JSON.stringify(createMeetingData),
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/meeting/${data.meeting.id}`);
      }
      onClose();
    } catch (error) {
      console.error("Meeting creation failed:", error);
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
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">In-person</SelectItem>
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
                    {form.watch("meetingType") === "online"
                      ? "Online meeting URL"
                      : "Location"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        form.watch("meetingType") === "online"
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
                  <FormLabel>Time period</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "specificDates"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="thisWeek">In this Week</SelectItem>
                      <SelectItem value="specificDates">Any dates</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Dates</FormLabel>
                  <div className="w-full">
                    {form.watch("dateType") === "thisWeek" ? (
                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, index) => {
                          const date = addDays(startOfWeek(new Date()), index);
                          const isSelected = field.value.some((selectedDate) =>
                            isSameDay(selectedDate, date)
                          );
                          const isPastDay = date < new Date();

                          return (
                            <Button
                              type="button"
                              key={day}
                              variant={isSelected ? "default" : "outline"}
                              disabled={isPastDay}
                              onClick={() => {
                                if (!isPastDay) {
                                  const newDates = isSelected
                                    ? field.value.filter(
                                        (d) => !isSameDay(d, date)
                                      )
                                    : [...field.value, date];
                                  field.onChange(newDates);
                                }
                              }}
                            >
                              {day}
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <Calendar
                        mode="multiple"
                        selected={field.value}
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

export default MeetingManageForm;
