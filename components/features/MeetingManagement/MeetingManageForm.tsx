"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, isSameDay, startOfWeek, parse, set } from "date-fns";

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
import { timeOptions, steps, weekDays } from "./constant";
import { IMeetingManageForm } from "@/types/meeting-manage-form";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    meetingType: z.string().min(1, "Meeting type is required"),
    onlineMeetingUrl: z.string().optional(),
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
    isAllDay: z.boolean().optional(),
    dateType: z.string().optional(),
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

const MeetingManageForm = ({ onClose }: IMeetingManageForm) => {
  const { session } = useAuth();

  const [step, setStep] = useState(0);
  const [isAllDay, setIsAllDay] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      meetingType: "",
      onlineMeetingUrl: "",
      description: "",
      location: "",
      note: "",
      startTime: "",
      endTime: "",
      dates: [],
      participants: session?.user?.id ? [session.user.id] : [],
      isAllDay: false,
      dateType: "",
    },
  });
  useEffect(() => {
    if (isAllDay) {
      form.setValue("startTime", "00:00");
      form.setValue("endTime", "23:59");
    } else {
      form.setValue("startTime", "");
      form.setValue("endTime", "");
    }
  }, [isAllDay, form]);

  const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const meetingData = {
      ...values,
      dates: values.dates.map((date) => ({
        date: date.getTime(),
      })),
    };

    try {
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Meeting Created:", data);
      }
      onClose();
    } catch (error) {
      console.error("Meeting creation failed:", error);
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
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("meetingType") === "online" && (
              <FormField
                control={form.control}
                name="onlineMeetingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online Meeting URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter online meeting URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meeting location" {...field} />
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
                  <FormLabel>Date Selection Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="specificDates">
                        Specific Dates
                      </SelectItem>
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
                          return (
                            <Button
                              type="button"
                              key={day}
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => {
                                const newDates = isSelected
                                  ? field.value.filter(
                                      (d) => !isSameDay(d, date)
                                    )
                                  : [...field.value, date];
                                field.onChange(newDates);
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
                      This will set the time from 00:00 to 23:59
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
              <Button type="submit">Submit</Button>
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
