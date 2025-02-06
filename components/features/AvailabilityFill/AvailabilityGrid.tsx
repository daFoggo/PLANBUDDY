"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SLOT_STATUS, USER_TYPE } from "@/components/utils/constant";
import {
  getHourDecimal,
  isInSelection,
} from "@/components/utils/helper/availability-fill";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ITimeSlot } from "@/types/availability-fill";
import { IAvailableSlot, IMeeting } from "@/types/dashboard";
import { format } from "date-fns";
import {
  Loader2,
  Pencil,
  RefreshCcw,
  SquarePlus,
  Terminal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddGoogleCalendar from "../AddGoogleCalendar";
import LoginDialogContent from "../Auth/LoginDialogContent";

const AvailabilityGrid = ({
  meeting,
}: {
  meeting: IMeeting;
  isOwner: boolean;
}) => {
  const t = useTranslations("Availability.AvailabilityGrid");
  const router = useRouter();
  const { status, session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<SLOT_STATUS>(
    SLOT_STATUS.AVAILABLE
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ row: number; col: number } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnlyMatchingTime, setShowOnlyMatchingTime] = useState(false);
  const [isGgCalendarSelecting, setIsGgCalendarSelecting] = useState(false);
  const [isGgCalendarDragging, setIsGgCalendarDragging] = useState(false);
  const [ggcalendarSelection, setGgCalendarSelection] = useState<{
    start: { row: number; col: number } | null;
    end: { row: number; col: number } | null;
  }>({
    start: null,
    end: null,
  });

  // Render table
  const gridTemplateColumns = useMemo(() => {
    return `80px ${meeting.proposedDates.map(() => "1fr").join(" ")}`;
  }, [meeting.proposedDates]);

  // Common slot from all users
  const commonSlotStatuses = useCallback(
    (slots: ITimeSlot[], availableSlots: IAvailableSlot[]): ITimeSlot[] => {
      const commonSlots = [...slots];

      const totalUsers = new Set(
        availableSlots.map((slot: { userId: string }) => slot.userId)
      ).size;

      commonSlots.forEach((slot) => {
        slot.status = slot.status.map((_, dateIndex) => {
          const positiveAvailableUserCount = availableSlots.filter(
            (s: {
              startTime: string;
              date: string | number | Date;
              status: string;
            }) =>
              s.startTime === slot.time &&
              format(new Date(s.date), "yyyy-MM-dd") ===
                format(
                  new Date(meeting.proposedDates[dateIndex]),
                  "yyyy-MM-dd"
                ) &&
              (s.status === "AVAILABLE" || s.status === "IFNEEDED")
          ).length;

          if (positiveAvailableUserCount === totalUsers) {
            return SLOT_STATUS.AVAILABLE; // All users available or if needed
          } else if (positiveAvailableUserCount > 0) {
            return SLOT_STATUS.IFNEEDED; // Some users available or if needed
          } else {
            return SLOT_STATUS.UNAVAILABLE; // No users available
          }
        });
      });

      return commonSlots;
    },
    [meeting.proposedDates]
  );

  // Render time slot with status
  const timeSlots: ITimeSlot[] = useMemo(() => {
    const slots = [];
    const startHour = getHourDecimal(meeting.startTime);
    const endHour = getHourDecimal(meeting.endTime);

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        slots.push({
          time: format(new Date().setHours(hour, minute), "HH:mm"),
          status: meeting.proposedDates.map(() => SLOT_STATUS.UNAVAILABLE),
        });
      }
    }

    if (endHour % 1 === 0) {
      slots.push({
        time: format(new Date().setHours(endHour, 0), "HH:mm"),
        status: meeting.proposedDates.map(() => SLOT_STATUS.UNAVAILABLE),
      });
    }

    return slots;
  }, [meeting.startTime, meeting.endTime, meeting.proposedDates]);

  const [availability, setAvailability] = useState<ITimeSlot[]>(timeSlots);

  // Render slot color
  const getSlotColor = (
    status: SLOT_STATUS,
    inDragSelection: boolean,
    rowIndex?: number,
    colIndex?: number
  ) => {
    if (
      isGgCalendarSelecting &&
      ggcalendarSelection.start &&
      ggcalendarSelection.end &&
      typeof rowIndex === "number" &&
      typeof colIndex === "number"
    ) {
      const isInCalendarSelection = isInSelection(
        rowIndex,
        colIndex,
        ggcalendarSelection.start,
        ggcalendarSelection.end
      );
      if (isInCalendarSelection) {
        return "bg-primary/30";
      }
    }

    if (showOnlyMatchingTime && status !== SLOT_STATUS.AVAILABLE) {
      return "bg-transparent";
    }

    if (inDragSelection) {
      switch (status) {
        case SLOT_STATUS.AVAILABLE:
          return "bg-green-500/30 dark:bg-green-500/20";
        case SLOT_STATUS.IFNEEDED:
          return "bg-yellow-500/30 dark:bg-yellow-500/20";
        case SLOT_STATUS.UNAVAILABLE:
          return "bg-red-500/30 dark:bg-red-500/20";
        default:
          return "";
      }
    }

    switch (status) {
      case SLOT_STATUS.AVAILABLE:
        return "bg-green-500"; // All users available
      case SLOT_STATUS.IFNEEDED:
        return isEditing ? "bg-yellow-500" : "bg-green-300"; // Some users available
      case SLOT_STATUS.UNAVAILABLE:
        return isEditing ? "bg-red-500/50" : "";
      default:
        return "bg-gray-200";
    }
  };

  // Map data to table
  useEffect(() => {
    let initialAvailability = timeSlots.map((slot) => ({
      ...slot,
      status: meeting.proposedDates.map(() => SLOT_STATUS.UNAVAILABLE),
    }));

    if (meeting.availableSlots && meeting.availableSlots.length > 0) {
      // Default view: common slots
      if (!isEditing) {
        initialAvailability = commonSlotStatuses(
          initialAvailability,
          meeting.availableSlots
        );
      }
      // Edit view: user's slots
      else {
        const userSlots = meeting.availableSlots.filter(
          (slot) => slot.userId === session?.user?.id
        );

        userSlots.forEach((slot) => {
          const dateIndex = meeting.proposedDates.findIndex(
            (proposedDate) =>
              format(new Date(proposedDate), "yyyy-MM-dd") ===
              format(new Date(slot.date), "yyyy-MM-dd")
          );

          if (dateIndex !== -1) {
            const slotTime = slot.startTime;
            const matchingSlotIndex = initialAvailability.findIndex(
              (availSlot) => availSlot.time === slotTime
            );

            if (matchingSlotIndex !== -1) {
              initialAvailability[matchingSlotIndex].status[dateIndex] =
                slot.status === "AVAILABLE"
                  ? SLOT_STATUS.AVAILABLE
                  : slot.status === "IFNEEDED"
                  ? SLOT_STATUS.IFNEEDED
                  : SLOT_STATUS.UNAVAILABLE;
            }
          }
        });
      }
    }

    setAvailability(initialAvailability);
  }, [
    isEditing,
    meeting.availableSlots,
    session?.user?.id,
    meeting.proposedDates,
    commonSlotStatuses,
    timeSlots,
  ]);

  useEffect(() => {
    return () => {
      setIsGgCalendarDragging(false);
      setGgCalendarSelection({ start: null, end: null });
    };
  }, []);

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    try {
      const availabilitySlots = [];
      for (let i = 0; i < availability.length; i++) {
        for (let j = 0; j < meeting.proposedDates.length; j++) {
          availabilitySlots.push({
            meetingId: meeting.id,
            userId: session?.user?.id,
            date: meeting.proposedDates[j],
            startTime: availability[i].time,
            endTime: format(
              new Date().setHours(
                parseInt(availability[i].time.split(":")[0]),
                parseInt(availability[i].time.split(":")[1]) + 30
              ),
              "HH:mm"
            ),
            status:
              availability[i].status[j] === SLOT_STATUS.AVAILABLE
                ? "AVAILABLE"
                : availability[i].status[j] === SLOT_STATUS.IFNEEDED
                ? "IFNEEDED"
                : "UNAVAILABLE",
          });
        }
      }

      const response = await fetch(`/api/meeting?meetingId=${meeting.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availabilitySlots),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error saving availability:", error);
        throw new Error(`Error saving availability: ${error.error}`);
      }
      router.refresh();
      toast.success(t("toast.save.success"));
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error(t("toast.save.error"));
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const determineNextStatus = (currentStatus: SLOT_STATUS): SLOT_STATUS => {
    switch (currentStatus) {
      case SLOT_STATUS.AVAILABLE:
        return SLOT_STATUS.UNAVAILABLE;
      case SLOT_STATUS.IFNEEDED:
        return SLOT_STATUS.UNAVAILABLE;
      case SLOT_STATUS.UNAVAILABLE:
        return selectedStatus;
      default:
        return SLOT_STATUS.UNAVAILABLE;
    }
  };

  const updateSlotStatus = (
    rowIndex: number,
    colIndex: number,
    status?: SLOT_STATUS
  ) => {
    const newAvailability = [...availability];
    newAvailability[rowIndex].status[colIndex] = status ?? selectedStatus;
    setAvailability(newAvailability);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    if (!isEditing && !isGgCalendarSelecting) return;

    if (isGgCalendarSelecting) {
      setIsGgCalendarDragging(true);
      setGgCalendarSelection({
        start: { row: rowIndex, col: colIndex },
        end: { row: rowIndex, col: colIndex },
      });
    } else {
      setIsDragging(true);
      setDragStart({ row: rowIndex, col: colIndex });
      setDragEnd({ row: rowIndex, col: colIndex });

      const currentStatus = availability[rowIndex].status[colIndex];
      const newStatus = determineNextStatus(currentStatus);
      updateSlotStatus(rowIndex, colIndex, newStatus);
    }
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isGgCalendarSelecting && isGgCalendarDragging) {
      setGgCalendarSelection({
        ...ggcalendarSelection,
        end: { row: rowIndex, col: colIndex },
      });
      return;
    }

    if (!isDragging) return;

    setDragEnd({ row: rowIndex, col: colIndex });

    const startRow = Math.min(dragStart?.row ?? rowIndex, rowIndex);
    const endRow = Math.max(dragStart?.row ?? rowIndex, rowIndex);
    const startCol = Math.min(dragStart?.col ?? colIndex, colIndex);
    const endCol = Math.max(dragStart?.col ?? colIndex, colIndex);

    const newAvailability = [...availability];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        newAvailability[r].status[c] = selectedStatus;
      }
    }

    setAvailability(newAvailability);
  };

  const handleMouseUp = () => {
    if (isGgCalendarSelecting) {
      setIsGgCalendarDragging(false);
      return;
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const isInDragSelection = (rowIndex: number, colIndex: number) => {
    if (!isDragging || !dragStart || !dragEnd) return false;

    const startRow = Math.min(dragStart.row, dragEnd.row);
    const endRow = Math.max(dragStart.row, dragEnd.row);
    const startCol = Math.min(dragStart.col, dragEnd.col);
    const endCol = Math.max(dragStart.col, dragEnd.col);

    return (
      rowIndex >= startRow &&
      rowIndex <= endRow &&
      colIndex >= startCol &&
      colIndex <= endCol
    );
  };

  const handleCalendarSelectionStart = () => {
    setIsGgCalendarSelecting(true);
  };

  const handleCalendarSelectionEnd = () => {
    setIsGgCalendarSelecting(false);
    setGgCalendarSelection({ start: null, end: null });
  };

  return (
    <Card className="col-span-2 p-4 space-y-4">
      <CardHeader className="p-0 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="gap-2">
          <CardTitle className="flex items-center gap-2">
            {t("card.title")}
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-primary/30 hover:text-primary"
                    onClick={() => {
                      setIsRefreshing(true);
                      try {
                        router.refresh();
                      } catch (error) {
                        console.error("Error refreshing page:", error);
                        toast.error(t("toast.refresh.error"));
                      } finally {
                        setIsRefreshing(false);
                        toast.success(t("toast.refresh.success"));
                      }
                    }}
                  >
                    {isRefreshing ? (
                      <RefreshCcw className="size-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border-primary">
                  {t("card.tooltip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            {meeting.participants.length > 1 ? t("card.description") : ""}
          </CardDescription>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            status === "authenticated" ? (
              <Button
                onClick={() => {
                  setShowOnlyMatchingTime(false);
                  setIsEditing(true);
                }}
              >
                <Pencil className="mr-2 size-4" />
                {t("card.button.edit")}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                <SquarePlus className="mr-2 size-4" />
                {t("card.button.add")}
              </Button>
            )
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setAvailability(timeSlots);
                }}
                className="border-red-500 text-red-500 bg-red-500/20 hover:bg-red-500/30 hover:text-red-500"
              >
                {t("card.button.cancel")}
              </Button>
              <Button onClick={handleSaveAvailability} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t("card.button.saving")}
                  </>
                ) : (
                  t("card.button.save")
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-start sm:items-center space-y-4">
        {!isEditing && (
          <div className="flex items-center space-x-2">
            <Switch
              id="show-matching-time"
              checked={showOnlyMatchingTime}
              onCheckedChange={setShowOnlyMatchingTime}
            />
            <Label htmlFor="show-matching-time">{t("card.switch")}</Label>
          </div>
        )}
        {isEditing && (
          <div className="flex justify-center items-center gap-2">
            <p className="font-semibold shrink-0">{t("card.select.title")}</p>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as SLOT_STATUS)}
              defaultValue={SLOT_STATUS.AVAILABLE}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("card.select.label")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("card.select.label")}</SelectLabel>
                  <SelectItem value={SLOT_STATUS.AVAILABLE}>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-3 h-3 rounded-full" />
                      {t("card.select.items.available")}
                    </div>
                  </SelectItem>
                  <SelectItem value={SLOT_STATUS.IFNEEDED}>
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-500 w-3 h-3 rounded-full" />
                      {t("card.select.items.ifNeeded")}
                    </div>
                  </SelectItem>
                  <SelectItem value={SLOT_STATUS.UNAVAILABLE}>
                    <div className="flex items-center gap-2">
                      <div className="bg-red-500 w-3 h-3 rounded-full" />
                      {t("card.select.items.unavailable")}
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <div
          className="relative border rounded-lg overflow-hidden w-full select-none"
          onMouseLeave={handleMouseUp}
        >
          <div
            className={`grid border-b bg-muted dark:bg-background`}
            style={{ gridTemplateColumns: gridTemplateColumns }}
          >
            <div className="p-2 font-medium text-center"></div>
            {meeting.proposedDates.map((day, index) => (
              <div key={index} className="p-2 font-medium text-center border-l">
                <div>{format(day, "EEE")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(day, "d MMM")}
                </div>
              </div>
            ))}
          </div>

          <div
            className="grid"
            style={{ gridTemplateColumns: gridTemplateColumns }}
          >
            {availability.map((slot, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div
                  className={cn(
                    "p-2 text-sm text-center border-r bg-muted dark:bg-background",
                    rowIndex % 2 === 0 && "border-t"
                  )}
                >
                  {slot.time}
                </div>

                {slot.status.map((status, colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      className={cn(
                        "border-l relative",
                        rowIndex % 2 === 0 && "border-t",
                        "transition-colors duration-100",
                        getSlotColor(
                          status,
                          isInDragSelection(rowIndex, colIndex),
                          rowIndex,
                          colIndex
                        )
                      )}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                    >
                      <div className="absolute inset-0" />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 flex flex-col gap-2">
        {isGgCalendarSelecting && (
          <Alert className="bg-red-500/10 border-red-500 text-red-500">
            <Terminal className="size-4" color="#ef4444" />
            <AlertTitle>{t("card.alert.title")}</AlertTitle>
            <AlertDescription>
              {t("card.alert.description")}
            </AlertDescription>
          </Alert>
        )}
        <div className="self-end">
          {status === "authenticated" &&
            session?.user.userType === USER_TYPE.GOOGLE_USER && (
              <AddGoogleCalendar
                meeting={meeting}
                availability={availability}
                proposedDates={meeting.proposedDates}
                onSelectionStart={handleCalendarSelectionStart}
                onSelectionEnd={handleCalendarSelectionEnd}
                selection={ggcalendarSelection}
                isSelectionValid={
                  !!ggcalendarSelection.start && !!ggcalendarSelection.end
                }
              />
            )}
        </div>
      </CardFooter>

      {/* Login popup for new participants */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95%] sm:w-[425px] rounded-lg"
        >
          <LoginDialogContent setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AvailabilityGrid;
