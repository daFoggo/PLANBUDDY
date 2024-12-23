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
import { Download, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

const MeetingQRGen = ({ meetingId }: { meetingId: string }) => {
  const handleDownloadQR = async () => {
    const canvas = document.getElementById("qrcode") as HTMLCanvasElement;
    if (!canvas) {
      toast.error("QR Code not found");
      return;
    }
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `meeting-${meetingId}-qr.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary text-primary bg-primary/10 hover:bg-primary/30 hover:text-primary"
        >
          <QrCode className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-[625px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Meeting QR Code</DialogTitle>
          <DialogDescription>
            Share this to other peoples to join the meeting
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center gap-4">
          <QRCodeCanvas
            value={`${process.env.NEXT_PUBLIC_SITE_URL}/meeting/${meetingId}`}
            level="H"
            size={256}
            id="qrcode"
            marginSize={2}
          />
          <Button
            className=""
            onClick={handleDownloadQR}
          >
            <Download className="size-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingQRGen;
