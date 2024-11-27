"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeetingMangeForm from "./MeetingManageForm";
import { CalendarPlus } from "lucide-react";

const MeetingManageDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarPlus className="size-4" />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-[625px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a new meeting</DialogTitle>
          <DialogDescription>
            Schedule your meeting in one minute!
          </DialogDescription>
          <MeetingMangeForm onClose={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingManageDialog;
