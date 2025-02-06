"use client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

const MeetingCopy = ({ meetingId }: { meetingId: string }) => {
  const t = useTranslations("MeetingCopy");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_SITE_URL}/meeting/${meetingId}`
      );
      toast.success(t("toast.success"));
    } catch (error) {
      console.error("Error copying meeting link:", error);
      toast.error(t("toast.error"));
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
          <p>{t("tooltip")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MeetingCopy;
