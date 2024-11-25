"use client";
import MainNav from ".//main-nav";
import MobileNav from "./mobile-nav";
import LoginButton from "@/components/features/Auth/LoginButton";
import { navItems } from "./constant";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useSession } from "next-auth/react";
import MeetingManageDialog from "@/components/features/MeetingManagement/MeetingManageDialog";

const NavBar = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center p-6">
      <MainNav items={navItems} />
      <MobileNav items={navItems} />
      <div className="flex flex-1 items-center justify-end space-x-4">
        {session ? <MeetingManageDialog /> : null}
        <ThemeToggle />
        <LoginButton />
      </div>
    </header>
  );
};

export default NavBar;
