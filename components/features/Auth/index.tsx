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
import { useState } from "react";
import UserMenu from "./UserMenu";
import GuestLoginForm from "./GuestLoginForm";

const LoginButton = () => {
  const { status } = useSession();
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
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Start login to use our application
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <GuestLoginForm onClose={() => setIsDialogOpen(false)} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm font-semibold">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <Button
              onClick={() => signIn("google")}
              className="w-full"
              variant="outline"
            >
              <FaGoogle className="mr-2" />
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <UserMenu />;
};

export default LoginButton;
