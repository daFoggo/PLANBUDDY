"use client";

import { toast } from "sonner";
import { Download, Link, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";

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

    let downloadLink = document.createElement("a");
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
      <DialogContent>
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
            leftIcon={<Download className="size-4" />}
          >
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingQRGen;
