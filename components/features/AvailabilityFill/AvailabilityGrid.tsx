"use client";

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
import { getHourDecimal } from "@/components/utils/helper/availability-fill";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ITimeSlot } from "@/types/availability-fill";
import { IMeeting, IUser } from "@/types/dashboard";
import { format } from "date-fns";
import { Loader2, Pencil, RefreshCcw, SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import LoginDialogContent from "../Auth/LoginDialogContent";
import AddGoogleCalendar from "../AddGoogleCalendar";

const AvailabilityGrid = ({
  meeting,
  isOwner,
}: {
  meeting: IMeeting;
  isOwner: boolean;
}) => {
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

  const gridTemplateColumns = useMemo(() => {
    return `80px ${meeting.proposedDates.map(() => "1fr").join(" ")}`;
  }, [meeting.proposedDates]);

  // Common slot from all users
  const commonSlotStatuses = (
    slots: ITimeSlot[],
    availableSlots: any[]
  ): ITimeSlot[] => {
    const commonSlots = [...slots];

    // Count total number of users
    const totalUsers = new Set(availableSlots.map((slot) => slot.userId)).size;

    commonSlots.forEach((slot, slotIndex) => {
      slot.status = slot.status.map((_, dateIndex) => {
        const positiveAvailableUserCount = availableSlots.filter(
          (s) =>
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
  };

  // Create time slots based on meeting's time
  const timeSlots: ITimeSlot[] = useMemo(() => {
    const slots = [];
    const startHour = getHourDecimal(meeting.startTime);
    const endHour = getHourDecimal(meeting.endTime);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
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

  const getSlotColor = (status: SLOT_STATUS, inDragSelection: boolean) => {
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
      // Default view: aggregated statuses
      if (!isEditing) {
        initialAvailability = commonSlotStatuses(
          initialAvailability,
          meeting.availableSlots
        );
      }
      // Edit view: current user's slots
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
  ]);

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
      toast.success("Availability saved successfully");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Error saving availability. Please try again.");
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    if (!isEditing) return;

    setIsDragging(true);
    setDragStart({ row: rowIndex, col: colIndex });
    setDragEnd({ row: rowIndex, col: colIndex });

    const currentStatus = availability[rowIndex].status[colIndex];
    const newStatus = determineNextStatus(currentStatus);
    updateSlotStatus(rowIndex, colIndex, newStatus);
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

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
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

  return (
    <Card className="col-span-2 p-4 space-y-4">
      <CardHeader className="p-0 flex flex-row justify-between items-center">
        <div className="gap-2">
          <CardTitle className="flex items-center gap-2">
            Your availability
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
                        toast.error("Error refreshing page. Please try again.");
                      } finally {
                        setIsRefreshing(false);
                        toast.success("Page refreshed successfully");
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
                  Refresh page
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            {meeting.participants.length > 1
              ? "The brightest green indicates that all participants are available at that time."
              : ""}
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
                <Pencil className="mr-2 h-4 w-4" />
                Edit your availability
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                <SquarePlus className="mr-2 h-4 w-4" />
                Add your availability
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
                Cancel
              </Button>
              <Button onClick={handleSaveAvailability} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center space-y-4">
        {!isEditing && (
          <div className="flex items-center space-x-2">
            <Switch
              id="show-matching-time"
              checked={showOnlyMatchingTime}
              onCheckedChange={setShowOnlyMatchingTime}
            />
            <Label htmlFor="show-matching-time">Show only matching time</Label>
          </div>
        )}
        {isEditing && (
          <div className="flex justify-center items-center gap-2">
            <p className="font-semibold shrink-0">Availability</p>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as SLOT_STATUS)}
              defaultValue={SLOT_STATUS.AVAILABLE}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select availability</SelectLabel>
                  <SelectItem value={SLOT_STATUS.AVAILABLE}>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-3 h-3 rounded-full" />
                      Available
                    </div>
                  </SelectItem>
                  <SelectItem value={SLOT_STATUS.IFNEEDED}>
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-500 w-3 h-3 rounded-full" />
                      If needed
                    </div>
                  </SelectItem>
                  <SelectItem value={SLOT_STATUS.UNAVAILABLE}>
                    <div className="flex items-center gap-2">
                      <div className="bg-red-500 w-3 h-3 rounded-full" />
                      Unavailable
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
                          isInDragSelection(rowIndex, colIndex)
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
      <CardFooter className="p-0 flex justify-end">
        {status === "authenticated" &&
          session?.user.userType === USER_TYPE.GOOGLE_USER && (
            <AddGoogleCalendar
              meeting={meeting}
              user={session?.user as IUser}
            />
          )}
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
