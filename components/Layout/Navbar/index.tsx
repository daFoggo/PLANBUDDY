"use client";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import LoginButton from "@/components/features/Auth/LoginButton";
import MeetingCUDialog from "@/components/features/MeetingCUForm/MeetingCUDialog";
import { useAuth } from "@/hooks/use-auth";
import MainNav from ".//main-nav";
import { navItems } from "./constant";
import MobileNav from "./mobile-nav";

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
        {session ? <MeetingCUDialog manageType="create" isOwner={true} /> : null}
        <LanguageToggle />
        <ThemeToggle />
        <LoginButton status={status} session={session} />
      </div>
    </header>
  );
};

export default NavBar;
