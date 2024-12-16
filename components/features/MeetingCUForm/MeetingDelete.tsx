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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const MeetingDelete = ({ meetingId, isOwner }: { meetingId: string, isOwner: boolean }) => {
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
      toast.success("Meeting deleted successfully");
      router.push("/dashboard/");
      router.refresh();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Error deleting meeting");
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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle>Delete confirm</DialogTitle>
          <DialogDescription></DialogDescription>
          <p>Are you sure you want to delete this meeting?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} type="submit">
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
    );
  }

  return null;
};

export default MeetingDelete;
