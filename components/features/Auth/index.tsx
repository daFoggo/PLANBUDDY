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
import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import UserMenu from "./UserMenu";

const LoginButton = () => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" className="w-8 h-8 rounded-full animate-pulse" />
    );
  }

  if (status === "unauthenticated") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Login</Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95%] sm:w-425px rounded-lg"
        >
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Start login to use our application
            </DialogDescription>
            <div className="w-full flex flex-col gap-4">
              <Button onClick={() => signIn("google")} leftIcon={<FaGoogle />}>
                Continued with Google
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>  
      </Dialog>
    );
  }

  return <UserMenu />;
};

export default LoginButton;
