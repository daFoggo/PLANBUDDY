"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import GuestLoginForm from "./GuestLoginForm";

const LoginDialogContent = ({
  setIsDialogOpen,
}: {
  setIsDialogOpen: (state: boolean) => void;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Login</DialogTitle>
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
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <Button
          onClick={() => signIn("google")}
          className="w-full"
          variant="outline"
        >
          <FaGoogle className="size-4" />
          Continue with Google
        </Button>
      </div>
    </>
  );
};

export default LoginDialogContent;
