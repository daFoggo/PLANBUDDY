"use client";
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
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const MeetingDelete = ({
  meetingId,
  isOwner,
}: {
  meetingId: string;
  isOwner: boolean;
}) => {
  const t = useTranslations("MeetingDelete");
  const { status } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/meeting?meetingId=${meetingId}`, {
        method: "DELETE",
      });

      setIsLoading(false);
      toast.success(t("toast.success"));
      router.push("/dashboard/");
      router.refresh();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error(t("toast.error"));
    }
  };

  if (status === "authenticated" && isOwner) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/30 hover:border-red-600 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95%] sm:w-[625px] rounded-lg"
        >
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription></DialogDescription>
          <p>{t("dialog.description")}</p>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">{t("dialog.button.cancel")}</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.button.deleting")}
                </>
              ) : (
                t("dialog.button.delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default MeetingDelete;
