"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCog, CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeetingMangeForm from "./MeetingCUForm";

import { IMeetingCUDialogProps } from "@/types/meeting-cu-dialog";

const MeetingCUDialog = ({
  manageType,
  meetingData,
}: IMeetingCUDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          {manageType === "create" ? (
            <CalendarPlus className="size-4" />
          ) : (
            <CalendarCog className="size-4" />
          )}
          {manageType === "create" ? "Create Meeting" : "Edit Meeting"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-[625px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {manageType === "create" ? "Create Meeting" : "Edit Meeting"}
          </DialogTitle>
          <DialogDescription>
            {manageType === "create"
              ? "Schedule new meeting in just one minute!"
              : "Edit your meeting details"}
          </DialogDescription>
          <MeetingMangeForm
            onClose={() => setIsOpen(false)}
            meetingData={meetingData}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingCUDialog;
