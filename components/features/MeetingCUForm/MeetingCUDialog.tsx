"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarCog, CalendarPlus } from "lucide-react";
import { useState } from "react";
import MeetingCUForm from "./MeetingCUForm";

import { useAuth } from "@/hooks/use-auth";
import { IMeetingCUDialogProps } from "@/types/meeting-cu-dialog";

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
          <MeetingCUForm
            onClose={() => setIsOpen(false)}
            meetingData={meetingData}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingCUDialog;
