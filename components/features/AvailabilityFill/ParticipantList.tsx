"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { IMeetingParticipant, IUser } from "@/types/dashboard";
import { AvatarImage } from "@radix-ui/react-avatar";
import { UserRoundX, Users } from "lucide-react";
import { useState } from "react";

const ParticipantList = () => {
  const [participants, setParticipants] = useState<IMeetingParticipant[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Users className="size-4" />
        <h1 className="font-semibold text-xl">Participants</h1>
      </div>
      <div className="flex flex-col gap-2">
        {participants.map((participant) => (
          <Participant key={participant.id} participant={participant.user} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;

const Participant = ({ participant }: { participant: IUser }) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar
        key={participant.id}
        className="h-6 w-6 border-2 border-background"
      >
        <AvatarImage src={participant.image} alt={participant.name} />
        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{participant.name}</span>
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost" size="sm">
            <UserRoundX className="size-2" />
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};
