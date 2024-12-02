"use client";
import { toast } from "sonner";

import { Link } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const MeetingCopy = ({ meetingId }: { meetingId: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_SITE_URL}/meeting/${meetingId}`
      );
      toast.success("Meeting link copied to clipboard");
    } catch (error) {
      console.error("Error copying meeting link:", error);
      toast.error("Error copying meeting link");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="border-primary text-primary bg-primary/10 hover:bg-primary/30 hover:text-primary"
            onClick={handleCopy}
          >
            <Link className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border-primary">
          <p>Copy meeting link</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MeetingCopy;
