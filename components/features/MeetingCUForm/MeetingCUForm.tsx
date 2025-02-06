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
import { enUS, vi } from "date-fns/locale";
import { Loader2 } from "lucide-react";

import {
  DATE_TYPE,
  MEETING_STATUS,
  MEETING_TYPE,
  PARTICIPANT_ROLE,
  RESPONSE_STATUS,
} from "@/components/utils/constant";
import {
  filterCurrentWeekDates,
  normalizeDate,
} from "@/components/utils/helper/meeting-cu-form";
import { IMeetingCUForm } from "@/types/meeting-cu-form";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { formSchema, timeOptions } from "./constant";

const MeetingCUForm = ({ onClose, meetingData }: IMeetingCUForm) => {
  const { session } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  const currentLocale = useLocale();
  const dateLocale = currentLocale === "vi" ? vi : enUS;
  const t = useTranslations("Navbar.MeetingCUDialog.MeetingCUForm");
  const steps = [t("steps.step1"), t("steps.step2")];
  const weekDays = [
    t("weekDays.2"),
    t("weekDays.3"),
    t("weekDays.4"),
    t("weekDays.5"),
    t("weekDays.6"),
    t("weekDays.7"),
    t("weekDays.1"),
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: meetingData?.title || "",
      meetingType: meetingData?.meetingType || MEETING_TYPE.INPERSON,
      description: meetingData?.description || "",
      location: meetingData?.location || "",
      note: meetingData?.note || "",

      dateType: meetingData?.dateType || DATE_TYPE.WEEKLY,
      proposedDates: meetingData?.proposedDates?.map(normalizeDate) || [],
      startTime: meetingData?.startTime || "08:00",
      endTime: meetingData?.endTime || "19:00",
      participants: meetingData?.participants || [
        {
          userId: session?.user?.id,
          role: PARTICIPANT_ROLE.OWNER,
          responseStatus: RESPONSE_STATUS.ACCEPTED,
          timeZone: session?.user?.timeZone || undefined,
        },
      ],
    },
  });

  // compare form value to set isAllDay
  useEffect(() => {
    if (meetingData) {
      const isAllDay =
        meetingData.startTime === "00:00" && meetingData.endTime === "23:30";
      setIsAllDay(isAllDay);
      form.setValue("isAllDay", isAllDay);
    }
  }, [meetingData, form]);

  //debug form
  // useEffect(() => {
  //   if (form.formState.errors) {
  //     console.log(form.formState.errors);
  //     console.log(meetingData);
  //   }
  // }, [form.formState.errors]);

  const handleDateTypeChange = (dateType: string) => {
    if (dateType === DATE_TYPE.WEEKLY) {
      const currentProposedDates = form.getValues("proposedDates");
      const filteredDates = filterCurrentWeekDates(currentProposedDates);
      form.setValue("proposedDates", filteredDates);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user?.id) {
      console.error("No user session found");
      return;
    }

    setIsLoading(true);

    try {
      const body = meetingData
        ? {
            id: meetingData?.id,
            ...values,
          }
        : {
            ...values,
            availableSlots:
              //@ts-expect-error meetingData.availableSlots might be undefined but is handled in the fallback
              meetingData?.availableSlots ||
              values.proposedDates.map((date) => ({
                date: normalizeDate(date),
                startTime: values.isAllDay ? "00:00" : values.startTime,
                endTime: values.isAllDay ? "23:30" : values.endTime,
                timeZone: session.user.timeZone,
              })),
            status: MEETING_STATUS.PUBLISHED,
          };

      const response = await fetch("/api/meeting", {
        method: meetingData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        if (meetingData) {
          router.refresh();
        } else {
          router.push(`/meeting/${data.meeting.id}`);
        }

        onClose();

        toast.success(
          meetingData ? t("toast.success.create") : t("toast.success.update")
        );
      }
    } catch (error) {
      console.error("Meeting creation failed:", error);
      toast.error(
        meetingData ? t("toast.error.create") : t("toast.error.update")
      );
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <TabsContent value={t("steps.step1")} className="space-y-4 text-left">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.title.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.title.placeholder")}
                      {...field}
                    />
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
                  <FormLabel>{t("form.meetingType.label")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.meetingType.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MEETING_TYPE.ONLINE}>
                          {t("form.meetingType.select.online")}
                        </SelectItem>
                        <SelectItem value={MEETING_TYPE.INPERSON}>
                          {t("form.meetingType.select.inperson")}
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
                  <FormLabel>{t("form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.description.placeholder")}
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
                      ? t("form.location.label.online")
                      : t("form.location.label.inperson")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        form.watch("meetingType") === MEETING_TYPE.ONLINE
                          ? t("form.location.placeholder.online")
                          : t("form.location.placeholder.inperson")
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
                  <FormLabel>{t("form.note.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.note.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value={t("steps.step2")} className="space-y-4 text-left">
            <FormField
              control={form.control}
              name="dateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.dateType.label")}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDateTypeChange(value);
                    }}
                    value={field.value || DATE_TYPE.WEEKLY}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.dateType.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DATE_TYPE.WEEKLY}>
                        {t("form.dateType.select.weekly")}
                      </SelectItem>
                      <SelectItem value={DATE_TYPE.ANY}>
                        {t("form.dateType.select.any")}
                      </SelectItem>
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
                  <FormLabel>{t("form.proposeDates.label")}</FormLabel>
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
                        locale={dateLocale}
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
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={isAllDay}
                      onCheckedChange={(checked) => {
                        setIsAllDay(checked as boolean);
                        form.setValue("isAllDay", checked as boolean);
                        if (checked) {
                          form.setValue("startTime", "00:00");
                          form.setValue("endTime", "23:30");
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("form.isAllDay.label")}</FormLabel>
                    <FormDescription>
                      {t("form.isAllDay.description")}
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
                      <FormLabel>{t("form.startTime.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("form.startTime.placeholder")}
                            />
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
                      <FormLabel>{t("form.endTime.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("form.endTime.placeholder")}
                            />
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
              {t("form.button.previous")}
            </Button>
            {step === steps.length - 1 ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {meetingData
                      ? t("form.button.update")
                      : t("form.button.create")}
                  </>
                ) : (
                  t("form.button.submit")
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
                {t("form.button.next")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Tabs>
  );
};

export default MeetingCUForm;
