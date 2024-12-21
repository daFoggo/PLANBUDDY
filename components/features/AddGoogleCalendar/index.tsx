"use client";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/dashboard";
import { SiGooglecalendar } from "react-icons/si";

const AddGoogleCalendar = ({}: { user: IUser }) => {
  return (
    <Button
      variant="outline"
      className="border-primary text-primary bg-primary/20 hover:text-primary hover:bg-primary/30"
    >
      Add to Google Calendar
      <SiGooglecalendar className="size-4" />
    </Button>
  );
};

export default AddGoogleCalendar;
