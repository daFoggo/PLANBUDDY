"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarCog, CalendarPlus } from "lucide-react";
import { useState } from "react";
import MeetingCUForm from "./MeetingCUForm";

import { useAuth } from "@/hooks/use-auth";
import { IMeetingCUDialogProps } from "@/types/meeting-cu-dialog";
import { useTranslations } from "next-intl";

const MeetingCUDialog = ({
  manageType,
  meetingData,
  isOwner,
}: IMeetingCUDialogProps) => {
  const t = useTranslations("Navbar.MeetingCUDialog");
  const { status } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {manageType === "create" ? (
          <Button>
            <CalendarPlus className="size-4" />
            {t("button.text.create")}
          </Button>
        ) : status === "authenticated" && isOwner ? (
          <Button>
            <CalendarCog className="size-4" />
            {t("button.text.edit")}
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-[625px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {manageType === "create" ? t("dialog.title.create") : t("dialog.title.create")}
          </DialogTitle>
          <DialogDescription>
            {manageType === "create"
              ? t("dialog.description.create")
              : t("dialog.description.edit")}
          </DialogDescription>
          <MeetingCUForm
            onClose={() => setIsOpen(false)}
            meetingData={meetingData}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingCUDialog;
