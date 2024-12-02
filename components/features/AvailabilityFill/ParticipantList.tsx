"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IMeetingParticipant, IUser } from "@/types/dashboard";
import { AvatarImage } from "@radix-ui/react-avatar";
import { UserRoundX, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
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
      
      <div className="flex flex-col gap-2">
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

  const handleDeleteParticipant = async () => {
    if (participant.role === "OWNER") {
      toast.error("You are the owner of the meeting");
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
        }
      } catch (error) {
        toast.error("Failed to delete participant");
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
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
      <span className="font-semibold text-sm">{participant?.user.name}</span>
      {status === "authenticated" && isOwner && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <UserRoundX className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogTitle>Delete confirm</DialogTitle>
            <p>Are you sure you want to delete this participant?</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteParticipant}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
