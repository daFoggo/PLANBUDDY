import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IMeeting } from "@/types/dashboard";
import ParticipantList from "./ParticipantList";

const AvailabilityChoose = ({meeting, isOwner }: {meeting: IMeeting, isOwner: boolean }) => {

  return (
    <Card className="p-4">
      <CardContent className="p-0 flex flex-col gap-4">
        <ParticipantList participants={meeting.participants} isOwner={isOwner}  />
        <Separator />
      </CardContent>
    </Card>
  );
};

export default AvailabilityChoose;
