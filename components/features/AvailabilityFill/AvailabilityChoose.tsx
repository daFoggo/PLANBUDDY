import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ParticipantList from "./ParticipantList";
import { Separator } from "@/components/ui/separator";

const AvailabilityChoose = () => {
  return (
    <Card className="p-4">
      <CardContent className="p-0 flex flex-col gap-4">
        <ParticipantList />
        <Separator />
      </CardContent>
    </Card>
  );
};

export default AvailabilityChoose;
