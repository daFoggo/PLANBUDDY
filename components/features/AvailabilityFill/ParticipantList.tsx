"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { IMeetingParticipant } from "@/types/dashboard";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Loader2, UserRoundX, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ParticipantList = ({
  participants,
  isOwner,
}: {
  participants: IMeetingParticipant[];
  isOwner: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Users className="size-4" />
        <h1 className="font-semibold text-xl">Participants</h1>
      </div>

      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
        {participants.map((participant) => (
          <Participant
            key={participant?.id}
            participant={participant}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;

const Participant = ({
  participant,
  isOwner,
}: {
  participant: IMeetingParticipant;
  isOwner: boolean;
}) => {
  const { status } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteParticipant = async () => {
    setIsLoading(true);
    if (participant.role === "OWNER") {
      toast.error("You are the owner of the meeting");
      setIsDialogOpen(false);
    } else {
      try {
        const response = await fetch(
          `/api/meeting?meetingId=${participant.meetingId}&participantId=${participant.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Participant deleted successfully");
          setIsDialogOpen(false);
          router.refresh();
        }
      } catch (error) {
        toast.error("Failed to delete participant");
        console.error(error); 
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center hover:cursor-pointer">
      <Avatar
        key={participant?.user.id}
        className="h-6 w-6 border-2 border-background"
      >
        <AvatarImage
          src={participant?.user.image}
          alt={participant?.user.name}
        />
        <AvatarFallback>{participant?.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className={`font-semibold text-sm`}>{participant?.user.name}</span>
      {status === "authenticated" && isOwner && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <UserRoundX className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="w-[95%] sm:w-[625px] rounded-lg"
          >
            <DialogTitle>Delete confirm</DialogTitle>
            <DialogDescription></DialogDescription>
            <p>Are you sure you want to delete this participant?</p>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDeleteParticipant}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
