"use client";
import { useTranslations } from "next-intl";
import LoginDialogContent from "@/components/features/Auth/LoginDialogContent";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const GetStarted = () => {
  const t = useTranslations('Landing.Hero.GetStarted.button');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          setIsDialogOpen(true);
          console.log("Get Started button clicked");
        }}
      >
        {t("text")}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95%] sm:w-[425px] rounded-lg"
        >
          <LoginDialogContent setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetStarted;
