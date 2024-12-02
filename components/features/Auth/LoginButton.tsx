"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import UserMenu from "./UserMenu";
import GuestLoginForm from "./GuestLoginForm";

import { ILoginButtonProps } from "@/types/login-button";
import LoginDialogContent from "./LoginDialogContent";

const LoginButton = ({ status, session }: ILoginButtonProps) => {
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
          <Button>Login</Button>
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
