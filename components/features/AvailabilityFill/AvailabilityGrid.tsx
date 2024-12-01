"use client";

import React, { useState, useMemo } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

import { Pencil, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SLOT_STATUS } from "@/components/utils/constant";

import { ITimeSlot } from "@/types/availability-fill";
import { getStatusColor } from "@/components/utils/helper/availability-fill";

const AvailabilityGrid = () => {
  const [isEditing, setIsEditing] = useState(false);
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
  const [date, setDate] = useState<Date>(new Date());

  const timeSlots: ITimeSlot[] = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({
          time: format(new Date().setHours(hour, minute), "HH:mm"),
          status: [
            SLOT_STATUS.UNAVAILABLE,
            SLOT_STATUS.UNAVAILABLE,
            SLOT_STATUS.UNAVAILABLE,
          ],
        });
      }
    }
    return slots;
  }, []);

  const [availability, setAvailability] = useState<ITimeSlot[]>(timeSlots);

  const weekStart = startOfWeek(date);
  const days = [0, 1, 2].map((offset) => addDays(weekStart, offset));

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
      case SLOT_STATUS.TENTATIVE:
        return SLOT_STATUS.UNAVAILABLE;
      case SLOT_STATUS.UNAVAILABLE:
        return selectedStatus;
      default:
        return SLOT_STATUS.UNAVAILABLE;
    }
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

  const updateSlotStatus = (
    rowIndex: number,
    colIndex: number,
    status?: SLOT_STATUS
  ) => {
    const newAvailability = [...availability];
    newAvailability[rowIndex].status[colIndex] = status ?? selectedStatus;
    setAvailability(newAvailability);
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
        <CardTitle>Fill your availability</CardTitle>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit your availability
            </Button>
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
              <Button onClick={() => setIsEditing(false)}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center space-y-4">
        {isEditing ? (
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
                  <SelectItem value={SLOT_STATUS.TENTATIVE}>
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-500 w-3 h-3 rounded-full" />
                      Tentative
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
        ) : (
          <div className="flex space-x-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 w-3 h-3 rounded-full" />
              Available
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-500 w-3 h-3 rounded-full" />
              Unavailable
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500 w-3 h-3 rounded-full" />
              Tentative
            </div>
          </div>
        )}

        <div
          className="relative border rounded-lg overflow-hidden w-full select-none"
          onMouseLeave={handleMouseUp}
        >
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] border-b bg-muted dark:bg-background">
            <div className="p-2 font-medium text-center"></div>
            {days.map((day, index) => (
              <div key={index} className="p-2 font-medium text-center border-l">
                <div>{format(day, "EEE")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(day, "d MMM")}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[80px_1fr_1fr_1fr]">
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
                  const inDragSelection = isInDragSelection(rowIndex, colIndex);
                  return (
                    <div
                      key={colIndex}
                      className={cn(
                        "border-l relative",
                        rowIndex % 2 === 0 && "border-t",
                        "transition-colors duration-100",
                        getStatusColor(status, inDragSelection)
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
    </Card>
  );
};

export default AvailabilityGrid;
