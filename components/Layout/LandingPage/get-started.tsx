"use client";
import LoginDialogContent from "@/components/features/Auth/LoginDialogContent";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GetStarted = () => {
  const router = useRouter();
  const { status } = useAuth();

  const t = useTranslations("Landing.Hero.GetStarted.button");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          if (status === "authenticated") {
            router.push("/dashboard");
          } else {
            setIsDialogOpen(true);
          }
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
