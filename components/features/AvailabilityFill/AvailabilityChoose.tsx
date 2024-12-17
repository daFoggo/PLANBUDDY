"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IMeeting } from "@/types/dashboard";
import { Loader2, Lock, LockOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ParticipantList from "./ParticipantList";
const AvailabilityChoose = ({
  meeting,
  isOwner,
}: {
  meeting: IMeeting;
  isOwner: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Lock meeting
  const handleLockMeeting = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/meeting?meetingId=${meeting.id}&action=lock`,
        { method: "PATCH" }
      );

      if (response.ok) {
        toast.success("Meeting locked successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error locking meeting");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Unlock meeting
  const handleUnlockMeeting = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/meeting?meetingId=${meeting.id}&action=unlock`,
        { method: "PATCH" }
      );

      if (response.ok) {
        toast.success("Meeting unlocked successfully");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardContent className="p-0 flex flex-col gap-4">
        <ParticipantList
          participants={meeting.participants}
          isOwner={isOwner}
        />
        <Separator />
      </CardContent>
    </Card>
  );
};

export default AvailabilityChoose;
