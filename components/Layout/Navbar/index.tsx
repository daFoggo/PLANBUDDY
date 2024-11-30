"use client";
import MainNav from ".//main-nav";
import MobileNav from "./mobile-nav";
import LoginButton from "@/components/features/Auth/LoginButton";
import { navItems } from "./constant";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import MeetingCUDialog from "@/components/features/MeetingCUForm/MeetingCUDialog";
import { useAuth } from "@/hooks/use-auth";

const NavBar = () => {
  const { session, status } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center p-4">
      {
        status === "authenticated" ? (
          <MainNav items={navItems} />
        ) : (
          <MainNav items={navItems.filter((item) => !item.auth)} />
        )
      }
      <MobileNav items={navItems} />
      <div className="flex flex-1 items-center justify-end space-x-4">
        {session ? <MeetingCUDialog manageType="create" /> : null}
        <ThemeToggle />
        <LoginButton status={status} session={session} />
      </div>
    </header>
  );
};

export default NavBar;
