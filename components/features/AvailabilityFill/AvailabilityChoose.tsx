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
        {isOwner && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                rightIcon={
                  meeting.finalDate ? (
                    <LockOpen className="size-4" />
                  ) : (
                    <Lock className="size-4" />
                  )
                }
              >
                {meeting.finalDate
                  ? "Unlock meeting"
                  : "Lock meeting with final date"}
              </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>
                  {meeting.finalDate
                    ? "Unlock confirm"
                    : "Lock meeting with final date"}
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <p>
                {meeting.finalDate ? (
                  <>
                    Are you sure you want to unlock this meeting?
                    <br />
                    Other people will be able to join your meeting and add
                    availability.
                  </>
                ) : (
                  <>
                    Are you sure you want to lock this meeting with final date?
                    <br />
                    Other people won't be able to join your meeting and add
                    availability anymore.
                    <br />
                    You can still unlock the meeting later.
                  </>
                )}
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={
                    meeting.finalDate ? handleUnlockMeeting : handleLockMeeting
                  }
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {meeting.finalDate ? "Unlocking..." : "Locking..."}
                    </>
                  ) : meeting.finalDate ? (
                    "Unlock"
                  ) : (
                    "Lock"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityChoose;
