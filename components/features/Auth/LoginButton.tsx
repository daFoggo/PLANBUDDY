"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import UserMenu from "./UserMenu";

import { ILoginButtonProps } from "@/types/login-button";
import LoginDialogContent from "./LoginDialogContent";
import { useTranslations } from "next-intl";

const LoginButton = ({ status, session }: ILoginButtonProps) => {
  const t = useTranslations("Navbar.LoginButton");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  if (status === "loading") {
    return (
      <Button variant="ghost" className="w-8 h-8 rounded-full animate-pulse" />
    );
  }

  if (status === "unauthenticated") {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>{t("text")}</Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95%] sm:w-[425px] rounded-lg"
        >
          <LoginDialogContent setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return <UserMenu session={session} />;
};

export default LoginButton;
