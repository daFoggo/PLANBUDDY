import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ParticipantList from "./ParticipantList";
import { Separator } from "@/components/ui/separator";
import { IMeeting } from "@/types/dashboard";

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
