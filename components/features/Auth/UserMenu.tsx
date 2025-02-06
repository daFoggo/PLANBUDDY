"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

interface UserMenuProps {
  session: Session | null;
}

const UserMenu = ({ session }: UserMenuProps) => {
  const t = useTranslations("Navbar.LoginButton.UserMenu");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={session?.user?.image || undefined}
              alt={session?.user?.name || t("dropdown.trigger.avatar.alt")}
            />
            <AvatarFallback>
              {session?.user?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          {t("dropdown.content.items.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("dropdown.content.items.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
