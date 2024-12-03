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
import { useAuth } from "@/hooks/use-auth";

const MeetingCUDialog = ({
  manageType,
  meetingData,
  isOwner,
}: IMeetingCUDialogProps) => {
  const { status } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {manageType === "create" ? (
          <Button>
            <CalendarPlus className="size-4" />
            Create Meeting
          </Button>
        ) : status === "authenticated" && isOwner ? (
          <Button>
            <CalendarCog className="size-4" />
            Edit Meeting
          </Button>
        ) : null}
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
