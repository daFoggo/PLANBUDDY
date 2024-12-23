"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IMeeting } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ParticipantList from "./ParticipantList";

interface AvailabilityChooseProps {
  meeting: IMeeting;
  isOwner: boolean;
}

const AvailabilityChoose = ({ meeting, isOwner }: AvailabilityChooseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      toast.error("Error unlocking meeting"); // Added error toast
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
        {isOwner && (
          <div className="flex justify-end gap-2">
            <Button
              variant={meeting.isLocked ? "default" : "secondary"}
              onClick={meeting.isLocked ? handleUnlockMeeting : handleLockMeeting}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : meeting.isLocked
                ? "Unlock Meeting"
                : "Lock Meeting"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityChoose;